"use client"

import { AuthProvider } from "@/hooks/use-auth"
import { Navbar } from "@/components/navigation/navbar"
import { Suspense } from "react"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="h-16 border-b bg-white"></div>}>
        <Navbar />
      </Suspense>
      <main>
        {children}
      </main>
    </AuthProvider>
  )
}
