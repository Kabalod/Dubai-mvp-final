"use client"

import { useState } from "react"
import { ApplicationHeader } from "./application-header"
import { DataSourceSelector } from "./data-source-selector"
import { TransactionsTable } from "./Transactions/TransactionsTable"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Search, X, ChevronDown, Info, TrendingUp } from "lucide-react"

export function RealEstateDashboard() {
  const [activeSource, setActiveSource] = useState("DLD")
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Application Header */}
      <ApplicationHeader activeRoute="Analytics" />

      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {!showAnalytics ? (
          /* Data Source Selection */
          <DataSourceSelector
            activeSource={activeSource}
            onSourceChange={(source) => {
              setActiveSource(source)
              setShowAnalytics(true)
            }}
          />
        ) : (
          /* Analytics Dashboard */
          <>
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowAnalytics(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back
                </Button>
                <span className="text-sm text-gray-600">DLD</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">Apartments</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-900 border-b-2 border-blue-500 rounded-none pb-2">
                Sales
              </Button>
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                Rental
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search by area, project or building" className="pl-10 pr-10 bg-gray-100 border-0" />
                <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
              </div>
              <Button variant="outline" className="bg-gray-100 border-0">
                3 Beds
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="bg-gray-100 border-0">
                More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">SEARCH</Button>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-500">
                YTD
              </Button>
              <Button variant="ghost" className="text-blue-500 border-b-2 border-blue-500 rounded-none pb-1">
                1 week
              </Button>
              <Button variant="ghost" className="text-gray-500">
                1 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                3 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                6 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                1 Year
              </Button>
              <Button variant="ghost" className="text-gray-500">
                3 Years
              </Button>
            </div>

            {/* Overview Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Overview</h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">13</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Buildings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Apartments</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold">3000</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      12,5% <TrendingUp className="ml-1 h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Deals</div>
                </div>
              </div>

              {/* Data Cards Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Price Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Price</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average price</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">2,740,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Median price</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">2,740,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average price per sqm</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">2,740,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Price range</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">2,740,000 - 2,740,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Volume Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Market volume</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Deals</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">2,740,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Deal volume</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">10,000,000</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                          <div className="text-xs text-gray-500">worse by 30%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Liquidity Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Liquidity</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Deals to the num of apartments</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold">0,8</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ROI Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">ROI</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Average ROI</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold">0,5%</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transactions Table */}
            <TransactionsTable />
          </>
        )}
      </div>
    </div>
  )
}
