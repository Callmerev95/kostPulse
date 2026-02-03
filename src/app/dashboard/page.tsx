//import { getDashboardStats } from "@/actions/dashboard"
import { createClient } from "@/lib/supabase-server"
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { DoorOpen, CheckCircle, Users } from "lucide-react"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

// Fungsi untuk memformat angka ke dalam format mata uang Rupiah
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Halaman utama dashboard yang menampilkan ringkasan bisnis.
 * Mengambil data real-time dari database berdasarkan user yang login.
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  // Ambil data secara paralel untuk efisiensi
  const [totalRooms, occupiedRooms, totalRevenue, pendingBills] = await Promise.all([
    prisma.room.count({ where: { userId: user.id } }),
    prisma.room.count({ where: { userId: user.id, status: "OCCUPIED" } }),
    prisma.transaction.aggregate({
      where: {
        tenant: { room: { userId: user.id } },
        status: "PAID"
      },
      _sum: { amount: true }
    }),
    prisma.transaction.count({
      where: {
        tenant: { room: { userId: user.id } },
        status: "PENDING"
      }
    })
  ])

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  const totalRevenueAmount = totalRevenue._sum.amount || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ringkasan Kost</h1>
        <p className="text-slate-500 text-sm">Statistik performa bisnis Anda bulan ini.</p>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Pemasukan */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
          <h3 className="text-2xl font-bold text-green-600">{formatIDR(totalRevenueAmount)}</h3>
        </div>

        {/* Tingkat Okupansi */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm font-medium text-slate-500">Okupansi Kamar</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold">{occupancyRate}%</h3>
            <span className="text-xs text-slate-400 mb-1">({occupiedRooms}/{totalRooms} Kamar)</span>
          </div>
        </div>

        {/* Tagihan Pending */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tagihan Belum Bayar</p>
          <h3 className="text-2xl font-bold text-orange-500">{pendingBills} Tagihan</h3>
        </div>

        {/* Status Sistem */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-sm font-medium text-slate-500">Kesehatan Sistem</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-bold uppercase">Online</h3>
          </div>
        </div>
      </div>

      {/* Nantinya di bawah sini bisa kita tambahkan Chart atau Recent Transactions */}
    </div>
  )
}