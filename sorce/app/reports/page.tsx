import { ApplicationHeader } from "@/components/application-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export default function ReportsPage() {
  const reportData = [
    {
      date: "18.08.24",
      time: "17:53",
      property: "The Sterling West, 3br",
      price: "3 400 000 AED",
      priceEvaluation: "6/10",
      liquidityAssessment: "6/10",
      marketAssessment: "6/10",
    },
    {
      date: "18.08.24",
      time: "17:53",
      property: "The Sterling West, 3br",
      price: "3 400 000 AED",
      priceEvaluation: "6/10",
      liquidityAssessment: "6/10",
      marketAssessment: "6/10",
    },
    {
      date: "18.08.24",
      time: "17:53",
      property: "The Sterling West, 3br",
      price: "3 400 000 AED",
      priceEvaluation: "6/10",
      liquidityAssessment: "6/10",
      marketAssessment: "6/10",
    },
    {
      date: "18.08.24",
      time: "17:53",
      property: "The Sterling West, 3br",
      price: "3 400 000 AED",
      priceEvaluation: "6/10",
      liquidityAssessment: "6/10",
      marketAssessment: "6/10",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <ApplicationHeader activeRoute="Reports" />

      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Evaluate the attractiveness of your deal</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Check the realtor's recommendations • Get an objective assessment of the quality of the deal/investment
          </p>
        </div>

        {/* Search Filters */}
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Building" className="pl-10 pr-10 w-64 rounded-full border-gray-300" />
            <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
          </div>

          <Input placeholder="Price" className="w-32 rounded-full border-gray-300" defaultValue="" />
          <span className="text-sm text-gray-500">AED</span>

          <Select defaultValue="3-beds">
            <SelectTrigger className="w-32 rounded-full border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="p-4 space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-3">BEDS</div>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    Studio
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-blue-50 border-blue-200">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    4
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    5
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    6
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    7
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    8+
                  </Button>
                </div>
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-500">
                    RESET
                  </Button>
                </div>
              </div>
            </SelectContent>
          </Select>

          <Select defaultValue="renting-out">
            <SelectTrigger className="w-40 rounded-full border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renting-out">Renting out</SelectItem>
              <SelectItem value="flipping">Flipping</SelectItem>
              <SelectItem value="live-in">Live in an apartment</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-500 hover:bg-blue-600 rounded-full px-8">GENERATE REPORT</Button>
        </div>

        {/* Reports Status */}
        <div className="text-center">
          <p className="text-gray-600">
            There are still reports according to the tariff: <span className="font-semibold">44/50</span>
          </p>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Order by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-32 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-gray-600">24 results</span>
          </div>

          {/* Results Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Transaction Parameters</th>
                      <th className="text-center p-4 text-sm font-medium text-gray-600">
                        Evaluation of the price characteristics of the deals
                      </th>
                      <th className="text-center p-4 text-sm font-medium text-gray-600">
                        Assessment of the facility's liquidity
                      </th>
                      <th className="text-center p-4 text-sm font-medium text-gray-600">
                        Assessment of market characteristics in the area
                      </th>
                      <th className="text-center p-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((report, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-900">{report.date}</div>
                          <div className="text-sm text-gray-500">{report.time}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-900">{report.property}</div>
                          <div className="text-sm text-gray-500">{report.price}</div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {report.priceEvaluation}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {report.liquidityAssessment}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {report.marketAssessment}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant={index === 4 ? "default" : "outline"}
                            size="sm"
                            className={index === 4 ? "bg-blue-500 hover:bg-blue-600" : ""}
                          >
                            Download pdf
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
