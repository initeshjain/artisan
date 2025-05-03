import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderStatus } from "@prisma/client"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const orders = await prisma.sellerOrder.findMany({
            where: {
                sellerUserId: session.user.id,
            },
            include: {
                order: {
                    include: {
                        orderItems: {
                            include: {
                                product: true
                            }
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.log("[SELLERS_ORDERS_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { orderId, status } = await req.json()

        if (!orderId || !status) {
            return new NextResponse("Bad Request: Missing orderId or status", { status: 400 })
        }

        // Ensure the status is a valid OrderStatus value
        if (!Object.values(OrderStatus).includes(status)) {
            return new NextResponse("Bad Request: Invalid status", { status: 400 })
        }

        // Find the order related to the seller
        const sellerOrder = await prisma.sellerOrder.findUnique({
            where: {
                orderId: orderId, // Find SellerOrder by orderId
            },
            include: {
                order: true, // Include the Order to check sellerUserId
            },
        })

        console.log(orderId)
        console.log(sellerOrder)

        console.log(sellerOrder?.sellerUserId)
        console.log(session.user.id)

        // Check if the order exists and belongs to the current user
        if (!sellerOrder || sellerOrder?.sellerUserId !== session.user.id) {
            return new NextResponse("Forbidden: Order not found or not owned by user", { status: 403 })
        }

        // Update the status of the order in the Order model
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status as OrderStatus, // Set the new status
            },
        })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.log("[SELLERS_ORDERS_PUT]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}