"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type Stats = {
    totalOrders: number
    completedOrders: number
    totalRevenue: number
    gst: number
    commission: number
    netEarnings: number
}

export default function StatsCard() {
    const [stats, setStats] = useState<Stats | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/seller/stats")
                const data = await res.json()
                setStats(data)
            } catch (error) {
                toast.error("Failed to fetch stats: " + error)
            }
        }

        fetchStats()
    }, [])

    if (!stats) return <div className="text-center py-10 text-gray-500">Loading stats...</div>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
            {[
                { title: "Total Orders", value: stats.totalOrders },
                { title: "Completed Orders", value: stats.completedOrders },
                { title: "Total Revenue", value: `₹${stats.totalRevenue.toFixed(2)}` },
                { title: "GST (18%)", value: `₹${stats.gst.toFixed(2)}` },
                { title: "Commission (1%)", value: `₹${stats.commission.toFixed(2)}` },
                { title: "Net Earnings", value: `₹${stats.netEarnings.toFixed(2)}`, className: "text-green-600" },
            ].map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle className="font-light  text-gray-600">
                            {item.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={`text-2xl sm:text-3xl font-semibold break-words ${item.className ?? ""}`}>
                        {item.value}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
