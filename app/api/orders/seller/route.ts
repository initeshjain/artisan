import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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