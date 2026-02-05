"use client"

import * as React from "react"
import { useState } from "react"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react"

type SignInResponse = {
  error?: string;
  success?: boolean;
} | void;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State untuk intip password

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await signIn(formData) as SignInResponse;
      if (result && result.error) {
        toast.error(result.error)
      } else {
        toast.success("Akses diberikan. Selamat datang kembali!")
      }
    } catch {
      toast.error("Terjadi masalah pada koneksi server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-slate-700 font-medium" htmlFor="email">
              Alamat Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="nama@email.com"
              type="email"
              disabled={isLoading}
              required
              className="h-11 focus-visible:ring-[#D4AF37] border-slate-200"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-slate-700 font-medium" htmlFor="password">
                Password
              </Label>
              <a href="#" className="text-xs font-bold text-[#D4AF37] hover:text-[#C5A028]">
                Lupa password?
              </a>
            </div>
            {/* Wrapper untuk input password dan button eye */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                required
                className="h-11 pr-10 focus-visible:ring-[#D4AF37] border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] transition-colors"
                tabIndex={-1} // Agar tidak mengganggu alur tombol Tab
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            disabled={isLoading}
            className="h-12 bg-black hover:bg-slate-900 text-[#D4AF37] font-bold shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4 text-[#D4AF37]" />
            )}
            Masuk ke Portal Eksklusif
          </Button>
        </div>
      </form>
    </div>
  )
}