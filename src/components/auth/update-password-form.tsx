"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updatePassword } from "@/actions/auth" // Kita buat ini setelah ini
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"

const schema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type UpdateInput = z.infer<typeof schema>

export function UpdatePasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateInput>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: UpdateInput) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("password", data.password)

    try {
      const result = await updatePassword(formData) as { success?: boolean; error?: string }

      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success("Password berhasil diperbarui!")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-white/70 ml-1">Password Baru</Label>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPass ? "text" : "password"}
            disabled={isLoading}
            className="h-12 bg-black/40 border-white/10 text-white focus-visible:ring-[#D4AF37] rounded-xl pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#D4AF37]"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-white/70 ml-1">Konfirmasi Password</Label>
        <Input
          {...register("confirmPassword")}
          type="password"
          disabled={isLoading}
          className="h-12 bg-black/40 border-white/10 text-white focus-visible:ring-[#D4AF37] rounded-xl"
        />
        {errors.confirmPassword && <p className="text-xs text-red-400 font-medium">{errors.confirmPassword.message}</p>}
      </div>

      <Button
        disabled={isLoading}
        className="w-full h-12 bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-[0.98] rounded-xl"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Perbarui Password
          </>
        )}
      </Button>
    </form>
  )
}