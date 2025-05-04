// app/api/checkout/verify/route.ts
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentSessionId,
        } = body

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const digest = hmac.digest("hex")

        if (digest !== razorpay_signature) {
            return new NextResponse("Invalid signature", { status: 400 })
        }

        // Update PaymentSession
        await prisma.paymentSession.update({
            where: { id: paymentSessionId },
            data: {
                status: "PAID",
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
        })

        // Update all related orders
        await prisma.order.updateMany({
            where: { paymentSessionId },
            data: {
                paymentStatus: "PAID",
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[RAZORPAY_VERIFY]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
