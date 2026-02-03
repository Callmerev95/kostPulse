import Link from "next/link"
import { LayoutDashboard, DoorOpen, Users, Receipt, Settings } from "lucide-react"
import { signOut } from "@/actions/auth"
import { LogOut } from "lucide-react"

// Menu navigasi dashboard
const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: DoorOpen, label: "Kamar", href: "/dashboard/rooms" },
  { icon: Users, label: "Penghuni", href: "/dashboard/tenants" },
  { icon: Receipt, label: "Tagihan", href: "/dashboard/transactions" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold px-2 mb-8 text-blue-600">Kost-Pulse</div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Area Bawah: Logout */}
      <div className="pt-4 mt-4 border-t">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  )
}