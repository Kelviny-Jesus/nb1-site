"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, CreditCard, HelpCircle, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { FormattedMessage } from "react-intl"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/contexts/sidebar-context"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    titleId: "profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    titleId: "financial",
    href: "/dashboard/financial",
    icon: CreditCard,
  },
  {
    titleId: "help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } = useSidebar()

  // Fechar o menu móvel quando mudar de rota
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }, [pathname, isMobile, setIsMobileOpen])

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Botão de menu para dispositivos móveis */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 bg-[#1E2A4A] border-[#1a1f36] rounded-full p-2 h-10 w-10"
        >
          {isMobileOpen 
            ? <X className="h-5 w-5 text-white" /> 
            : <Menu className="h-5 w-5 text-white" />
          }
        </Button>
      )}

      {/* Menu lateral */}
      <div 
        className={`
          fixed top-0 left-0 h-screen z-40
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') 
            : (isExpanded ? 'w-64' : 'w-20')
          }
          bg-[#0D1117] border-r border-[#1a1f36]
        `}
        style={{ width: isMobile ? '240px' : isExpanded ? '240px' : '80px' }}
      >
        {/* Botão para expandir/recolher em telas grandes */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-4 right-[-12px] bg-[#1E2A4A] border-[#1a1f36] rounded-full p-1 z-50 h-6 w-6"
          >
            {isExpanded 
              ? <ChevronLeft className="h-4 w-4 text-white" /> 
              : <ChevronRight className="h-4 w-4 text-white" />
            }
          </Button>
        )}

        <nav className="p-4 space-y-2 mt-12">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  isActive ? "bg-[#1E2A4A] text-white" : "text-gray-400 hover:bg-[#1E2A4A] hover:text-white"
                }`}
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {(isExpanded || isMobile) && (
                  <span className="font-medium">
                    <FormattedMessage id={item.titleId} />
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
