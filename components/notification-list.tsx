"use client"

import { format } from "date-fns"
import { Bell } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Notification } from "@prisma/client"

export default function NotificationList() {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/notifications")
      const notifications = await res.json()
      setNotifications(notifications)
    })()
  }, [])

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }



  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Bell className="h-8 w-8 mb-2" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${notification.read ? "bg-muted" : "bg-primary/5"
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(notification.createdAt), "PPP")}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}