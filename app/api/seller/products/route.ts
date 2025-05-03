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
                sellerId: session.user.id,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log("[PRODUCTS_POST]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

// GET: Fetch all products of the current seller
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const products = await prisma.product.findMany({
            where: {
                sellerId: session.user.id,
            },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("[PRODUCTS_GET]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

// // PUT: Update an existing product (by ID)
// export async function PUT(req: Request) {
//     try {
//         const session = await getServerSession(authOptions)

//         if (!session?.user?.id) {
//             return new NextResponse("Unauthorized", { status: 401 })
//         }

//         const body = await req.json()
//         const { id, title, description, price, categoryId, images, keywords, isActive } = body

//         if (!id) {
//             return new NextResponse("Product ID is required", { status: 400 })
//         }

//         const updatedProduct = await prisma.product.update({
//             where: {
//                 id,
//                 sellerId: session.user.id,
//             },
//             data: {
//                 title,
//                 description,
//                 price,
//                 categoryId,
//                 images,
//                 keywords,
//                 isActive,
//             },
//         })

//         return NextResponse.json(updatedProduct)
//     } catch (error) {
//         console.error("[PRODUCTS_PUT]", error)
//         return new NextResponse("Internal Server Error", { status: 500 })
//     }
// }

// // DELETE: Delete a product (by ID)
// export async function DELETE(req: Request) {
//     try {
//         const session = await getServerSession(authOptions)

//         if (!session?.user?.id) {
//             return new NextResponse("Unauthorized", { status: 401 })
//         }

//         const { searchParams } = new URL(req.url)
//         const id = searchParams.get("id")

//         if (!id) {
//             return new NextResponse("Product ID is required", { status: 400 })
//         }

//         await prisma.product.delete({
//             where: {
//                 id,
//                 sellerId: session.user.id,
//             },
//         })

//         return new NextResponse("Product deleted successfully", { status: 200 })
//     } catch (error) {
//         console.error("[PRODUCTS_DELETE]", error)
//         return new NextResponse("Internal Server Error", { status: 500 })
//     }
// }
