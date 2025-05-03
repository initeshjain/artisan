import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const query = searchParams.get("q")

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: true }, // ✅ Only active products
          query
            ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { keywords: { has: query } },
              ],
            }
            : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: {
        category: true,
        seller: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log("[PRODUCTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}