"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { resetPassword } from "@/actions/auth" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, SendHorizontal } from "lucide-react"

const schema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
})

type ForgotInput = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotInput>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: ForgotInput) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("email", data.email)

    try {
      const result = await resetPassword(formData) as { success?: boolean; error?: string }

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Link pemulihan telah dikirim ke email Anda!")
      }
    } catch {
      toast.error("Terjadi masalah sistem.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/70 ml-1">Email Anda</Label>
        <Input
          {...register("email")}
          id="email"
          placeholder="nama@email.com"
          type="email"
          disabled={isLoading}
          className="h-12 bg-black/40 border-white/10 text-white focus-visible:ring-[#D4AF37] rounded-xl"
        />
        {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>}
      </div>

      <Button
        disabled={isLoading}
        className="w-full h-12 bg-[#D4AF37] hover:bg-[#F9E498] text-black font-black shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-[0.98] rounded-xl"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <SendHorizontal className="mr-2 h-4 w-4" />
            Kirim Link Pemulihan
          </>
        )}
      </Button>
    </form>
  )
}