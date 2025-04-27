"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string

    if (search) {
      router.push(`/products?q=${encodeURIComponent(search)}`)
    } else {
      router.push("/products")
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search products..."
        name="search"
        className="pl-9"
        defaultValue={searchParams.get("q") ?? ""}
      />
      <Button type="submit" className="absolute right-1 top-1">
        Search
      </Button>
    </form>
  )
}