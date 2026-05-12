"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/dashboard"

    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "teacher":
        return "/teacher/dashboard"
      default:
        return "/dashboard"
    }
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img src="/main-logo.jpeg" alt="Step by Step English Logo" className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 border border-indigo-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Step by Step English
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/courses" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Courses
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Contact
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href={getDashboardLink()}>
                <Button variant="ghost" className="hover:bg-indigo-100 hover:text-indigo-700">Dashboard</Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-gray-900 hover:text-gray-900 hover:bg-gray-100">
                      <span className="mr-2">👤</span>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer text-gray-900 hover:text-gray-900 hover:bg-gray-100">
                      <span className="mr-2">⚙️</span>
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-gray-900 hover:text-gray-900 hover:bg-gray-100">
                    <span className="mr-2">🚪</span>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-indigo-100 hover:text-indigo-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
