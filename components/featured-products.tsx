"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/price"

type Product = {
  id: string
  title: string
  price: number
  images: string[]
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch featured products from API
    // For now, using placeholder data
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          title: "Handcrafted Wooden Bowl",
          price: 89.99,
          images: ["https://images.unsplash.com/photo-1635363638580-6c3c5e599343?w=800&q=80"],
        },
        {
          id: "2",
          title: "Carved Wall Art",
          price: 199.99,
          images: ["https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=800&q=80"],
        },
        {
          id: "3",
          title: "Wooden Sculpture",
          price: 299.99,
          images: ["https://images.unsplash.com/photo-1595856619767-ab951ca3b5c7?w=800&q=80"],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <AspectRatio ratio={4/3}>
                <Skeleton className="h-full w-full" />
              </AspectRatio>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <AspectRatio ratio={4/3}>
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
              <p className="text-primary">{formatPrice(product.price)}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}