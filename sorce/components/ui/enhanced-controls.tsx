"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const EnhancedSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    state?: "default" | "disabled"
  }
>(({ className, state = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200",
      state === "disabled" && "opacity-50 cursor-not-allowed",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitive.Root>
))
EnhancedSwitch.displayName = SwitchPrimitive.Root.displayName

interface ControlsPanelProps {
  state?: "default" | "disabled"
}

export function ControlsPanel({ state = "default" }: ControlsPanelProps) {
  const [defaultChecked, setDefaultChecked] = React.useState(true)
  const [disabledChecked, setDisabledChecked] = React.useState(false)

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Controls</h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">DEFAULT</span>
          <EnhancedSwitch checked={defaultChecked} onCheckedChange={setDefaultChecked} state="default" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">DISABLED</span>
          <EnhancedSwitch checked={disabledChecked} onCheckedChange={setDisabledChecked} state="disabled" disabled />
        </div>
      </div>
    </div>
  )
}

export { EnhancedSwitch }
