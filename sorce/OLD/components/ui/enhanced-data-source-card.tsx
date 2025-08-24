"use client"

import type * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataSourceCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  logo?: string
  logos?: string[]
  propertyTypes: string[]
  activeType?: string
  state?: "default" | "pressed" | "hover"
  onSelect?: (id: string) => void
  onTypeSelect?: (type: string) => void
}

export function EnhancedDataSourceCard({
  id,
  title,
  description,
  icon,
  logo,
  logos,
  propertyTypes,
  activeType = "Apartments",
  state = "default",
  onSelect,
  onTypeSelect,
}: DataSourceCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        state === "pressed" && "ring-2 ring-blue-500 bg-blue-50 shadow-md",
        state === "hover" && "shadow-lg border-gray-300",
        state === "default" && "hover:shadow-md",
      )}
      onClick={() => onSelect?.(id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Sign in
          </Button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {/* Property Type Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {propertyTypes.map((type) => (
            <Button
              key={type}
              variant={type === activeType ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-xs transition-colors",
                type === activeType
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:border-gray-400",
              )}
              onClick={(e) => {
                e.stopPropagation()
                onTypeSelect?.(type)
              }}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Logos */}
        <div className="flex items-center space-x-2">
          {logo ? (
            <img src={logo || "/placeholder.svg"} alt={`${title} Logo`} className="h-8" />
          ) : (
            logos && (
              <div className="flex items-center space-x-3">
                {logos.map((logoSrc, index) => (
                  <img key={index} src={logoSrc || "/placeholder.svg"} alt={`Logo ${index + 1}`} className="h-6" />
                ))}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
