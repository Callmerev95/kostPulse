"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Receipt,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "HOME", href: "/dashboard" },
  { icon: DoorOpen, label: "KAMAR", href: "/dashboard/rooms" },
  { icon: Users, label: "PENGHUNI", href: "/dashboard/tenants" },
  { icon: Receipt, label: "TAGIHAN", href: "/dashboard/transactions" },
  { icon: Settings, label: "SETTING", href: "/dashboard/settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    // Tambahkan pb-[env(safe-area-inset-bottom)] untuk handle gesture bar di iPhone/Android modern
    <nav className="lg:hidden fixed bottom-6 left-0 right-0 z-50 px-5 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md bg-black/85 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[2.2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex items-center justify-between ring-1 ring-white/10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center py-3 rounded-[1.8rem] transition-all duration-300",
                isActive ? "text-[#D4AF37]" : "text-white/40"
              )}
            >
              {/* Soft Radial Glow saat Aktif */}
              {isActive && (
                <div className="absolute inset-0 bg-[#D4AF37]/10 blur-xl rounded-full" />
              )}

              <item.icon size={20} className={cn(
                "transition-all duration-500 z-10",
                isActive ? "scale-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]" : "scale-100"
              )} />

              <span className={cn(
                "text-[8px] mt-1.5 tracking-[0.2em] z-10 transition-all duration-300",
                isActive ? "font-black text-[#D4AF37] opacity-100" : "font-bold text-white/30 opacity-80"
              )}>
                {item.label}
              </span>

              {/* Indikator Garis Bawah yang lebih smooth */}
              {isActive && (
                <div className="absolute -bottom-0.5 w-6 h-0.5 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] rounded-full animate-in fade-in zoom-in duration-500" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}