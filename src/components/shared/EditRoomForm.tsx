"use client"

import { updateRoom } from "@/actions/rooms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Room } from "@prisma/client"

interface EditRoomFormProps {
  room: Room
  open: boolean
  setOpen: (open: boolean) => void
}

/**
 * Komponen Modal Form untuk memperbarui data kamar yang sudah ada.
 * Menggunakan data dari props 'room' untuk mengisi nilai awal input.
 */
export function EditRoomForm({ room, open, setOpen }: EditRoomFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await updateRoom(room.id, formData)
      setOpen(false)
    } catch (error) {
      console.error("Gagal update kamar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Kamar {room.roomNumber}</DialogTitle>
          <DialogDescription>
            Ubah detail kamar di sini. Klik simpan untuk memperbarui.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Nomor Kamar</Label>
            <Input
              id="roomNumber"
              name="roomNumber"
              defaultValue={room.roomNumber}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga Sewa (Per Bulan)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={room.price}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}