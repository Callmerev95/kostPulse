import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/actions/dashboard"
import {
  TrendingUp,
  Home,
  AlertCircle,
  Activity,
} from "lucide-react"

// Helper format IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  // Panggil Server Action yang sudah kita buat tadi
  const { stats, income, overdueCount } = await getDashboardStats(user.id)

  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ringkasan Kost</h1>
          <p className="text-slate-500 text-sm">Statistik performa bisnis Anda bulan ini.</p>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700 uppercase">Sistem Online</span>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Total Pemasukan (Bulan Ini) */}
        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Pendapatan Lunas</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{formatIDR(income.paid)}</h3>
          <p className="text-xs text-slate-400 mt-1 italic">Periode bulan ini</p>
        </div>

        {/* Okupansi Kamar */}
        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Okupansi Kamar</p>
            <Home className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold">{occupancyRate}%</h3>
            <span className="text-xs text-slate-400 mb-1">({stats.occupied}/{stats.total})</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Tagihan Belum Bayar */}
        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Tagihan Pending</p>
            <Activity className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{income.pending > 0 ? formatIDR(income.pending) : "Rp 0"}</h3>
          <p className="text-xs text-orange-600 mt-1 font-medium">Belum terbayar</p>
        </div>

        {/* Tenant Overdue (Nunggak) */}
        <div className={`p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow ${overdueCount > 0 ? "bg-red-50 border-red-100" : "bg-white"}`}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Lewat Jatuh Tempo</p>
            <AlertCircle className={`w-4 h-4 ${overdueCount > 0 ? "text-red-500" : "text-slate-300"}`} />
          </div>
          <h3 className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-slate-900"}`}>
            {overdueCount} <span className="text-sm font-normal text-slate-500">Orang</span>
          </h3>
          {overdueCount > 0 ? (
            <p className="text-xs text-red-500 mt-1 animate-pulse font-medium">🚨 Butuh tindakan segera</p>
          ) : (
            <p className="text-xs text-slate-400 mt-1 italic">Semua aman terkendali</p>
          )}
        </div>
      </div>

      {/* Placeholder untuk section berikutnya */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-10 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400">
          Chart Pendapatan (Coming Soon)
        </div>
        <div className="p-10 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400">
          Aktivitas Terbaru (Coming Soon)
        </div>
      </div>
    </div>
  )
}