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
  link: string
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
          title: "Handcrafted Bomboo Bottle",
          price: 499,
          images: ["https://ik.imagekit.io/noobgeek/Artisan/bomboo-bottle.webp?updatedAt=1748071525344"],
          link: "/products/6831785e21d12192ba1f654e"
        },
        {
          id: "2",
          title: "Wooden Hand Fan",
          price: 299,
          images: ["https://ik.imagekit.io/noobgeek/Artisan/wooden-hand-fan.webp?updatedAt=1748071525527"],
          link: "/products/683179a321d12192ba1f654f"
        },
        {
          id: "3",
          title: "Wooden Hand Made Table Stand",
          price: 4999,
          images: ["https://ik.imagekit.io/noobgeek/Artisan/wooden-handmade-table-stand.webp?updatedAt=1748071525519"],
          link: "/products/683179ef21d12192ba1f6550"
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
              <AspectRatio ratio={4 / 3}>
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
            <Link href={product.link}>
              <CardContent className="p-0">
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contains"
                  />
                </AspectRatio>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-primary">{formatPrice(product.price)}</p>
              </CardFooter>
            </Link>
          </Card>
        </Link>
      ))}
    </div>
  )
}