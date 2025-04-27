import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    console.log("session: ", session)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, price, categoryId, images, keywords } = body

    if (!title || !description || !price || !categoryId || !images?.length) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        images,
        keywords: keywords || [],
        categoryId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const query = searchParams.get("q")

    const products = await prisma.product.findMany({
      where: {
        AND: [
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
        user: {
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