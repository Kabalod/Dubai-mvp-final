"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const EnhancedDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
EnhancedDropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const EnhancedDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    selected?: boolean
  }
>(({ className, inset, selected, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      selected && "bg-blue-50 text-blue-600",
      className,
    )}
    {...props}
  >
    {children}
    {selected && <Check className="ml-auto h-4 w-4" />}
  </DropdownMenuPrimitive.Item>
))
EnhancedDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

interface EnhancedSelectProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  state?: "default" | "hover" | "selected"
}

export function EnhancedSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  state = "default",
}: EnhancedSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            state === "hover" && "border-gray-400 shadow-sm",
            state === "selected" && "border-blue-500 ring-2 ring-blue-500 ring-offset-2",
          )}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <EnhancedDropdownMenuContent className="w-[200px]">
        {options.map((option) => (
          <EnhancedDropdownMenuItem
            key={option.value}
            selected={value === option.value}
            onClick={() => {
              onValueChange?.(option.value)
              setOpen(false)
            }}
          >
            {option.label}
          </EnhancedDropdownMenuItem>
        ))}
      </EnhancedDropdownMenuContent>
    </DropdownMenu>
  )
}

export { DropdownMenu, DropdownMenuTrigger, EnhancedDropdownMenuContent, EnhancedDropdownMenuItem }
