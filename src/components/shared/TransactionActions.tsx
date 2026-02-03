"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/actions/transactions"
import { UploadProofModal } from "./UploadProofModal"
import { ViewProofModal } from "./ViewProofModal"
import { useState } from "react"

/**
 * Tombol aksi untuk mengonfirmasi pembayaran pada daftar transaksi.
 */
export function TransactionActions({ id, status, hasProof, proofUrl, tenantName }: { id: string, status: string, hasProof: boolean, proofUrl?: string | null, tenantName: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (confirm(`Konfirmasi pembayaran untuk ${tenantName}?`)) {
      setIsLoading(true)
      await confirmPayment(id)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Tampilkan tombol Lihat Bukti jika URL tersedia */}
      {proofUrl && (
        <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} />
      )}

      {/* Jika belum ada bukti & belum lunas, tampilkan modal upload */}
      {status !== "PAID" && !hasProof && (
        <UploadProofModal transactionId={id} />
      )}

      {/* Tombol Konfirmasi (Tampil jika belum lunas) */}
      {status !== "PAID" ? (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-green-600 border-green-200 hover:bg-green-50"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          <Check className="mr-1 h-3 w-3" />
          {isLoading ? "..." : "Konfirmasi"}
        </Button>
      ) : (
        <span className="text-xs text-slate-400 italic px-2">Lunas</span>
      )}
    </div>
  )
}