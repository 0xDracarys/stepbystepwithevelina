import type React from "react"
import type { Metadata } from "next"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "Step by Step English | Master Lithuanian & English",
  description: "Learn English and Lithuanian step by step with Evelina. Practical lessons, cultural immersion, and professional guidance.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
