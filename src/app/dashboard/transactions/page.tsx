import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase-server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  // Ambil data transaksi milik owner ini
  const transactions = await prisma.transaction.findMany({
    where: {
      tenant: { room: { userId: user.id } }
    },
    include: {
      tenant: { include: { room: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
      <div className="bg-white border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bulan/Tahun</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.month}/{t.year}</TableCell>
                <TableCell className="font-medium">{t.tenant.name}</TableCell>
                <TableCell>{t.tenant.room.roomNumber}</TableCell>
                <TableCell>Rp {t.amount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <Badge variant={t.status === "PAID" ? "outline" : "secondary"}>
                    {t.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}