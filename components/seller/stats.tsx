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

    if (!stats) return <div>Loading stats...</div>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-light">Total Orders</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {stats.totalOrders}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-light">Completed Orders</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {stats.completedOrders}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-light">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    ₹{stats.totalRevenue.toFixed(2)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-light">GST (18%)</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    ₹{stats.gst.toFixed(2)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-light">Commission (1%)</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    ₹{stats.commission.toFixed(2)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-light">Net Earnings</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-green-600">
                    ₹{stats.netEarnings.toFixed(2)}
                </CardContent>
            </Card>
        </div>
    )
}
