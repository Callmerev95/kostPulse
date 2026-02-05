import { Metadata } from "next"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { KostFlowLogo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Update Password | KostFlow",
  description: "Buat kata sandi baru untuk akun KostFlow Anda.",
}

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 relative overflow-hidden">
      {/* Subtle Gold Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-[#D4AF37] opacity-[0.02] blur-[150px] rounded-full" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-black p-4 rounded-2xl border border-white/5 shadow-2xl">
            <KostFlowLogo className="h-10 w-10 text-[#D4AF37]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white">Kata Sandi Baru</h1>
            <p className="text-sm text-white/50">
              Demi keamanan, buatlah kata sandi yang kuat dan unik.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  )
}