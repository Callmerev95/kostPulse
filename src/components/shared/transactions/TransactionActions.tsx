"use client"

import { Check, Loader2, ShieldCheck } from "lucide-react" // Tambah ShieldCheck
import { Button } from "@/components/ui/button"
import { confirmPayment } from "@/actions/transactions"
import { ViewProofModal } from "./ViewProofModal"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionActionsProps {
  id: string
  status: string
  hasProof: boolean
  proofUrl?: string | null
  tenantName: string
  isMobile?: boolean
}

// Interface untuk type safety balikan action
interface ActionResponse {
  success?: boolean;
  error?: string;
}

export function TransactionActions({ id, status, proofUrl, tenantName, isMobile }: TransactionActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false) // Kendali manual open state

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault() // Mencegah penutupan otomatis jika pakai button biasa
    if (isLoading) return

    setIsLoading(true)
    const promise = confirmPayment(id) as unknown as Promise<ActionResponse>

    toast.promise(promise, {
      loading: `Memverifikasi pembayaran ${tenantName}...`,
      success: (res) => {
        if (res?.error) throw new Error(res.error)
        setIsConfirmOpen(false) // Tutup modal hanya jika sukses
        return `Pembayaran ${tenantName} telah diverifikasi!`
      },
      error: (err) => err.message || "Gagal verifikasi pembayaran",
      finally: () => setIsLoading(false)
    })
  }

  if (status === "PAID") {
    return (
      <div className={cn("flex items-center gap-2", isMobile ? "w-full" : "justify-end")}>
        {proofUrl && <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} isMobile={isMobile} />}

        <div className={cn(
          "bg-green-500/5 text-green-500 border border-green-500/10 rounded-xl flex items-center gap-2 select-none cursor-default shadow-[0_0_15px_rgba(34,197,94,0.05)]",
          isMobile
            ? "flex-1 justify-center h-14 text-[10px] font-black uppercase tracking-[0.2em]"
            : "h-9 px-4 text-[9px] font-black uppercase tracking-widest"
        )}>
          <ShieldCheck size={isMobile ? 16 : 12} className="text-green-500" />
          Lunas
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", isMobile ? "w-full" : "justify-end")}>
      {proofUrl && <ViewProofModal proofUrl={proofUrl} tenantName={tenantName} isMobile={isMobile} />}

      <AlertDialog open={isConfirmOpen} onOpenChange={(val) => !isLoading && setIsConfirmOpen(val)}>
        <AlertDialogTrigger asChild>
          <Button
            size={isMobile ? "lg" : "sm"}
            className={cn(
              "text-green-500 border-green-500/20 bg-green-500/10 hover:bg-green-500/20 rounded-xl font-black transition-all active:scale-95",
              isMobile ? "flex-1 h-14 text-xs gap-2 tracking-widest uppercase" : "h-9 px-4 ml-auto"
            )}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Konfirmasi
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />

          <AlertDialogHeader className="relative z-10">
            <AlertDialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none">
              Verifikasi <span className="text-[#D4AF37]">Pembayaran?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 font-medium pt-2">
              Pastikan pembyaran <span className="text-white font-bold tracking-tight">{tenantName}</span> sudah masuk ke rekening. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-3 mt-6 relative z-10">
            <AlertDialogCancel
              disabled={isLoading}
              className="bg-white/5 border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-all h-12 text-xs font-bold uppercase tracking-widest"
            >
              Batal
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl h-12 border-none transition-all px-8 flex items-center gap-2 shadow-[0_10px_20px_rgba(22,163,74,0.2)]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck size={18} />}
              YA, VERIFIKASI
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}