import { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { KostFlowLogo } from "@/components/logo"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Reset Password | KostFlow",
  description: "Pulihkan akses ke akun KostFlow Premium Anda.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-linear-to-br from-black to-slate-900 p-4 rounded-2xl shadow-2xl border border-white/5">
            <KostFlowLogo className="h-10 w-10 text-[#D4AF37]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white">Pulihkan Akses</h1>
            <p className="text-sm text-white/50 max-w-70 mx-auto">
              Masukkan email Anda dan kami akan mengirimkan link pemulihan password.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <ForgotPasswordForm />
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-bold text-[#D4AF37] hover:text-[#F9E498] transition-colors gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}