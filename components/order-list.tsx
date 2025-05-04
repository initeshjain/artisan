"use client"

import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/price"
import { useEffect, useState } from "react"
import { Prisma } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import React from "react"
import Link from "next/link"
import { ScrollArea } from "./ui/scroll-area"
import { Package } from "lucide-react"

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

export default function OrderList() {
  const { data: session, status } = useSession() // Get session and status from NextAuth
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null) // State to manage which order's items are expanded
  const router = useRouter() // Initialize router for redirection

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login") // Redirect to login if not logged in
      return
    }

    // Fetch orders if logged in
    (async () => {
      const res = await fetch("/api/orders")
      const orders = await res.json()
      setOrders(orders)
    })()
  }, [])

  const toggleOrderItems = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId)) // Toggle visibility of order items for this order
  }

  console.log(orders)

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Package className="h-8 w-8 mb-2" />
          <p>No orders yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), "PPP")}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => toggleOrderItems(order.id)}>
                      {expandedOrderId === order.id ? "Hide Items" : "Show Items"}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedOrderId === order.id && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="ml-4 mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderItems.map((orderItem) => (
                              <TableRow>
                                <TableCell><img src={orderItem.product.images && orderItem.product.images[0]} alt={orderItem.product.title} width={50} height={50} /></TableCell>
                                <TableCell className="underline"><Link href={`/products/${orderItem.product.id}`}>{orderItem.product.title}</Link></TableCell>
                                <TableCell>₹{orderItem.product.price}</TableCell>
                                <TableCell>{orderItem.quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </ScrollArea>
  )
}
