import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, TrendingUp, TrendingDown, Info } from "lucide-react"

export function CardComponents() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Card Components</h3>

        {/* Basic Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">BASIC CARDS</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <CardTitle className="text-lg">Basic Card</CardTitle>
                <CardDescription>Simple card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a basic card component with standard styling and semantic tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)] border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Highlighted Card</CardTitle>
                <CardDescription>Card with primary border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This card uses primary border color for emphasis.</p>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)] bg-secondary">
              <CardHeader>
                <CardTitle className="text-lg">Secondary Card</CardTitle>
                <CardDescription>Card with secondary background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This card uses secondary background color.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Cards */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">DATA CARDS</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-[var(--radius-md)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,740,000 AED</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  12.5% vs 2,740 in Dubai
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Median Price</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,740,000 AED</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  worse by 30%
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price per sqm</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,740,000 AED</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  12.5% vs 2,740 in Dubai
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,740,000 - 2,740,000</div>
                <div className="flex items-center text-xs text-muted-foreground">vs 2,740 in Dubai</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">ACTION CARDS</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Property Listing</CardTitle>
                    <CardDescription>Mercedes-Benz Places, Downtown Dubai</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-[var(--radius-sm)]">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">4 Rooms, 60 m²</span>
                    <Badge variant="secondary" className="rounded-[var(--radius-sm)]">
                      Apartment
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">2,374,238 AED</div>
                  <div className="text-sm text-muted-foreground">Floor No. 11</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="rounded-[var(--radius-md)] bg-transparent">
                  Details
                </Button>
                <Button className="rounded-[var(--radius-md)]">Contact Agent</Button>
              </CardFooter>
            </Card>

            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Analytics Report</CardTitle>
                    <CardDescription>Developer Performance</CardDescription>
                  </div>
                  <Badge variant="default" className="rounded-[var(--radius-sm)]">
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Generated on 18 Dec, 2024</div>
                  <div className="text-2xl font-bold">4,715 Properties</div>
                  <div className="text-sm text-muted-foreground">Across 12 developments</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="rounded-[var(--radius-md)] bg-transparent">
                  Download
                </Button>
                <Button className="rounded-[var(--radius-md)]">View Report</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
