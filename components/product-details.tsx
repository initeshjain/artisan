"use client"

import { CartItem } from "@/lib/cart"
import ImageGallery from "./ImageGallery"
import ProductInfo from "./ProductInfo"
import PriceDisplay from "./PriceDisplay"
import AddToCartForm from "./AddToCartForm"
import { ProductWithCategoryAndSeller } from "@/types/types"

export default function ProductDetails({ product }: { product: ProductWithCategoryAndSeller }) {

  const cartItem: CartItem = {
    id: product.id,
    image: product.images[0],
    price: product.price,
    quantity: 1,
    title: product.title,
    sellerId: product.sellerId
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageGallery images={product.images} productTitle={product.title} />
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <ProductInfo
              title={product.title}
              category={product.category.name}
              description={product.description}
            />

            <hr className="border-gray-200" />

            <PriceDisplay price={product.price} />

            <AddToCartForm cartItem={cartItem} />

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-2 text-sm text-gray-500 space-y-2">
                <p>Free shipping on orders over $50</p>
                <p>30-day hassle-free returns</p>
                <p>2-year warranty included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}