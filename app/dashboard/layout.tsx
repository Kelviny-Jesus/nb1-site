"use client"

import type React from "react"
import { SidebarNav } from "@/components/dashboard/SidebarNav"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0D1117]">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-[#0D1117] w-full">{children}</main>
      </div>
    </div>
  )
}

