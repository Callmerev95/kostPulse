import { redirect } from "next/navigation"
import { getDashboardStats } from "@/actions/dashboard"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import {
  TrendingUp,
  Home,
  AlertCircle,
  Activity,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Helper format IDR yang lebih clean
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const { stats, income, overdueCount } = await getDashboardStats(user.id)
  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Ringkasan <span className="text-[#D4AF37]">Bisnis</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            Statistik performa KostFlow Anda periode bulan ini.
          </p>
        </div>
        <div className="bg-white/[0.03] px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">
            Cloud Engine Active
          </span>
        </div>
      </div>

      {/* Stats Grid - Luxury Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Card 1: Pendapatan */}
        <StatCard
          title="Pendapatan Lunas"
          value={formatIDR(income.paid)}
          icon={<TrendingUp className="w-5 h-5 text-[#D4AF37]" />}
          description="Total dana terkumpul"
          trend="+12.5%" // Ini bisa kita buat dinamis nanti
        />

        {/* Card 2: Okupansi */}
        <StatCard
          title="Okupansi Kamar"
          value={`${occupancyRate}%`}
          icon={<Home className="w-5 h-5 text-[#D4AF37]" />}
          description={`${stats.occupied} dari ${stats.total} Kamar Terisi`}
          progress={occupancyRate}
        />

        {/* Card 3: Pending */}
        <StatCard
          title="Tagihan Pending"
          value={income.pending > 0 ? formatIDR(income.pending) : "Rp 0"}
          icon={<Activity className="w-5 h-5 text-[#D4AF37]" />}
          description="Menunggu pembayaran"
          isWarning={income.pending > 0}
        />

        {/* Card 4: Overdue */}
        <StatCard
          title="Jatuh Tempo"
          value={`${overdueCount} Orang`}
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          description={overdueCount > 0 ? "Tindakan diperlukan segera" : "Semua tagihan lancar"}
          isCritical={overdueCount > 0}
        />
      </div>

      {/* Section Placeholder with Luxury Border */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 aspect-video bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-white/20 font-bold tracking-widest uppercase text-xs z-10">Revenue Analytics Chart</p>
        </div>
        <div className="aspect-square lg:aspect-auto bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-white/20 font-bold tracking-widest uppercase text-xs z-10">Recent Activity</p>
        </div>
      </div>
    </div>
  )
}

// Reusable StatCard Component (Polesan Industry Standard)
function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  progress,
  isWarning,
  isCritical
}: any) { // Ganti ke Interface yang sesuai nanti
  return (
    <div className={cn(
      "relative p-6 rounded-[2rem] border transition-all duration-300 group overflow-hidden",
      isCritical
        ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
        : "bg-white/[0.03] border-white/5 hover:border-[#D4AF37]/30"
    )}>
      {/* Decorative Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/5 blur-3xl rounded-full group-hover:bg-[#D4AF37]/10 transition-all" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
            <ArrowUpRight size={12} />
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{value}</h3>
        <p className={cn(
          "text-[11px] mt-2 font-medium",
          isCritical ? "text-red-400" : isWarning ? "text-[#D4AF37]" : "text-white/30"
        )}>
          {description}
        </p>

        {progress !== undefined && (
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden border border-white/5">
            <div
              className="bg-[#D4AF37] h-full rounded-full shadow-[0_0_10px_#D4AF37] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}