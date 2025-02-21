"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, CreditCard, HelpCircle } from "lucide-react"

const sidebarItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    title: "Financial",
    href: "/dashboard/financial",
    icon: CreditCard,
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-[#0D1117] border-r border-[#1a1f36]">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                isActive ? "bg-[#1E2A4A] text-white" : "text-gray-400 hover:bg-[#1E2A4A] hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

