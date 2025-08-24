import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function InputSelectFields() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Input & Select Fields</h3>

        {/* Input States */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Default */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">DEFAULT</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Placeholder"
                className="pl-10 rounded-[var(--radius-md)] border-border bg-background"
              />
            </div>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>

          {/* Hover */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">HOVER</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Placeholder"
                className="pl-10 rounded-[var(--radius-md)] border-ring hover:border-ring focus:border-ring"
              />
            </div>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>

          {/* Filled */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">FILLED</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Placeholder"
                className="pl-10 rounded-[var(--radius-md)] border-primary bg-accent/50"
              />
            </div>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>
        </div>

        {/* Select Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Default Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SELECT DEFAULT</Label>
            <Select>
              <SelectTrigger className="rounded-[var(--radius-md)] border-border">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Placeholder" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>

          {/* Hover Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SELECT HOVER</Label>
            <Select>
              <SelectTrigger className="rounded-[var(--radius-md)] border-ring hover:border-ring">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Placeholder" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>

          {/* Filled Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SELECT FILLED</Label>
            <Select>
              <SelectTrigger className="rounded-[var(--radius-md)] border-primary bg-accent/50">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Placeholder" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Caption</p>
          </div>
        </div>
      </div>
    </div>
  )
}
