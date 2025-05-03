import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, description } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    })

    if (existingCategory) {
      return new NextResponse("Category already exists", { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        approved: false,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        approved: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.log("[CATEGORIES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}