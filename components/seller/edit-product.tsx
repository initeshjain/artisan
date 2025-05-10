"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import axios from "axios"
import { Category, Product } from "@prisma/client"

export default function EditProductForm({ id, onClose }: { id: string; onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [product, setProduct] = useState<Partial<Product>>({})
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden"

    return () => {
      // Re-enable scroll when modal unmounts
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodRes, catsRes] = await Promise.all([
          axios.get<Product>(`/api/seller/products/${id}`),
          axios.get<Category[]>("/api/categories"),
        ])

        setProduct(prodRes.data)
        setImages(prodRes.data.images || [])
        setCategories(catsRes.data)
      } catch (err) {
        toast.error("Failed to load product or categories")
      }
    }

    fetchInitialData()
  }, [id])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        id,
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        categoryId: formData.get("category"),
        images,
        keywords: formData
          .get("keywords")
          ?.toString()
          .split(",")
          .map((k) => k.trim()),
      }

      const res = await fetch(`/api/seller/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to update product")

      toast.success("Product updated")
      router.refresh()
      onClose() // Close modal
    } catch (err) {
      toast.error("Update failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Product</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <Input
              id="title"
              name="title"
              placeholder="Product Title"
              defaultValue={product.title}
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>

            <div className="mb-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 inline-block">
              💡 Tip: You can paste HTML here to nicely format your description
            </div>

            <Textarea
              id="description"
              name="description"
              placeholder="Product Description"
              defaultValue={product.description ?? ""}
              required
              disabled={isLoading}
            />
          </div>


          {/* Price */}
          <div>
            <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">₹ Price</label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price?.toString()}
              required
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <Select name="category" required defaultValue={product.categoryId ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="keywords" className="block mb-1 text-sm font-medium text-gray-700">Keywords (comma separated)</label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="e.g. eco, organic, durable"
              defaultValue={product.keywords?.join(", ") ?? ""}
              disabled={isLoading}
            />
          </div>

          {/* Image Input */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Images</label>
            <div className="mb-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 inline-block">
              📝 Note: You need to upload images on platform like imagekit and paste public link here
            </div>
            <Input
              type="url"
              placeholder="Image URL"
              onChange={(e) => {
                if (e.target.value) {
                  setImages([...images, e.target.value])
                  e.target.value = ""
                }
              }}
              disabled={isLoading}
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center hover:bg-red-600"
                      onClick={() => setImages(images.filter((_, index) => index !== i))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
