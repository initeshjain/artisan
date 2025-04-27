"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import OrderList from "@/components/order-list"
import { User } from "@/types/types"
import MyProductsPage from "./MyProductsPage"

export default function SellerTabs({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">My Products</h2>
          <MyProductsPage />
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Orders</h2>
          <OrderList orders={user.orders} />
        </Card>
      </TabsContent>

    </Tabs>
  )
}