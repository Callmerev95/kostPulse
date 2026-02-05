import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Quote } from "lucide-react"
import { KostFlowLogo } from "@/components/logo"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Register | KostFlow Premium",
  description: "Mulai perjalanan eksklusif Anda mengelola properti bersama KostFlow.",
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-[#0A0A0A]">

      {/* SISI KIRI: Branding & Visual (Desktop Only) */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r border-white/5 overflow-hidden">

        {/* Background Image Container - Tema: Hospitality/Detail */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2000&auto=format&fit=crop"
            alt="Premium Property Management"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-transparent" />
        </div>

        {/* Header Logo */}
        <div className="relative z-20 flex items-center text-xl font-bold tracking-tighter">
          <div className="bg-[#D4AF37] p-1.5 rounded-lg mr-2 shadow-lg shadow-[#D4AF37]/20">
            <KostFlowLogo className="h-6 w-6 text-black" />
          </div>
          <span className="bg-linear-to-r from-[#D4AF37] to-[#F9E498] bg-clip-text text-transparent">
            KostFlow
          </span>
        </div>

        {/* Konten Utama (Posisi dinaikkan sedikit sesuai saran lo sebelumnya) */}
        <div className="relative z-20 mt-24 space-y-10">
          <div className="space-y-5">
            <h2 className="text-6xl font-black tracking-tight leading-[1.05]">
              Start Your <br />
              <span className="bg-linear-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent">
                Legacy.
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-md leading-relaxed font-light">
              Bergabunglah dengan ekosistem manajemen properti paling eksklusif dan ubah operasional harian Anda menjadi aliran pendapatan yang pasif.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl max-w-lg">
            <Quote className="h-8 w-8 text-[#D4AF37] mb-4 opacity-80" />
            <p className="text-lg font-medium leading-relaxed mb-6 italic text-white/90">
              &ldquo;Proses pendaftaran yang instan dan dashboard yang sangat intuitif. KostFlow adalah investasi terbaik untuk efisiensi bisnis saya.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-linear-to-tr from-[#D4AF37] to-[#F9E498] p-0.5">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center font-bold text-[#D4AF37]">
                  AM
                </div>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-white">Anisa Maura</p>
                <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest">Premium Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: Form Register */}
      <div className="p-6 lg:p-8 flex flex-col justify-center relative bg-white overflow-y-auto">

        {/* Branding Pojok Kanan Atas */}
        <div className="absolute top-8 right-8 hidden lg:flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Standards</span>
          <div className="flex items-center gap-1.5">
            <KostFlowLogo className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm font-black text-black tracking-tighter">KostFlow</span>
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-95 py-10">
          <div className="flex flex-col space-y-3 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-2">
              <div className="bg-black p-3 rounded-2xl shadow-2xl">
                <KostFlowLogo className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-black">
                Daftar Akun
              </h1>
              <p className="text-sm text-slate-500">
                Mulailah langkah cerdas mengelola properti bersama <span className="font-bold text-[#D4AF37]">KostFlow</span>.
              </p>
            </div>
          </div>

          <RegisterForm />

          <p className="px-8 lg:px-0 text-center lg:text-left text-sm text-slate-400 leading-relaxed">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-black underline underline-offset-4 hover:text-[#C5A028] transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}