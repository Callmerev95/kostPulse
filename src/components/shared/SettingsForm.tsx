"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateSettings } from "@/actions/user"

interface SettingsFormProps {
  userId: string
  initialData: {
    name: string
    kostName: string
    bankName: string | null
    accountNumber: string | null
    accountName: string | null
    ewalletName: string | null
    ewalletNumber: string | null
    qrisImage: string | null
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)


  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateSettings(formData)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Pengaturan berhasil disimpan!")
    }
  }

  return (

    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <h3 className="font-bold text-lg">Bank</h3>
        <Label htmlFor="bankName">Nama Bank </Label>
        <Input id="bankName" name="bankName" placeholder="Contoh: BCA, BNI, BRI, Mandiri" defaultValue={initialData.bankName || ""} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountNumber">Nomor Rekening / HP</Label>
        <Input id="accountNumber" name="accountNumber" placeholder="Contoh: 08xxxxx" defaultValue={initialData.accountNumber || ""} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountName">Atas Nama (A/N)</Label>
        <Input id="accountName" name="accountName" placeholder="Contoh: Franky Thy" defaultValue={initialData.accountName || ""} required />
      </div>


      {/* Bagian E-Wallet */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-bold text-lg">E-Wallet (OVO/DANA/GOPAY)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ewalletName">Nama E-Wallet</Label>
            <Input id="ewalletName" name="ewalletName" defaultValue={initialData.ewalletName || ""} placeholder="Contoh: DANA" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ewalletNumber">Nomor E-Wallet</Label>
            <Input id="ewalletNumber" name="ewalletNumber" defaultValue={initialData.ewalletNumber || ""} placeholder="0812..." required />
          </div>
        </div>
      </div>

      {/* Bagian QRIS */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-bold text-lg">QRIS (Link Gambar)</h3>
        <div className="space-y-2">
          <Label htmlFor="qrisImage">URL Gambar QRIS</Label>
          <Input id="qrisImage" name="qrisImage" defaultValue={initialData.qrisImage || ""} placeholder="https://image-link.com/qris.jpg" />
          <p className="text-[10px] text-slate-500 italic">*Masukkan link gambar barcode QRIS Anda</p>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}