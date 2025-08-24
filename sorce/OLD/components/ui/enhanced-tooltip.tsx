"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const EnhancedTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-2 text-xs text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-xs",
      className,
    )}
    {...props}
  />
))
EnhancedTooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, EnhancedTooltipContent, TooltipProvider }

// Компонент для демонстрации тултипов как на изображении
export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-4 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div className="w-full h-16 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                Hover me
              </div>
            </TooltipTrigger>
            <EnhancedTooltipContent>
              <p>Tooltips display informative text when users hover over, focus on, or tap an element</p>
            </EnhancedTooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
