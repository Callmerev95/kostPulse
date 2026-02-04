"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkOutTenant } from "@/actions/tenants"
import { useState } from "react"
import { toast } from "sonner";

interface TenantActionsProps {
  tenantId: string
  roomId: string
  tenantName: string
}

/**
 * Komponen aksi untuk penghuni.
 * Menangani proses Check-out dengan konfirmasi.
 */
export function TenantActions({ tenantId, roomId, tenantName }: TenantActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOut = async () => {
    const isConfirmed = confirm(
      `Apakah Anda yakin ingin melakukan Check-out untuk ${tenantName}? \nSeluruh data transaksi terkait juga akan dihapus.`
    )

    if (!isConfirmed) return

    setIsLoading(true)
    const result = await checkOutTenant(tenantId, roomId)
    setIsLoading(false)

    if (result.success) {
      // Notifikasi sukses 
      toast.success("Check-out Berhasil", {
        description: `${tenantName} telah keluar dan kamar kini tersedia kembali.`,
      })
    } else {
      // Notifikasi error jika terjadi kendala (termasuk foreign key violation)
      toast.error("Gagal Check-out", {
        description: result.error || "Terjadi kesalahan saat memproses data.",
      })
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleCheckOut}
      disabled={isLoading}
      className="flex items-center gap-2 transition-all active:scale-95"
    >
      <LogOut size={14} />
      {isLoading ? "Memproses..." : "Check-out"}
    </Button>
  )
}