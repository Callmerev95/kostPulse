import { getTenants } from "@/actions/tenants"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TenantActions } from "@/components/shared/tenants/TenantActions"
import { Users, UserCheck } from "lucide-react"

export default async function TenantsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const tenants = await getTenants(user.id)

  return (
    /** * Halaman dikunci tingginya (h-full) & min-h-0 
     * agar flex child bisa mengaktifkan overflow-y-auto
     */
    <div className="flex flex-col h-full min-h-0 space-y-6 animate-in fade-in duration-700 overflow-hidden">

      {/* Header Section - shrink-0 agar tidak tertekan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Daftar <span className="text-[#D4AF37]">Penghuni</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1 italic">
            Total {tenants.length} penghuni aktif terdata.
          </p>
        </div>
      </div>

      {/* 🖥️ Desktop View: Fixed Header & Scrollable Table */}
      <div className="hidden md:flex flex-col bg-white/2 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl flex-1 min-h-0">

        {/* 1. Static Header Desktop */}
        <div className="bg-white/5 border-b border-white/5 shrink-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white/40 font-bold py-5 pl-8 uppercase tracking-widest text-[10px] w-[25%]">Penghuni</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[15%]">Unit</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[20%]">WhatsApp</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[20%]">Mulai Sewa</TableHead>
                <TableHead className="text-right text-white/40 font-bold pr-8 uppercase tracking-widest text-[10px] w-[20%]">Kontrol</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* 2. Scrollable Body Desktop */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <Table>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} className="border-white/5 hover:bg-white/1 transition-all group h-20">
                  <TableCell className="py-5 pl-8 w-[25%]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-300">
                        <UserCheck size={18} />
                      </div>
                      <span className="font-black text-white text-base tracking-tight">{tenant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[#D4AF37]/90 italic w-[15%]">Unit {tenant.room.roomNumber}</TableCell>
                  <TableCell className="text-white/60 font-medium w-[20%]">{tenant.phoneNumber}</TableCell>
                  <TableCell className="text-white/60 font-medium w-[20%]">
                    {new Date(tenant.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right pr-8 w-[20%]">
                    <div className="flex justify-end">
                      <TenantActions
                        tenantId={tenant.id}
                        roomId={tenant.roomId}
                        tenantName={tenant.name}
                        phoneNumber={tenant.phoneNumber}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 📱 Mobile View: Scrollable Cards Container */}
      <div className="md:hidden flex-1 min-h-0 overflow-y-auto pb-32 space-y-4 custom-scrollbar">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="bg-white/2 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm relative overflow-hidden active:scale-[0.98] transition-all">
            {/* Subtle Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-none mb-1">{tenant.name}</h3>
                  <p className="text-[#D4AF37] text-xs font-bold italic uppercase tracking-tighter">Unit {tenant.room.roomNumber}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-white/20 uppercase tracking-widest text-[9px] font-bold pl-1">WhatsApp</p>
                <p className="text-white/80 font-bold text-sm">{tenant.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/20 uppercase tracking-widest text-[9px] font-bold pl-1">Mulai Sewa</p>
                <p className="text-white/80 font-bold text-sm">
                  {new Date(tenant.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <TenantActions
                tenantId={tenant.id}
                roomId={tenant.roomId}
                tenantName={tenant.name}
                phoneNumber={tenant.phoneNumber}
                isMobile
              />
            </div>
          </div>
        ))}

        {/* Empty State di dalam scroll area mobile */}
        {tenants.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-white/20">
            <Users size={32} className="opacity-20 mb-4" />
            <p className="font-bold tracking-[0.3em] uppercase text-[10px]">Belum ada penghuni aktif</p>
          </div>
        )}
      </div>
    </div>
  )
}