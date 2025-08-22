import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function CheckboxControls() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Checkbox & Controls</h3>

        {/* Checkboxes */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">CHECKBOXES</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="default" className="rounded-[var(--radius-sm)]" />
              <Label htmlFor="default" className="text-sm">
                Default
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checked" checked className="rounded-[var(--radius-sm)]" />
              <Label htmlFor="checked" className="text-sm">
                Checked
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="indeterminate" className="rounded-[var(--radius-sm)]" />
              <Label htmlFor="indeterminate" className="text-sm">
                Indeterminate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled" disabled className="rounded-[var(--radius-sm)]" />
              <Label htmlFor="disabled" className="text-sm text-muted-foreground">
                Disabled
              </Label>
            </div>
          </div>
        </div>

        {/* Radio Buttons */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">RADIO BUTTONS</h4>
          <RadioGroup defaultValue="option1" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1" className="text-sm">
                Option 1
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2" className="text-sm">
                Option 2
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" disabled />
              <Label htmlFor="option3" className="text-sm text-muted-foreground">
                Disabled
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Switches */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SWITCHES</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="switch1" />
              <Label htmlFor="switch1" className="text-sm">
                Default
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="switch2" checked />
              <Label htmlFor="switch2" className="text-sm">
                Checked
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="switch3" disabled />
              <Label htmlFor="switch3" className="text-sm text-muted-foreground">
                Disabled
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
