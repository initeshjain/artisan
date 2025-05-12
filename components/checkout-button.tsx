"use client"

import { Cart as CartType, useCart } from "@/lib/cart"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { UserWithAddress } from "@/types/types"

type RazorpayResponse = {
    razorpayOrderId: string
    paymentSessionId: string
    razorpayKey: string
}

export function CheckoutButton({
    setIsLoading,
    setIsOpen,
    isLoading,
}: {
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    isLoading: boolean
}) {
    const { items, total, clearCart } = useCart()
    const router = useRouter()


    async function onCheckout() {
        try {
            setIsLoading(true)

            const profileres = await fetch("/api/profile")
            const user: UserWithAddress = await profileres.json()

            const cart: CartType = {
                cartItems: items,
                subTotal: total(),
                address: `${user?.address?.street}, ${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}, ${user?.address?.postalCode}`,
                phone: user?.address?.phone,
            }

            // Step 1: Create Razorpay order + backend orders
            const res = await fetch("/api/checkout/razorpay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cart),
            })

            if (!res.ok) {
                toast.error("Failed to create order")
                throw new Error("Failed to create Razorpay order")
            }

            const data: RazorpayResponse = await res.json()
            const { razorpayOrderId, paymentSessionId, razorpayKey } = data

            // Step 2: Open Razorpay checkout modal
            const razorpay = new (window as any).Razorpay({
                key: razorpayKey,
                amount: Math.round(cart.subTotal * 100),
                currency: "INR",
                name: user.name,
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async function (response: any) {

                    // log
                    console.info(Date.now(), user.name, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)

                    // Step 3: On success, verify
                    const verifyRes = await fetch("/api/checkout/razorpay/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentSessionId,
                        }),
                    })

                    if (!verifyRes.ok) {
                        toast.error("Payment verification failed")
                        return
                    }

                    clearCart()
                    setIsOpen(false)
                    toast.success("Order placed successfully!")
                    router.push("/my-profile")
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: cart.phone,
                },
                theme: {
                    color: "#6366f1",
                },
            })

            razorpay.open()
        } catch (error) {
            console.error(error)
            toast.error("Please login or try again")
        } finally {
            setIsLoading(false)
        }
    }


    return <Button
        className="w-full mt-4"
        disabled={isLoading}
        onClick={onCheckout}>{isLoading ? "Processing..." : "Checkout"}</Button>
}
