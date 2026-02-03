import { getDashboardStats } from "@/actions/dashboard"
import { createClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen, CheckCircle, Users } from "lucide-react"
import { redirect } from "next/navigation"

/**
 * Halaman utama dashboard yang menampilkan ringkasan bisnis.
 * Mengambil data real-time dari database berdasarkan user yang login.
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect("/login")

  const stats = await getDashboardStats(user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ringkasan Kosan</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Kamar</CardTitle>
            <DoorOpen className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kamar Tersedia</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kamar Terisi</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.occupiedRooms}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}