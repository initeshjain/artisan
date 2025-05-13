"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FullUser } from "@/types/types"
import { Card } from "@/components/ui/card"

export default function ProfileForm({ user }: { user: FullUser }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get("name"),
        address: {
          street: formData.get("street"),
          city: formData.get("city"),
          state: formData.get("state"),
          postalCode: formData.get("postalCode"),
          country: formData.get("country"),
          phone: formData.get("phone"),
        },
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            defaultValue={user.name || ""}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Address</label>
          <Input
            id="address"
            name="address"
            placeholder="Street Address"
            defaultValue={user.address?.street || ""}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">City</label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              defaultValue={user.address?.city || ""}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-700">State</label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              defaultValue={user.address?.state || ""}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">Postal Code</label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="Postal Code"
              defaultValue={user.address?.postalCode || ""}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">Country</label>
            <Input
              id="country"
              name="country"
              placeholder="Country"
              defaultValue={user.address?.country || ""}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone Number"
            defaultValue={user.address?.phone || ""}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Card>
  )
}