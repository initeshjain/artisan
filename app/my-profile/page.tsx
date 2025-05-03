import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import DashboardTabs from "@/components/dashboard-tabs"
import getUser from "@/lib/utils/user"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = await getUser();

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