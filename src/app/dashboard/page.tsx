import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/dashboard";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { HeaderSection } from "@/components/dashboard/header-section";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Ambil data profile untuk Header
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true }
  });

  const { stats, income, overdueCount } = await getDashboardStats(user.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <HeaderSection userName={profile?.name || "Premium User"} />

      <StatsGrid
        stats={stats}
        income={income}
        overdueCount={overdueCount}
      />

      {/* Grid untuk Chart & Activity (Next Step) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 aspect-video bg-white/2 border border-white/5 rounded-[2rem] flex items-center justify-center">
          <p className="text-white/20 font-bold tracking-widest uppercase text-xs">Revenue Analytics Chart</p>
        </div>
        <div className="bg-white/2 border border-white/5 rounded-[2rem] flex items-center justify-center">
          <p className="text-white/20 font-bold tracking-widest uppercase text-xs">Recent Activity</p>
        </div>
      </div>
    </div>
  );
}