"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category, Product } from "@/types/types"
import { formatPrice } from "@/lib/price"

export default function ProductGrid({ products, categories }: { products: Product[], categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState("")
  console.log(categories)
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.id === selectedCategory)
    : products

  return (
    <div>
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          {/* <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.length != 0 && categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent> */}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <div className="flex items-center justify-between w-full">
                  <p className="text-primary">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    by {product.user.name}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}