"use client"

import { Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

/**
 * Modal untuk menampilkan foto bukti pembayaran.
 */
export function ViewProofModal({ proofUrl, tenantName }: { proofUrl: string, tenantName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <ImageIcon className="mr-1 h-3 w-3" /> Lihat Bukti
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Bukti Bayar: {tenantName}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg border">
          <Image
            src={proofUrl}
            alt="Bukti Pembayaran"
            fill
            className="object-contain"
            unoptimized // Karena URL dari Supabase Storage seringkali butuh config domain
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}