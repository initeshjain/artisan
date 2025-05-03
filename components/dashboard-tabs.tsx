"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import OrderList from "@/components/order-list"
import NotificationList from "@/components/notification-list"
import ProfileForm from "@/components/profile-form"
import { User } from "@prisma/client"

export default function DashboardTabs({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Profile</h2>
          <ProfileForm user={user} />
        </Card>
      </TabsContent>

      <TabsContent value="orders">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Orders</h2>
          <OrderList />
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
          <NotificationList />
        </Card>
      </TabsContent>
    </Tabs>
  )
}