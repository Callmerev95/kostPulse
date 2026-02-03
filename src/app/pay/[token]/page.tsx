import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UploadProofModal } from "@/components/shared/UploadProofModal"
import Image from "next/image"

/**
 * Halaman Publik untuk Penyewa
 * Tidak memerlukan autentikasi
 */
export default async function PublicPaymentPage({ params }: { params: { token: string } }) {
  const transaction = await prisma.transaction.findUnique({
    where: { token: params.token },
    include: {
      tenant: {
        include: { room: true }
      }
    }
  })

  if (!transaction) return notFound()

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center border-b bg-white rounded-t-xl">
          <CardTitle className="text-xl font-bold">Detail Tagihan</CardTitle>
          <p className="text-sm text-slate-500">{transaction.tenant.room.roomNumber}</p>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status</span>
            <Badge variant={transaction.status === "PAID" ? "outline" : "destructive"}>
              {transaction.status}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-slate-500">Nama Penghuni</p>
            <p className="font-semibold">{transaction.tenant.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-slate-500">Periode</p>
            <p className="font-semibold">Bulan {transaction.month}, {transaction.year}</p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Tagihan</span>
              <span className="text-xl font-black text-blue-600">
                {formatIDR(transaction.amount)}
              </span>
            </div>
          </div>

          {/* Logika Tampilan Bukti / Tombol Upload */}
          <div className="pt-6">
            {transaction.paymentProof ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-center text-green-600">Bukti bayar sudah diunggah</p>
                <div className="relative aspect-video rounded-lg border overflow-hidden">
                  <Image
                    src={transaction.paymentProof}
                    alt="Bukti Bayar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Silakan lakukan transfer ke rekening Owner dan unggah bukti pembayarannya di bawah ini.
                </div>
                {/* Kita gunakan modal upload yang sudah ada */}
                <UploadProofModal transactionId={transaction.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}