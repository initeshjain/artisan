import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.id) {
      return new NextResponse("Order id required", { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.log("[ORDER_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!params.id) {
      return new NextResponse("Order id required", { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        notification: {
          create: {
            userId: session.user.id,
            type: "ORDER_UPDATED",
            message: `Your order status has been updated to ${status}`,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.log("[ORDER_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}