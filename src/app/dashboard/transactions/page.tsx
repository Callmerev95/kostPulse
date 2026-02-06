import { prisma } from "@/lib/prisma"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { TransactionActions } from "@/components/shared/transactions/TransactionActions"
import { formatPhoneNumber, generatePaymentMessage } from "@/lib/whatsapp";
import { MessageCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RealtimeRefresher } from "@/components/shared/RealTimeRefresher"

export default async function TransactionsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return redirect("/login")

  const owner = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { kostName: true }
  })

  const transactions = await prisma.transaction.findMany({
    where: { tenant: { userId: authUser.id } },
    include: { tenant: { include: { room: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 animate-in fade-in duration-700 overflow-hidden">
      {/* Header Section - shrink-0 agar statis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Laporan <span className="text-[#D4AF37]">Keuangan</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1 italic">
            Pantau tagihan dan konfirmasi pembayaran masuk.
          </p>
        </div>
      </div>

      <RealtimeRefresher />

      {/* 🖥️ Desktop View: Fixed Header & Scrollable Table */}
      <div className="hidden md:flex flex-col bg-white/2 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl flex-1 min-h-0">
        {/* 1. Header Table (Statis) */}
        <div className="bg-white/5 border-b border-white/5 shrink-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white/40 font-bold py-5 pl-8 uppercase tracking-widest text-[10px] w-[15%]">Periode</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[20%]">Penghuni</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[15%]">Kamar</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[15%]">Jumlah</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[15%]">Status</TableHead>
                <TableHead className="text-right text-white/40 font-bold pr-8 uppercase tracking-widest text-[10px] w-[20%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* 2. Scrollable Body Desktop */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <Table>
            <TableBody>
              {transactions.map((t) => {
                const waLink = `https://wa.me/${formatPhoneNumber(t.tenant.phoneNumber)}?text=${generatePaymentMessage(
                  t.tenant.name, owner?.kostName || "Kost", t.amount, t.month, t.year, t.token || ""
                )}`;

                return (
                  <TableRow key={t.id} className="border-white/5 hover:bg-white/1 transition-all group h-20">
                    <TableCell className="py-5 pl-8 font-black text-white/80 w-[15%]">
                      {t.month.toString().padStart(2, '0')}/{t.year}
                    </TableCell>
                    <TableCell className="w-[20%]">
                      <div className="flex flex-col">
                        <span className="font-bold text-white tracking-tight">{t.tenant.name}</span>
                        <span className="text-[10px] text-white/30 font-medium">{t.tenant.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[15%]">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 font-bold italic">
                        Unit {t.tenant.room.roomNumber}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-[#D4AF37] w-[15%]">
                      Rp {t.amount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="w-[15%]">
                      <Badge className={cn(
                        "font-bold uppercase tracking-tighter text-[10px]",
                        t.status === "PAID" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          t.status === "OVERDUE" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 w-[20%]">
                      <div className="flex justify-end items-center gap-2">
                        {t.status !== "PAID" && (
                          <Button variant="outline" size="sm" asChild className="h-9 border-green-500/20 bg-green-500/10 hover:bg-green-500/20 rounded-xl text-green-500 font-bold transition-all">
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Whatsapp
                            </a>
                          </Button>
                        )}
                        <TransactionActions id={t.id} status={t.status} hasProof={!!t.paymentProof} proofUrl={t.paymentProof} tenantName={t.tenant.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 📱 Mobile View: Finance Cards Scrollable Area */}
      <div className="md:hidden flex-1 min-h-0 overflow-y-auto pb-32 space-y-4 custom-scrollbar">
        {transactions.map((t) => {
          const waLink = `https://wa.me/${formatPhoneNumber(t.tenant.phoneNumber)}?text=${generatePaymentMessage(
            t.tenant.name, owner?.kostName || "Kost", t.amount, t.month, t.year, t.token || ""
          )}`;

          return (
            <div key={t.id} className="bg-white/2 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm relative overflow-hidden active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#D4AF37] font-black text-xs italic mb-1">Periode {t.month.toString().padStart(2, '0')}/{t.year}</p>
                  <h3 className="text-white font-black text-lg tracking-tight">{t.tenant.name}</h3>
                  <p className="text-white/40 text-[10px] font-medium">Unit {t.tenant.room.roomNumber}</p>
                </div>
                <Badge className={cn(
                  "font-bold uppercase tracking-tighter text-[9px]",
                  t.status === "PAID" ? "bg-green-500/10 text-green-500" :
                    t.status === "OVERDUE" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                )}>
                  {t.status}
                </Badge>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <p className="text-white/20 uppercase tracking-widest text-[9px] font-bold mb-1 pl-1">Total Tagihan</p>
                <p className="text-white font-black text-xl">Rp {t.amount.toLocaleString("id-ID")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {t.status !== "PAID" && (
                  <Button variant="outline" asChild className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-500 rounded-xl font-bold py-6">
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                )}
                <div className={cn(t.status === "PAID" ? "col-span-2" : "col-span-1")}>
                  <TransactionActions id={t.id} status={t.status} hasProof={!!t.paymentProof} proofUrl={t.paymentProof} tenantName={t.tenant.name} isMobile />
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-white/20">
            <Wallet size={32} className="opacity-20 mb-4" />
            <p className="font-bold tracking-[0.3em] uppercase text-[10px]">Belum ada transaksi</p>
          </div>
        )}
      </div>
    </div>
  )
}