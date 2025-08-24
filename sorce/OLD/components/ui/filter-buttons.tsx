"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterButtonProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  state?: "default" | "hover" | "disabled"
  showClose?: boolean
  onClose?: () => void
  className?: string
}

export function FilterButton({
  children,
  variant = "outline",
  size = "sm",
  state = "default",
  showClose = false,
  onClose,
  className,
  ...props
}: FilterButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const stateClasses = {
    default: "",
    hover: "bg-blue-50 text-blue-600 border-blue-200",
    disabled: "opacity-50 cursor-not-allowed",
  }

  return (
    <Button
      variant={variant === "primary" ? "default" : variant}
      size={size}
      className={cn(
        "rounded-full",
        variant === "primary" && "bg-blue-500 hover:bg-blue-600",
        stateClasses[state],
        className,
      )}
      disabled={state === "disabled"}
      {...props}
    >
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
    </Button>
  )
}

export function ButtonShowcase() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">DEFAULT</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton showClose>Button</FilterButton>
          <FilterButton variant="primary" showClose>
            Button
          </FilterButton>
          <FilterButton variant="outline" showClose>
            Button
          </FilterButton>
          <FilterButton variant="default" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="primary" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="outline" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="ghost" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="outline" showClose>
            BUTTON
          </FilterButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">HOVER</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton state="hover" showClose>
            Button
          </FilterButton>
          <FilterButton variant="primary" state="hover" showClose>
            Button
          </FilterButton>
          <FilterButton variant="outline" state="hover" showClose>
            Button
          </FilterButton>
          <FilterButton variant="default" state="hover" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="primary" state="hover" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="outline" state="hover" showClose>
            BUTTON
          </FilterButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">DISABLED</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton state="disabled" showClose>
            Button
          </FilterButton>
          <FilterButton variant="default" state="disabled" showClose>
            BUTTON
          </FilterButton>
          <FilterButton variant="outline" state="disabled" showClose>
            BUTTON
          </FilterButton>
        </div>
      </div>
    </div>
  )
}
