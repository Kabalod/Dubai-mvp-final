"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Info, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricData {
  label: string
  value: string
  currency?: string
  trend?: {
    value: string
    direction: "up" | "down"
  }
  comparison?: {
    baseline: string
    performance: string
  }
  info?: boolean
}

interface CollapsibleCardProps {
  title: string
  metrics: MetricData[]
  defaultOpen?: boolean
  state?: "default" | "open" | "closed" | "hover"
}

export function CollapsibleCard({ title, metrics, defaultOpen = false, state = "default" }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen || state === "open")

  React.useEffect(() => {
    if (state === "open") setIsOpen(true)
    if (state === "closed") setIsOpen(false)
  }, [state])

  return (
    <Card className={cn("transition-all duration-200", state === "hover" && "shadow-md border-gray-300")}>
      <CardHeader
        className="flex flex-row items-center justify-between space-y-0 pb-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{metric.label}</span>
                  {metric.info && <Info className="h-3 w-3 text-gray-400" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-semibold">{metric.value}</span>
                    {metric.currency && <span className="text-sm text-gray-500">{metric.currency}</span>}
                    {metric.trend && (
                      <Badge
                        className={cn(
                          "text-xs",
                          metric.trend.direction === "up"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100",
                        )}
                      >
                        {metric.trend.value}
                        {metric.trend.direction === "up" ? (
                          <TrendingUp className="ml-1 h-2 w-2" />
                        ) : (
                          <TrendingDown className="ml-1 h-2 w-2" />
                        )}
                      </Badge>
                    )}
                  </div>
                  {metric.comparison && (
                    <>
                      <div className="text-xs text-gray-500">{metric.comparison.baseline}</div>
                      <div className="text-xs text-gray-500">{metric.comparison.performance}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
