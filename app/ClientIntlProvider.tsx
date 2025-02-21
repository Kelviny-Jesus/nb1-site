"use client"

import { type ReactNode, useState } from "react"
import { IntlProvider } from "react-intl"
import en from "@/locales/en.json"
import es from "@/locales/es.json"
import pt from "@/locales/pt.json"

const messages = {
  en,
  es,
  pt,
}

export default function ClientIntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en")

  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
      {children}
    </IntlProvider>
  )
}

