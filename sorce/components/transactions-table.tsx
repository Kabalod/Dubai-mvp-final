"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  date: string
  location: string
  building: string
  floor?: number
  rooms: number
  sqm: number
  roi: string
  price: number
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "18 Dec, 2024",
    location: "Mercedes-Benz Places, Downtown Dubai",
    building: "Apartment, Floor No. 11",
    rooms: 4,
    sqm: 60,
    roi: "12%",
    price: 2374238,
  },
  {
    id: "2",
    date: "18 Dec, 2024",
    location: "Mercedes-Benz Places, Downtown Dubai",
    building: "Apartment, Floor No. 11",
    rooms: 4,
    sqm: 60,
    roi: "12%",
    price: 2374238,
  },
  {
    id: "3",
    date: "18 Dec, 2024",
    location: "Mercedes-Benz Places, Downtown Dubai",
    building: "Apartment, Floor No. 11",
    rooms: 4,
    sqm: 60,
    roi: "12%",
    price: 2374238,
  },
  {
    id: "4",
    date: "18 Dec, 2024",
    location: "Mercedes-Benz Places, Downtown Dubai",
    building: "Apartment, Floor No. 11",
    rooms: 4,
    sqm: 60,
    roi: "12%",
    price: 2374238,
  },
  {
    id: "5",
    date: "18 Dec, 2024",
    location: "Mercedes-Benz Places, Downtown Dubai",
    building: "Apartment, Floor No. 11",
    rooms: 4,
    sqm: 60,
    roi: "12%",
    price: 2374238,
  },
]

export function TransactionsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Transactions</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>From 16 Dec, 2024 to 23 Dec, 2024</span>
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
            <span>24 results</span>
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
          {mockTransactions.map((transaction, index) => (
            <div key={transaction.id} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100 last:border-b-0">
              <div className="text-sm text-gray-900">{transaction.date}</div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900">{transaction.location}</div>
                <div className="text-xs text-gray-500">{transaction.building}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-900">{transaction.rooms} Rooms,</div>
                <div className="text-xs text-gray-500">{transaction.sqm} m²</div>
              </div>
              <div className="text-sm text-gray-900">{transaction.roi}</div>
              <div className="text-sm font-medium text-gray-900">{transaction.price.toLocaleString()}</div>
              <div>
                <Button
                  variant={index === 4 ? "default" : "outline"}
                  size="sm"
                  className={index === 4 ? "bg-blue-600 text-white" : ""}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}

          {/* Show More Button */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="text-gray-600 bg-transparent">
              SHOW MORE
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
