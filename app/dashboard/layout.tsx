"use client"

import type React from "react"
import { SidebarNav } from "@/components/dashboard/SidebarNav"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"

// Componente interno que usa o contexto
function DashboardContent({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const { isExpanded } = useSidebar()

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SidebarNav />
      <div className={`
        flex flex-col min-w-0 min-h-screen
        transition-all duration-300 ease-in-out
        ${isMobile ? 'ml-0' : (isExpanded ? 'ml-64' : 'ml-20')}
      `}>
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-[#0D1117] w-full p-4 md:p-6">
          {/* Adicionar padding no topo para dispositivos móveis para evitar que o conteúdo fique atrás do botão do menu */}
          {isMobile && <div className="h-16" />}
          {children}
        </main>
      </div>
    </div>
  )
}

// Componente principal que fornece o contexto
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
