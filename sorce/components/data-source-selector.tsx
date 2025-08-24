"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface DataSourceSelectorProps {
  activeSource?: string
  onSourceChange?: (source: string) => void
}

export function DataSourceSelector({ activeSource = "DLD", onSourceChange }: DataSourceSelectorProps) {
  const propertyTypes = ["All", "Apartments", "Villas", "Land", "Commercial"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DLD Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
            activeSource === "DLD" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => onSourceChange?.("DLD")}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    activeSource === "DLD" ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}
                >
                  {activeSource === "DLD" && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">DLD</h3>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/dubai-land-department-logo.png" alt="DLD Logo" className="h-8" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  className={`text-sm px-3 py-1 h-auto ${
                    type === "Apartments" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Analyze all real transaction data obtained from Dubai Land Department.
            </p>
          </CardContent>
        </Card>

        {/* Marketplace Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
            activeSource === "Marketplace" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
          onClick={() => onSourceChange?.("Marketplace")}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    activeSource === "Marketplace" ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}
                >
                  {activeSource === "Marketplace" && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Marketplace</h3>
              </div>
              <div className="flex items-center space-x-3">
                <img src="/property-finder-logo-red.png" alt="Property Finder" className="h-6" />
                <img src="/bayut-logo-green.png" alt="Bayut" className="h-6" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  className={`text-sm px-3 py-1 h-auto ${
                    type === "Apartments" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>

            <p className="text-sm text-gray-500">Analyze data received from real estate sales marketplaces.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
