"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import OrderList from "@/components/seller/order-list"
import MyProductsPage from "./MyProductsPage"

export default function SellerTabs() {
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
          <OrderList />
        </Card>
      </TabsContent>

    </Tabs>
  )
}