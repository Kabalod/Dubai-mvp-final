"use client"

import { useState } from "react"
import { ApplicationHeader } from "@/components/application-header"
import { DataSourceSelector } from "@/components/data-source-selector"
import { TransactionsTable } from "@/components/transactions-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, ChevronDown, Info, TrendingUp } from "lucide-react"

export function RealEstateDashboard() {
  const [activeSource, setActiveSource] = useState("DLD")

  return (
    <div className="min-h-screen bg-white">
      {/* Application Header */}
      <ApplicationHeader activeRoute="Main" />

      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <DataSourceSelector activeSource={activeSource} onSourceChange={setActiveSource} />

        {/* Analytics Dashboard */}
        <>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>DLD</span>
            <span>•</span>
            <span>Apartments</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-6">
            <Button variant="ghost" className="text-gray-900 border-b-2 border-blue-500 rounded-none pb-2 px-0">
              Sales
            </Button>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-900 px-0">
              Rental
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by area, project or building"
                className="pl-12 pr-12 h-12 bg-gray-50 border border-gray-200 rounded-full text-sm"
              />
              <X className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 bg-gray-50 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100"
            >
              3 Beds
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 bg-gray-50 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100"
            >
              More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600 rounded-full font-medium">SEARCH</Button>
          </div>

          {/* Time Period Selector */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              YTD
            </Button>
            <Button className="h-10 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-full">1 week</Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              1 Month
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              3 Month
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              6 Month
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              1 Year
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4 text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100"
            >
              3 Years
            </Button>
          </div>

          {/* Overview Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>

            <div className="grid grid-cols-3 gap-8 max-w-4xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">13</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">BUILDINGS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">24</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">APARTMENTS</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">3000</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-1">
                    12,5% <TrendingUp className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">DEALS</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Price Section */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                  <CardTitle className="text-lg font-semibold text-gray-900">Price</CardTitle>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Average price</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">2,740,000</span>
                          <span className="text-sm text-gray-500">AED</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Median price</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">2,740,000</span>
                          <span className="text-sm text-gray-500">AED</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Average price per sqm</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">2,740,000</span>
                          <span className="text-sm text-gray-500">AED</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Price range</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">2,740,000 - 2,740,000</span>
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
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                  <CardTitle className="text-lg font-semibold text-gray-900">Market volume</CardTitle>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Deals</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">2,740,000</span>
                          <span className="text-sm text-gray-500">AED</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs 2,740 in Dubai</div>
                        <div className="text-xs text-gray-500">worse by 30%</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">Deal volume</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-semibold text-gray-900">10,000,000</span>
                          <span className="text-sm text-gray-500">AED</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                            12,5% <TrendingUp className="ml-1 h-3 w-3" />
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
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                  <CardTitle className="text-lg font-semibold text-gray-900">Liquidity</CardTitle>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 font-medium">Deals to the num of apartments</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl font-bold text-gray-900">0,8</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-1">
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
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                  <CardTitle className="text-lg font-semibold text-gray-900">ROI</CardTitle>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 font-medium">Average ROI</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl font-bold text-gray-900">0,5%</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-1">
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
      </div>
    </div>
  )
}
