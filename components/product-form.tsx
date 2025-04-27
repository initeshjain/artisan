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
import { User, Category } from "@/types/types"
import axios from "axios"

export default function ProductForm({ user }: { user?: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    (async () => {
      let cats = await axios.get("/api/categories")
      setCategories(cats.data as Category[])
    })()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string),
        categoryId: formData.get("category"),
        images,
        keywords: formData.get("keywords")?.toString().split(",").map(k => k.trim()),
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to create product")
      }

      toast.success("Product created successfully")
      router.refresh()
      setImages([])
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Input
          id="title"
          name="title"
          placeholder="Product Title"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Textarea
          id="description"
          name="description"
          placeholder="Product Description"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Input
          id="keywords"
          name="keywords"
          placeholder="Keywords (comma-separated)"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
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
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
}