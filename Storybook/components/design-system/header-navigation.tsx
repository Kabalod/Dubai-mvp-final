import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeaderNavigation() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Header & Navigation</h3>

        {/* Main Header */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">MAIN HEADER</h4>
          <header className="bg-background border-b border-border p-4 rounded-[var(--radius-md)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-lg font-bold text-foreground">LOGO</div>
                <nav className="flex items-center space-x-6">
                  <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Main
                  </a>
                  <a href="#" className="text-sm font-medium text-primary">
                    Analytics
                  </a>
                  <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Reports
                  </a>
                  <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Payments
                  </a>
                </nav>
              </div>
              <Button variant="outline" size="sm" className="rounded-[var(--radius-md)] bg-transparent">
                Sign in
              </Button>
            </div>
          </header>
        </div>

        {/* Filter Header */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">FILTER HEADER</h4>
          <div className="bg-secondary/50 p-4 rounded-[var(--radius-md)] border border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="rounded-[var(--radius-sm)]">
                  Building
                </Badge>
                <Badge variant="secondary" className="rounded-[var(--radius-sm)]">
                  Districts
                </Badge>
                <Badge variant="outline" className="rounded-[var(--radius-sm)]">
                  Developer
                </Badge>
                <Badge variant="default" className="rounded-[var(--radius-sm)]">
                  Naming
                </Badge>
              </div>
              <Button className="rounded-[var(--radius-md)]">SEARCH</Button>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">BREADCRUMB</h4>
          <nav className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Home
            </a>
            <span className="text-muted-foreground">/</span>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Analytics
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Developer</span>
          </nav>
        </div>
      </div>
    </div>
  )
}
