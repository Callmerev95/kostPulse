import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UploadProofModal } from "@/components/shared/UploadProofModal"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { PaymentInstructions } from "@/components/shared/PaymentInstructions"
import Image from "next/image"

/**
 * Halaman Publik untuk Penyewa
 * Tidak memerlukan autentikasi
 */

export default async function PublicPaymentPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;

  const transaction = await prisma.transaction.findUnique({
    where: { token },
    include: {
      tenant: {
        include: {
          room: true,
          user: true
        }
      }
    }
  })

  if (!transaction || !transaction.tenant) return notFound();

  const { tenant } = transaction;
  const owner = tenant.user;

  // Format detail tanggal contoh: 5 Februari 2026
  const detailDate = format(new Date(transaction.year, transaction.month - 1, 5), "d MMMM yyyy", { locale: id });

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center border-b bg-white rounded-t-xl py-8">
          <Badge className="mb-2" variant="outline">{owner.kostName}</Badge>
          <CardTitle className="text-2xl font-black tracking-tight uppercase">Tagihan Pembayaran</CardTitle>
          {/* 1. Informasi Atas Nama & Kamar */}
          <p className="text-sm font-medium text-slate-500 mt-2">
            <span className="text-blue-600 font-bold uppercase">{tenant.name}</span>
            <span className="mx-2">|</span>
            Kamar: <span className="font-bold text-slate-800">{tenant.room.roomNumber}</span>
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* 2. Detail Transaksi & Periode Detail */}
          <div className="flex justify-between items-start pb-4 border-b border-dashed">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Periode Tagihan</p>
              <p className="font-semibold text-slate-700">{detailDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Bayar</p>
              <p className="text-2xl font-black text-blue-600">{formatIDR(transaction.amount)}</p>
            </div>
          </div>

          {/* 3. Instruksi Pembayaran Interaktif (Tabs) */}
          {!transaction.paymentProof && (
            <PaymentInstructions user={owner} />
          )}

          {/* 4. Upload Section */}
          <div className="pt-2">
            {transaction.paymentProof ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 justify-center bg-green-50 py-3 rounded-xl border border-green-100">
                  <span className="text-sm font-bold uppercase tracking-widest italic">Pembayaran Sedang Diverifikasi</span>
                </div>
                <div className="relative aspect-3/4 w-full rounded-xl border overflow-hidden shadow-inner bg-slate-100">
                  <Image
                    src={transaction.paymentProof}
                    alt="Bukti Transfer"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 mb-4 bg-slate-100 py-2 rounded-lg">
                    Mohon pastikan nominal transfer sesuai sebelum mengunggah bukti.
                  </p>
                  <UploadProofModal transactionId={transaction.id} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}