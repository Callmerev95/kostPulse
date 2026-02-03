import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Kost-Pulse</CardTitle>
          <CardDescription>
            Kelola bisnis kos-kosanmu dengan lebih profesional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Budi Santoso" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kostName">Nama Kos-kosan</Label>
              <Input id="kostName" name="kostName" placeholder="Kost Amanah" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
              <Input id="whatsappNumber" name="whatsappNumber" placeholder="08123456789" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="budi@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Daftar Sekarang
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}