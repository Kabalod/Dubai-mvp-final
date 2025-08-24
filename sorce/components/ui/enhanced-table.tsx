"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TableRow {
  id: string
  date: string
  location: string
  building: string
  rooms: number
  sqm: number
  roi: string
  price: number
  state?: "default" | "hover" | "selected"
}

interface EnhancedTableProps {
  title: string
  data: TableRow[]
  dateRange?: string
  totalResults?: number
  showMoreButton?: boolean
  onShowMore?: () => void
  state?: "default" | "hovering" | "fixed"
}

export function EnhancedTable({
  title,
  data,
  dateRange,
  totalResults,
  showMoreButton = true,
  onShowMore,
  state = "default",
}: EnhancedTableProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        state === "hovering" && "shadow-lg",
        state === "fixed" && "border-2 border-blue-200",
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {dateRange && <span>{dateRange}</span>}
            <Select defaultValue="newest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
            {totalResults && <span>{totalResults} results</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide border-b pb-2">
            <div>Date</div>
            <div>Location / Building</div>
            <div>Rooms, Meters</div>
            <div>ROI</div>
            <div>Price, AED</div>
            <div></div>
          </div>

          {/* Table Rows */}
          {data.map((row, index) => (
            <div
              key={row.id}
              className={cn(
                "grid grid-cols-6 gap-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors",
                row.state === "hover" && "bg-gray-50",
                row.state === "selected" && "bg-blue-50 border-blue-200",
              )}
            >
              <div className="text-sm text-gray-900">{row.date}</div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900">{row.location}</div>
                <div className="text-xs text-gray-500">{row.building}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-900">{row.rooms} Rooms,</div>
                <div className="text-xs text-gray-500">{row.sqm} m²</div>
              </div>
              <div className="text-sm text-gray-900">{row.roi}</div>
              <div className="text-sm font-medium text-gray-900">{row.price.toLocaleString()}</div>
              <div>
                <Button
                  variant={row.state === "selected" ? "default" : "outline"}
                  size="sm"
                  className={row.state === "selected" ? "bg-blue-600 text-white" : ""}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}

          {/* Show More Button */}
          {showMoreButton && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="text-gray-600 bg-transparent" onClick={onShowMore}>
                SHOW MORE
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
