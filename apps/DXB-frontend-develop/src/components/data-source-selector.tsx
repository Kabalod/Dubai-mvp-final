"use client"

import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CheckCircle, Building2 } from "lucide-react"

interface DataSourceSelectorProps {
  activeSource?: string
  onSourceChange?: (source: string) => void
}

export function DataSourceSelector({ activeSource = "DLD", onSourceChange }: DataSourceSelectorProps) {
  const sources = [
    {
      id: "DLD",
      title: "DLD",
      description: "Analyze all real transaction data obtained from Dubai Land Department.",
      icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
      logo: null, // Логотип пока не подключен
    },
    {
      id: "Marketplace",
      title: "Marketplace",
      description: "Analyze data received from real estate sales marketplaces.",
      icon: <Building2 className="h-5 w-5 text-red-500" />,
      logos: [], // Логотипы пока не подключены
    },
  ]

  const propertyTypes = ["All", "Apartments", "Villas", "Land", "Commercial"]

  return (
    <div className="space-y-6">
      {/* Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sources.map((source) => (
          <Card
            key={source.id}
            className={`rounded-[var(--radius-md)] cursor-pointer transition-all hover:shadow-lg border-2 ${
              activeSource === source.id 
                ? "border-primary bg-blue-50 shadow-md" 
                : "border-border bg-card hover:border-accent"
            }`}
            onClick={() => onSourceChange?.(source.id)}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {source.icon}
                  <h3 className="text-xl font-bold text-gray-900">{source.title}</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-[var(--radius-xl)] bg-transparent border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
                >
                  Sign in
                </Button>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{source.description}</p>

              {/* Property Type Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                {propertyTypes.map((type) => (
                  <Button
                    key={type}
                    variant={type === "Apartments" ? "default" : "outline"}
                    size="sm"
                    className={`rounded-[var(--radius-xl)] transition-colors ${
                      type === "Apartments" 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-gray-600 border-gray-300 bg-transparent hover:text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {/* Logos */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border">
                {source.id === "DLD" ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-[var(--radius-md)] flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">DLD</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-[var(--radius-md)] flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs">MKT</span>
                    </div>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">Official data source</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
