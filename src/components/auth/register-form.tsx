"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Tambahkan ini
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/lib/zod"
import * as z from "zod"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react"

type SignUpInput = z.infer<typeof signUpSchema>

export function RegisterForm() {
  const router = useRouter() // Inisialisasi router
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(data: SignUpInput) {
    setIsLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    try {
      const result = (await signUp(formData)) as { success?: boolean; error?: string; message?: string };

      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else if (result?.success) {
        toast.success(result.message || "Registrasi berhasil! Selamat bergabung di KostFlow.")

        // Jeda 3 detik agar user sempat membaca instruksi cek email
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch {
      toast.error("Terjadi kesalahan sistem. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                {...register("name")}
                placeholder="Budi Santoso"
                disabled={isLoading}
                className={`h-11 focus-visible:ring-[#D4AF37] ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappNumber">No. WhatsApp</Label>
              <Input
                {...register("whatsappNumber")}
                placeholder="0812..."
                disabled={isLoading}
                className={`h-11 focus-visible:ring-[#D4AF37] ${errors.whatsappNumber ? "border-red-500" : ""}`}
              />
              {errors.whatsappNumber && <p className="text-xs text-red-500 font-medium">{errors.whatsappNumber.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="kostName">Nama Properti/Kost</Label>
            <Input
              {...register("kostName")}
              placeholder="Kost Elite Menteng"
              disabled={isLoading}
              className={`h-11 focus-visible:ring-[#D4AF37] ${errors.kostName ? "border-red-500" : ""}`}
            />
            {errors.kostName && <p className="text-xs text-red-500 font-medium">{errors.kostName.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="nama@email.com"
              disabled={isLoading}
              className={`h-11 focus-visible:ring-[#D4AF37] ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                className={`h-11 pr-10 focus-visible:ring-[#D4AF37] ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <Button
            disabled={isLoading}
            className="h-12 mt-2 bg-black hover:bg-slate-900 text-[#D4AF37] font-bold shadow-xl transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Bergabung Sekarang
          </Button>
        </div>
      </form>
    </div>
  )
}