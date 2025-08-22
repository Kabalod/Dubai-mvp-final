"use client"
import { ButtonVariations } from "@/components/design-system/button-variations"
import { InputSelectFields } from "@/components/design-system/input-select-fields"
import { TabsSegmented } from "@/components/design-system/tabs-segmented"
import { CheckboxControls } from "@/components/design-system/checkbox-controls"
import { HeaderNavigation } from "@/components/design-system/header-navigation"
import { SidebarNavigation } from "@/components/design-system/sidebar-navigation"
import { CardComponents } from "@/components/design-system/card-components"
import { IconShowcase } from "@/components/design-system/icon-showcase"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Unified Design System</h1>
            <p className="text-muted-foreground">
              Production-ready UI components with semantic tokens and dark mode support
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="text-2xl font-bold text-foreground">8</div>
            <div className="text-sm text-muted-foreground">Component Categories</div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="text-2xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">UI Components</div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-sm text-muted-foreground">Semantic Tokens</div>
          </div>
          <div className="bg-card border border-border rounded-[var(--radius-md)] p-4">
            <div className="text-2xl font-bold text-foreground">A11Y</div>
            <div className="text-sm text-muted-foreground">Accessible</div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Header & Navigation */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Header & Navigation</h2>
            </div>
            <HeaderNavigation />
          </div>

          {/* Sidebar Navigation */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Sidebar Navigation</h2>
            </div>
            <SidebarNavigation />
          </div>

          {/* Form Elements */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Form Elements</h2>
            </div>
            <InputSelectFields />
          </div>

          {/* Interactive Elements */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Interactive Elements</h2>
            </div>
            <ButtonVariations />
          </div>

          {/* Tabs & Controls */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Tabs & Segmented Controls</h2>
            </div>
            <TabsSegmented />
          </div>

          {/* Checkbox & Controls */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Checkbox & Controls</h2>
            </div>
            <CheckboxControls />
          </div>

          {/* Card Components */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Card Components</h2>
            </div>
            <CardComponents />
          </div>

          {/* Icon Showcase */}
          <div className="bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <div className="bg-secondary px-6 py-3">
              <h2 className="text-xl font-semibold text-foreground">Icon Showcase</h2>
            </div>
            <IconShowcase />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Design Tokens</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Semantic color system</li>
                  <li>Consistent spacing scale</li>
                  <li>Typography hierarchy</li>
                  <li>Border radius tokens</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Features</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Dark mode support</li>
                  <li>Responsive design</li>
                  <li>Keyboard navigation</li>
                  <li>Screen reader friendly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Technology</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Tailwind CSS v4</li>
                  <li>shadcn/ui components</li>
                  <li>React + TypeScript</li>
                  <li>Lucide icons</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Design System v1.0 • Built with modern web standards • Production ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
