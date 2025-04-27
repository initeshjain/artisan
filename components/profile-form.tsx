"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function ProfileForm({ user }) {
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
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
        <Input
          id="street"
          name="street"
          placeholder="Street Address"
          defaultValue={user.address?.street || ""}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
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
  )
}