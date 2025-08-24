"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-7 px-3",
        lg: "h-10 px-6",
        icon: "h-8 w-8",
      },
      state: {
        default: "",
        hover: "bg-blue-50 text-blue-600 border-blue-200",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  },
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  showClose?: boolean
  onClose?: () => void
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, state, asChild = false, showClose = false, onClose, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(enhancedButtonVariants({ variant, size, state, className }))} ref={ref} {...props}>
        {children}
        {showClose && (
          <X
            className="ml-2 h-3 w-3 cursor-pointer hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
          />
        )}
      </Comp>
    )
  },
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }
