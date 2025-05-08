import type { ReactNode } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientIntlProvider from "./ClientIntlProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NB1 Extension",
  description: "Your AI automation assistant",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientIntlProvider>{children}</ClientIntlProvider>
      </body>
    </html>
  )
}
