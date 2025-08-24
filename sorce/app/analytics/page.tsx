"use client"

import { ApplicationHeader } from "@/components/application-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const pieData = [
  { name: "Villa Located", value: 35, color: "#3B82F6" },
  { name: "Villa in Bur Al Khadra", value: 25, color: "#06B6D4" },
  { name: "Villa in Dubai", value: 40, color: "#8B5CF6" },
]

const barData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 390 },
  { name: "Jun", value: 320 },
]

const lineData = [
  { name: "Jan", value: 400, secondary: 240 },
  { name: "Feb", value: 300, secondary: 139 },
  { name: "Mar", value: 200, secondary: 980 },
  { name: "Apr", value: 278, secondary: 390 },
  { name: "May", value: 189, secondary: 480 },
]

const tableData = [
  { building: "Mercedes-Benz Places, town", values: Array(8).fill("0,8") },
  { building: "Mercedes-Benz Places, town", values: Array(8).fill("0,8") },
  { building: "Mercedes-Benz Places, town", values: Array(8).fill("0,8") },
  { building: "Mercedes-Benz Places, town", values: Array(8).fill("0,8") },
  { building: "Mercedes-Benz Places, town", values: Array(8).fill("0,8") },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ApplicationHeader activeRoute="Analytics" />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Search Section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-900 border-b-2 border-blue-500 rounded-none pb-2">
            Building
          </Button>
          <Button variant="ghost" className="text-gray-500">
            Developer
          </Button>
          <Button variant="ghost" className="text-gray-500">
            Developer
          </Button>
          <Button variant="ghost" className="text-gray-500">
            Naming
          </Button>
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search" className="pl-10 bg-gray-100 border-0 rounded-full" />
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">SEARCH</Button>
        </div>

        {/* Developer Analytics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Developer Analytics</h2>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Structure</CardTitle>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sold by developer</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sold by apartment type</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Buildings commissioned per construction</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Analytics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">More Analytics</h2>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-blue-500 border-b-2 border-blue-500 rounded-none">
                Sales
              </Button>
              <Button variant="ghost" className="text-gray-500">
                Rental
              </Button>
            </div>
          </div>

          {/* Price Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Price</CardTitle>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {["Average price AED per sqm", "Average price AED per sqm", "Average ROI %"].map((title, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="text-sm font-medium">{title}</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="secondary" stroke="#06B6D4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Developer</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Secondary in Dubai</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Volume */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Market volume</CardTitle>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Number of deals</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Off-plan</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>Secondary Housing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liquidity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liquidity</CardTitle>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {["Deals to the number of apartments", "Apartments", "Apartments"].map((title, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="text-sm font-medium">{title}</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="secondary" stroke="#06B6D4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Developer</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Average for developers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer's Building */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Developer's building</h2>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-blue-500 border-b-2 border-blue-500 rounded-none">
                Sales
              </Button>
              <Button variant="ghost" className="text-gray-500">
                Rental
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Map */}
            <Card className="col-span-1">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-lg font-semibold">Dubai Map</div>
                      <div className="text-sm opacity-80">Building Locations</div>
                    </div>
                  </div>
                  {/* Map markers */}
                  <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Building name</div>
                    <div className="text-xs text-gray-500">Completion year: 2025</div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">Download analytics</Button>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {["Average price AED", "Deals per year %"].map((title, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-sm font-medium">{title}</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="secondary" stroke="#06B6D4" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Average price of apartments in a building</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Percentage of building occupancy</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Table</h2>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-500">
                Building
              </Button>
              <Button variant="ghost" className="text-gray-500">
                Best lots
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Building
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Num of apart.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rent deals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale deals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale per year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rent per year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales per year %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rent per year %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.building}</td>
                        {row.values.map((value, valueIndex) => (
                          <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t">
                <Button variant="ghost" className="text-blue-500">
                  SHOW MORE <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer's Table */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Developer's table</h2>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Developer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Building
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Renovation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.building}</td>
                        {row.values.map((value, valueIndex) => (
                          <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t">
                <Button variant="ghost" className="text-blue-500">
                  SHOW MORE <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
