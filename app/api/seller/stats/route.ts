import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Fetch all orders related to this seller
        const orders = await prisma.sellerOrder.findMany({
            where: {
                sellerUserId: session.user.id,
            },
            include: {
                order: true,
            },
        })

        // Compute stats
        const totalOrders = orders.length
        const completedOrders = orders.filter((o) => o.order.status === "COMPLETED").length
        const totalRevenue = orders
            .filter((o) => o.order.status === "COMPLETED")
            .reduce((sum, o) => sum + o.order.total, 0)

        const gst = parseFloat((totalRevenue * 0.18).toFixed(2))
        const commission = parseFloat((totalRevenue * 0.01).toFixed(2))
        const netEarnings = parseFloat((totalRevenue - gst - commission).toFixed(2))

        return NextResponse.json({
            totalOrders,
            completedOrders,
            totalRevenue,
            gst,
            commission,
            netEarnings,
        })
    } catch (error) {
        console.error("[SELLER_STATS_GET]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
