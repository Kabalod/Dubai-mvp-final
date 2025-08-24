import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function ButtonVariations() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Button Variations</h3>

        {/* Default State */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">DEFAULT</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-[var(--radius-xl)]">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="default" className="rounded-[var(--radius-xl)]">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-[var(--radius-xl)] bg-transparent">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-[var(--radius-xl)] font-bold">
              BUTTON <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="default" className="rounded-[var(--radius-xl)] font-bold">
              BUTTON <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-[var(--radius-xl)] font-bold bg-transparent">
              BUTTON <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hover State */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">HOVER</h4>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="rounded-[var(--radius-xl)] hover:bg-accent hover:text-accent-foreground"
            >
              Button <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="default" className="rounded-[var(--radius-xl)]">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-[var(--radius-xl)] hover:bg-accent bg-transparent">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Disabled State */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">DISABLED</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" disabled className="rounded-[var(--radius-xl)]">
              Button <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="default" disabled className="rounded-[var(--radius-xl)] font-bold">
              BUTTON <X className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" disabled className="rounded-[var(--radius-xl)] font-bold bg-transparent">
              BUTTON <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Icon Only Buttons */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">ICON BUTTONS</h4>
          <div className="flex gap-3">
            <Button variant="secondary" size="icon" className="rounded-[var(--radius-lg)]">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="rounded-[var(--radius-lg)]">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-[var(--radius-lg)] bg-transparent">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Link Buttons */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">LINK BUTTONS</h4>
          <div className="space-y-2">
            <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
              Forgot your password?
            </Button>
            <Button variant="link" disabled className="p-0 h-auto">
              Forgot your password?
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
