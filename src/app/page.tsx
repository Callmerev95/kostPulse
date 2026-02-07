import Link from "next/link";
import {
  ArrowRight, Zap, Star, Smartphone,
  MessageCircle, CreditCard, LayoutDashboard, Users,
  Database, Server, Code2, Globe
} from "lucide-react";
import { KostFlowLogo } from "../components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">

      {/* 🌌 Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      </div>

      {/* 🧭 Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-transform hover:rotate-6">
            <KostFlowLogo className="text-black h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">Kost<span className="text-[#D4AF37]">Flow</span></span>
            <span className="text-[8px] font-bold tracking-[0.4em] text-white/20 uppercase">Premium System</span>
          </div>
        </div>
        <Link href="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 backdrop-blur-md">
          Masuk
        </Link>
      </nav>

      {/* 🚀 Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-20 mx-auto max-w-7xl text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
              <Star size={12} fill="#D4AF37" /> Modern Kost Management
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              Kelola Kost <br />
              <span className="text-[#D4AF37] italic">Tanpa Ribet.</span>
            </h1>

            <p className="max-w-lg text-white/40 text-lg md:text-xl font-medium leading-relaxed mx-auto lg:mx-0">
              Transformasi bisnis kost Anda dengan sistem manajemen otomatis. Pantau unit, penghuni, dan keuangan dalam satu genggaman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              {/* Primary Button */}
              <Link
                href="/register"
                className="group flex items-center justify-center gap-3 bg-[#D4AF37] hover:bg-[#F9E498] text-black px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] active:scale-95"
              >
                Coba Gratis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary Button - Scroll to Features */}
              <Link
                href="#features"
                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm active:scale-95"
              >
                Lihat Fitur
              </Link>
            </div>
          </div>

          {/* 📊 Quick Stats Preview */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-1000">
            <div className="bg-white/2 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <Users className="text-[#D4AF37] mb-4" size={32} />
              <div className="text-4xl font-black italic">98%</div>
              <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1 text-nowrap">Okupansi Kamar</div>
            </div>
            <div className="bg-[#D4AF37] p-8 rounded-[2.5rem] text-black">
              <CreditCard size={32} className="mb-4" />
              <div className="text-4xl font-black italic">Auto</div>
              <div className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-1 text-nowrap">Invoicing System</div>
            </div>
            <div className="col-span-2 bg-white/2 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between backdrop-blur-xl">
              <div>
                <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Pemasukan Bulan Ini</div>
                <div className="text-3xl font-black">Rp 24.500.000</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                <Zap size={24} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🛠️ Core Features Section */}
      <section id="features" className="px-6 py-24 mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black tracking-tighter italic uppercase">Fitur <span className="text-[#D4AF37]">Andalan</span></h2>
          <p className="text-white/40 max-w-md mx-auto font-medium italic">Dirancang khusus untuk pemilik kost yang menghargai efisiensi dan estetika.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group bg-white/2 border border-white/5 p-10 rounded-[3rem] hover:bg-[#D4AF37]/5 transition-all duration-500">
            <div className="h-14 w-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">WhatsApp Notify</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">
              Kirim invoice dan pengingat pembayaran langsung ke WhatsApp penghuni hanya dengan satu klik.
            </p>
          </div>

          <div className="group bg-white/2 border border-white/5 p-10 rounded-[3rem] hover:bg-[#D4AF37]/5 transition-all duration-500">
            <div className="h-14 w-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
              <LayoutDashboard size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Smart Dashboard</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">
              Pantau arus kas, status hunian, dan histori transaksi dalam tampilan yang mewah dan intuitif.
            </p>
          </div>

          <div className="group bg-white/2 border border-white/5 p-10 rounded-[3rem] hover:bg-[#D4AF37]/5 transition-all duration-500">
            <div className="h-14 w-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
              <Smartphone size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Mobile First UI</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">
              Akses sistem manajemen Anda dari mana saja dengan navigasi yang dioptimalkan untuk perangkat mobile.
            </p>
          </div>
        </div>
      </section>

      {/* 💻 Tech Stack Section */}
      <section className="px-6 py-24 bg-white/1 border-y border-white/5 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight italic">Built with <span className="text-[#D4AF37]">Modern Stack.</span></h2>
              <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Performa Cepat • Aman • Skalabel</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
              <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                <Globe size={20} className="text-[#D4AF37]" />
                <span className="font-bold tracking-tighter">Next.js 15</span>
              </div>
              <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                <Database size={20} className="text-[#D4AF37]" />
                <span className="font-bold tracking-tighter">Prisma ORM</span>
              </div>
              <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                <Server size={20} className="text-[#D4AF37]" />
                <span className="font-bold tracking-tighter">Supabase</span>
              </div>
              <div className="flex items-center gap-2 group hover:opacity-100 transition-opacity">
                <Code2 size={20} className="text-[#D4AF37]" />
                <span className="font-bold tracking-tighter">Tailwind v4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="px-6 py-16 border-t border-white/5 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <KostFlowLogo className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-lg font-black tracking-tighter uppercase italic">
                Kost<span className="text-[#D4AF37]">Flow</span>
              </span>
            </div>
            <p className="text-white/30 text-sm max-w-xs leading-relaxed font-medium italic">
              Solusi manajemen properti premium untuk efisiensi operasional dan kenyamanan penghuni.
            </p>
          </div>

          {/* Platform Column */}
          <div className="space-y-4">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Platform</h4>
            <ul className="space-y-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 KostFlow • Premium Management System

          </div>
          <div className="flex items-center gap-2 text-[#D4AF37]/50 text-[10px] font-black uppercase tracking-widest">
            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </footer>
    </div>
  );
}