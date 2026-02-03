import { getRooms } from "@/actions/rooms"
import { AddRoomForm } from "@/components/shared/AddRoomForm"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"


/**
 * Halaman utama manajemen kamar.
 * Menampilkan list kamar yang tersedia dalam bentuk tabel.
 */
export default async function RoomsPage() {
  const supabase = await createClient()

  // Ambil data userId dari user yang login
  const { data: { user } } = await supabase.auth.getUser()

  // Pastikan user sudah login
  if (!user) {
    return redirect("/login")
  }

  const rooms = await getRooms(user.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Daftar Kamar</h1>
          <p className="text-slate-500">Total ada {rooms.length} unit kamar.</p>
        </div>
        <AddRoomForm userId={user.id} />
      </div>

      <div className="bg-white border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Kamar</TableHead>
              <TableHead>Harga Sewa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.roomNumber}</TableCell>
                <TableCell>Rp {room.price.toLocaleString("id-ID")}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
            {rooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                  Belum ada data kamar. Silakan tambah kamar baru.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}