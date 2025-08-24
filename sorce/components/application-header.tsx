"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ApplicationHeaderProps {
  activeRoute?: string
}

export function ApplicationHeader({ activeRoute = "Main" }: ApplicationHeaderProps) {
  const navigationItems = [
    { name: "Main", href: "/" },
    { name: "Analytics", href: "/analytics" },
    { name: "Reports", href: "/reports" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">LOGO</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`text-sm font-medium transition-colors hover:text-blue-600 px-0 ${
                  activeRoute === item.name ? "text-blue-600" : "text-gray-600"
                }`}
                onClick={() => (window.location.href = item.href)}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => (window.location.href = "/payments")}>
                  Billing & Payments
                </DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
