import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import DashboardTabs from "@/components/dashboard-tabs"
import getUser from "@/lib/utils/user"
import { FullUser } from "@/types/types"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user: FullUser | null = await getUser();

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <DashboardTabs user={user} />
    </div>
  )
}