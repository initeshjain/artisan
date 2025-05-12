import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function getUser() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user?.id,
        },
        include: {
            products: {
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            orders: {
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
            },
            notifications: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            address: true,
        },
    })

    return user;
}