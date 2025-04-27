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

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        address: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log("[PROFILE_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, address } = body

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        address: {
          upsert: {
            create: address,
            update: address,
          },
        },
      },
      include: {
        address: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log("[PROFILE_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}