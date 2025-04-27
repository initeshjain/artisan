import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductDetails from "@/components/product-details"

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}