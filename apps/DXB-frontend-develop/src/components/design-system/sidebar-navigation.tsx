"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Home, BarChart3, FileText, CreditCard, Settings, User } from "lucide-react"
import { useState } from "react"

export function SidebarNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Sidebar Navigation</h3>

        {/* Expanded Sidebar */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">EXPANDED SIDEBAR</h4>
          <div className="w-64 bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold text-foreground">LOGO</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-[var(--radius-sm)]"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-[var(--radius-sm)]"
              >
                <Home className="h-4 w-4" />
                Dashboard
                <Badge variant="secondary" className="ml-auto text-xs">
                  12
                </Badge>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-sm)]"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-sm)]"
              >
                <FileText className="h-4 w-4" />
                Reports
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-sm)]"
              >
                <CreditCard className="h-4 w-4" />
                Payments
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-sm)]"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </nav>

            <div className="mt-8 pt-4 border-t border-border">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-[var(--radius-sm)]"
              >
                <User className="h-4 w-4" />
                Profile
              </a>
            </div>
          </div>
        </div>

        {/* Collapsed Sidebar */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">COLLAPSED SIDEBAR</h4>
          <div className="w-16 bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="flex flex-col items-center space-y-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-sm)]">
                <ChevronRight className="h-4 w-4" />
              </Button>

              <nav className="flex flex-col items-center space-y-2">
                <Button variant="default" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)] relative">
                  <Home className="h-4 w-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    12
                  </Badge>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)]">
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)]">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)]">
                  <CreditCard className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)]">
                  <Settings className="h-4 w-4" />
                </Button>
              </nav>

              <div className="pt-4 border-t border-border">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-sm)]">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
