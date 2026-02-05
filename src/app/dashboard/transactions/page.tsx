import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase-server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { TransactionActions } from "@/components/shared/TransactionActions"
import { formatPhoneNumber, generatePaymentMessage } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Halaman Laporan Keuangan.
 * Menampilkan histori transaksi dan menyediakan aksi konfirmasi pembayaran.
 */
export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return redirect("/login")

  const owner = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { kostName: true }
  })

  const transactions = await prisma.transaction.findMany({
    where: {
      tenant: { userId: authUser.id }
    },
    include: {
      tenant: {
        include: { room: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-slate-500 text-sm">Pantau tagihan dan konfirmasi pembayaran penghuni.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Bulan/Tahun</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => {
              // Generate Link WhatsApp
              const waLink = `https://wa.me/${formatPhoneNumber(t.tenant.phoneNumber)}?text=${generatePaymentMessage(
                t.tenant.name,
                owner?.kostName || "Kost",
                t.amount,
                t.month,
                t.year,
                t.token || ""
              )}`;

              return (
                <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-700">
                    {t.month.toString().padStart(2, '0')}/{t.year}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{t.tenant.name}</span>
                      <span className="text-xs text-slate-500">{t.tenant.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      Kamar {t.tenant.room.roomNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rp {t.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.status === "PAID" ? "default" : "secondary"}
                      className={
                        t.status === "PAID"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                          : t.status === "OVERDUE"
                            ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* Tombol WhatsApp (Hanya muncul jika belum PAID) */}
                      {t.status !== "PAID" && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <a href={waLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                            Tagih
                          </a>
                        </Button>
                      )}

                      <TransactionActions
                        id={t.id}
                        status={t.status}
                        hasProof={!!t.paymentProof}
                        proofUrl={t.paymentProof}
                        tenantName={t.tenant.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  Belum ada data transaksi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}