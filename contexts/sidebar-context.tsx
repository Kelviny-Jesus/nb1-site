"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarContextType {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        isMobileOpen,
        setIsMobileOpen
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
