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
      logo: "/dubai-land-department-logo.png",
    },
    {
      id: "Marketplace",
      title: "Marketplace",
      description: "Analyze data received from real estate sales marketplaces.",
      icon: <Building2 className="h-5 w-5 text-red-500" />,
      logos: ["/property-finder-logo.png", "/bayut-logo.png"],
    },
  ]

  const propertyTypes = ["All", "Apartments", "Villas", "Land", "Commercial"]

  return (
    <div className="space-y-6">
      {/* Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((source) => (
          <Card
            key={source.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeSource === source.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => onSourceChange?.(source.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {source.icon}
                  <h3 className="text-lg font-semibold text-gray-900">{source.title}</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Sign in
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{source.description}</p>

              {/* Property Type Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {propertyTypes.map((type) => (
                  <Button
                    key={type}
                    variant={type === "Apartments" ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${
                      type === "Apartments" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {/* Logos */}
              <div className="flex items-center space-x-2">
                {source.id === "DLD" ? (
                  <img src={source.logo || "/placeholder.svg"} alt="DLD Logo" className="h-8" />
                ) : (
                  <div className="flex items-center space-x-3">
                    {source.logos?.map((logo, index) => (
                      <img key={index} src={logo || "/placeholder.svg"} alt={`Logo ${index + 1}`} className="h-6" />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
