import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const id = params.id;

        const { isActive } = await req.json();

        if (!id || typeof isActive !== "boolean") {
            return new NextResponse("Product ID and valid isActive flag are required", {
                status: 400,
            });
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id,
                sellerId: session.user.id,
            },
            data: {
                isActive,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("[PRODUCTS_TOGGLE_PUT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}