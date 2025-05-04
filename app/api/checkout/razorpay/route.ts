import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Razorpay from "razorpay"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Cart } from "@/lib/cart"
import { PaymentStatus } from "@prisma/client"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const items = await req.json() as Cart
    if (!items.cartItems.length) return new NextResponse("No items", { status: 400 })

    // Create PaymentSession first
    const paymentSession = await prisma.paymentSession.create({
        data: {
            userId: session.user.id,
            amount: items.subTotal,
        },
    })

    const grouped = new Map<string, typeof items.cartItems>()
    for (const item of items.cartItems) {
        if (!grouped.has(item.sellerId)) grouped.set(item.sellerId, [])
        grouped.get(item.sellerId)!.push(item)
    }

    const createOrders = []

    for (const [sellerId, sellerItems] of grouped.entries()) {
        const total = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total,
                address: items.address,
                phone: items.phone ?? "",
                paymentStatus: PaymentStatus.PENDING,
                paymentSessionId: paymentSession.id,
                orderItems: {
                    create: sellerItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
                sellerOrder: {
                    create: { sellerUserId: sellerId },
                },
                notification: {
                    create: {
                        userId: session.user.id,
                        type: "ORDER_CREATED",
                        message: `Order placed with seller ${sellerId}. Total: ₹${total.toFixed(2)}`,
                    },
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        createOrders.push(order)
    }

    // Now create Razorpay Order using PaymentSession ID
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(items.subTotal * 100),
        currency: "INR",
        receipt: paymentSession.id,
    })

    // Update paymentSession with razorpayOrderId
    await prisma.paymentSession.update({
        where: { id: paymentSession.id },
        data: {
            razorpayOrderId: razorpayOrder.id,
        },
    })

    return NextResponse.json({
        razorpayOrderId: razorpayOrder.id,
        paymentSessionId: paymentSession.id,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
    })
}
