import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UploadProofModal } from "@/components/shared/UploadProofModal"
import { CopyButton } from "@/components/shared/CopyButton"
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
        include:
        {
          room: true,
          user: true
        }
      }
    }
  })

  if (!transaction || !transaction.tenant) return notFound();

  const owner = transaction.tenant.user;

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
          <CardTitle className="text-2xl font-black tracking-tight">Tagihan Pembayaran</CardTitle>
          <p className="text-sm text-slate-500">Kamar {transaction.tenant.room.roomNumber}</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Detail Transaksi */}
          <div className="flex justify-between items-end pb-4 border-b border-dashed">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Periode</p>
              <p className="font-semibold text-slate-700">{transaction.month}, {transaction.year}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total</p>
              <p className="text-2xl font-black text-blue-600">{formatIDR(transaction.amount)}</p>
            </div>
          </div>

          {/* INSTRUKSI PEMBAYARAN (DINAMIS) */}
          {!transaction.paymentProof && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
              <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                🏦 Instruksi Pembayaran
              </p>

              {owner.bankName ? (
                <div className="space-y-3 bg-white p-4 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Bank / E-Wallet</p>
                    <p className="font-bold text-slate-800">{owner.bankName}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Nomor Rekening</p>
                      <p className="font-mono text-lg font-bold text-blue-700">{owner.accountNumber}</p>
                    </div>
                    {/* Komponen Copy Button */}
                    <CopyButton text={owner.accountNumber || ""} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Atas Nama</p>
                    <p className="font-medium text-slate-700">{owner.accountName}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-blue-700 italic">Silakan hubungi owner untuk detail rekening.</p>
              )}
            </div>
          )}

          {/* Upload Section */}
          <div className="pt-2">
            {transaction.paymentProof ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 justify-center bg-green-50 py-2 rounded-full border border-green-100">
                  <span className="text-sm font-bold uppercase tracking-wide">Sudah Dibayar</span>
                </div>
                <div className="relative aspect-video rounded-xl border overflow-hidden shadow-inner bg-slate-100">
                  <Image src={transaction.paymentProof} alt="Bukti" fill className="object-cover" unoptimized />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-4">Pastikan nominal sesuai sebelum upload bukti transfer</p>
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