"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Cart as CartType, useCart } from "@/lib/cart"
import { toast } from "sonner"
import { formatPrice } from "@/lib/price"
import { CheckoutButton } from "./checkout-button"

// type UserAddress = {
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     postalCode: string;
//     phone: string;
//     id: string;
//     userId: string;
//   }
// }

export default function Cart() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  // async function onCheckout() {
  //   try {

  //     const profileres = await fetch("/api/profile")
  //     const user: UserAddress = await profileres.json()

  //     setIsLoading(true)

  //     const cart: CartType = {
  //       cartItems: items,
  //       subTotal: total(),
  //       address: `${user?.address?.street}, ${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}, ${user?.address?.postalCode}`,
  //       phone: user?.address?.phone
  //     }

  //     const response = await fetch("/api/orders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(cart),
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to create order")
  //     }

  //     clearCart()
  //     setIsOpen(false)
  //     toast.success("Order placed successfully!")
  //     router.push("/my-profile")
  //   } catch (error) {
  //     toast.error("Please login or signup")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
                {/* <Button
                  className="w-full mt-4"
                  onClick={onCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </Button> */}

                <CheckoutButton setIsLoading={setIsLoading} setIsOpen={setIsOpen} isLoading={isLoading} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}