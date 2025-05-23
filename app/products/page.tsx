export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import ProductGrid from "@/components/product-grid"
import { ProductSearch } from "@/components/product-search"
import { ProductWithCategoryAndSeller } from "@/types/types"
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const { q, category } = searchParams

  const products: ProductWithCategoryAndSeller[] = await prisma.product.findMany({
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
        { isActive: true },
        category ? { categoryId: category } : {},
      ],
    },
    include: {
      category: true,
      seller: true,
    },
    orderBy: {
      createdAt: 'desc',
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
    <div className="min-h-screen max-w-screen md:mx-28 p-6">
      <h1 className="text-3xl font-bold mb-8">Browse Artworks</h1>
      <div className="mb-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductSearch />
        </Suspense>
      </div>
      <ProductGrid products={products} categories={categories} />
    </div>
  )
}