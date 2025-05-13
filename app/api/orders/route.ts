import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Cart } from "@/lib/cart"
import { PaymentStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const items = body as Cart

    if (!items?.cartItems.length) {
      return new NextResponse("No items in order", { status: 400 })
    }

    // separate orders by seller
    const grouped = new Map<string, typeof items.cartItems>()

    for (const item of items.cartItems) {
      if (!grouped.has(item.sellerId)) grouped.set(item.sellerId, [])
      grouped.get(item.sellerId)!.push(item)
    }

    const createdOrders = []

    for (const [sellerId, sellerItems] of grouped.entries()) {
      const total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )

      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total,
          address: items.address,
          phone: items.phone ?? "",
          paymentStatus: PaymentStatus.PENDING,
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          sellerOrder: {
            create: {
              sellerUserId: sellerId,
            },
          },
          notification: {
            create: {
              userId: session.user.id,
              type: "ORDER_CREATED",
              message: `Order placed. You will get dispatch update soon. Total: ₹${total.toFixed(2)}`,
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

      createdOrders.push(order)
    }

    return NextResponse.json(createdOrders)
  } catch (error) {
    console.error("[ORDERS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[ORDERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
