import { prisma } from "@/lib/prisma"
import ProductGrid from "@/components/product-grid"
import { ProductSearch } from "@/components/product-search"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const { q, category } = searchParams

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { keywords: { has: q } },
            ],
          }
          : {},
        category ? { categoryId: category } : {},
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

  const categories = await prisma.category.findMany({
    where: {
      approved: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-8">Browse Artworks</h1>
      <div className="mb-8">
        <ProductSearch />
      </div>
      <ProductGrid products={products} categories={categories} />
    </div>
  )
}