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
import { OrderStatus, Prisma } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import React from "react"
import Link from "next/link"
import { toast } from "sonner"

type SellerOrderWithRelations = Prisma.SellerOrderGetPayload<{
  include: {
    order: {
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    }
  }
}>

export default function OrderList() {
  const { data: session, status } = useSession() // Get session and status from NextAuth
  const [orders, setOrders] = useState<SellerOrderWithRelations[]>([])
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
      const res = await fetch("/api/seller/orders")
      const orders = await res.json()
      setOrders(orders)
    })()
  }, [router])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/seller/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      })

      if (res.ok) {
        // Refetch orders after successful status update
        toast.success("Order updated")
        await refetchOrders()
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      toast.error("Error updating order status: " + error)
    }
  }

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.ACCEPTED)
  }

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.REJECTED)
  }

  const handleInProgress = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.INPROGRESS)
  }

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.COMPLETED)
  }

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.CANCELED)
  }

  const refetchOrders = async () => {
    try {
      const res = await fetch("/api/seller/orders")
      const orders = await res.json()
      setOrders(orders) // Update the orders in the state
    } catch (error) {
      toast.error("Error refetching orders: " + error)
    }
  }

  const toggleOrderItems = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId)) // Toggle visibility of order items for this order
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <TableRow>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{format(new Date(order.createdAt), "PPP")}</TableCell>
              <TableCell>{order.order.status}</TableCell>
              <TableCell>{formatPrice(order.order.total)}</TableCell>
              <TableCell>{`${order.order.address} ${order.order.phone}`}</TableCell>
              {order.order.status === OrderStatus.PENDING && (
                <React.Fragment>
                  <TableCell>
                    <Button onClick={() => handleAccept(order.order.id)}>Accept</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleReject(order.order.id)}>Reject</Button>
                  </TableCell>
                </React.Fragment>
              )}

              <TableCell>
                <Button title="mark in progress" variant="outline" onClick={() => handleInProgress(order.order.id)}>🚚</Button>
              </TableCell>

              <TableCell>
                <Button title="mark complete" variant="outline" onClick={() => handleComplete(order.order.id)}>✔</Button>
              </TableCell>

              <TableCell>
                <Button title="mark cancel" variant="outline" onClick={() => handleCancel(order.order.id)}>❌</Button>
              </TableCell>

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
                        {order.order.orderItems.map((orderItem) => (
                          <TableRow>
                            <TableCell><img src={orderItem.product.images && orderItem.product.images[0]} alt={orderItem.product.title} width={50} height={50} /></TableCell>
                            <TableCell><Link href={`/products/${orderItem.product.id}`}>{orderItem.product.title}</Link></TableCell>
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
    </Table >
  )
}
