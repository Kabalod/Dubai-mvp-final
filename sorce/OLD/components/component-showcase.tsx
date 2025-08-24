"use client"

import * as React from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { EnhancedTable } from "@/components/ui/enhanced-table"
import { TooltipDemo } from "@/components/ui/enhanced-tooltip"
import { EnhancedDataSourceCard } from "@/components/ui/enhanced-data-source-card"
import { EnhancedSelect } from "@/components/ui/enhanced-dropdown"
import { ControlsPanel } from "@/components/ui/enhanced-controls"
import { IconLibrary } from "@/components/ui/icon-library"
import { CheckCircle, Building2 } from "lucide-react"

export function ComponentShowcase() {
  const [selectedValue, setSelectedValue] = React.useState("")

  // Mock data for table
  const tableData = [
    {
      id: "1",
      date: "18 Dec, 2024",
      location: "Mercedes-Benz Places, Downtown Dubai",
      building: "Apartment, Floor No. 11",
      rooms: 4,
      sqm: 60,
      roi: "4,715",
      price: 2374238,
      state: "default" as const,
    },
    {
      id: "2",
      date: "18 Dec, 2024",
      location: "Mercedes-Benz Places, Downtown Dubai",
      building: "Apartment, Floor No. 11",
      rooms: 4,
      sqm: 60,
      roi: "4,715",
      price: 2374238,
      state: "hover" as const,
    },
  ]

  // Mock data for analytics table
  const analyticsData = [
    {
      id: "1",
      date: "18 Dec, 2024",
      location: "Mercedes-Benz Places, town",
      building: "Building",
      rooms: 0.8,
      sqm: 0.8,
      roi: "0,8",
      price: 0.8,
      state: "default" as const,
    },
    {
      id: "2",
      date: "18 Dec, 2024",
      location: "Mercedes-Benz Places, town",
      building: "Building",
      rooms: 0.8,
      sqm: 0.8,
      roi: "0,8",
      price: 0.8,
      state: "hover" as const,
    },
    {
      id: "3",
      date: "18 Dec, 2024",
      location: "Mercedes-Benz Places, town",
      building: "Building",
      rooms: 0.8,
      sqm: 0.8,
      roi: "0,8",
      price: 0.8,
      state: "default" as const,
    },
  ]

  // Mock data for cards
  const priceMetrics = [
    {
      label: "Average price",
      value: "2,740,000",
      currency: "AED",
      trend: { value: "12,5%", direction: "up" as const },
      comparison: {
        baseline: "vs 2,740 in Dubai",
        performance: "worse by 30%",
      },
      info: true,
    },
    {
      label: "Median price",
      value: "2,740,000",
      currency: "AED",
      trend: { value: "12,5%", direction: "up" as const },
      comparison: {
        baseline: "vs 2,740 in Dubai",
        performance: "worse by 30%",
      },
      info: true,
    },
  ]

  const dealsMetrics = [
    {
      label: "Deals",
      value: "2,740,000",
      currency: "AED",
      trend: { value: "12,5%", direction: "up" as const },
      comparison: {
        baseline: "vs 2,740 in Dubai",
        performance: "worse by 30%",
      },
      info: true,
    },
  ]

  return (
    <div className="space-y-12 p-6">
      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Buttons</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">DEFAULT</h3>
            <div className="flex flex-wrap gap-2">
              <EnhancedButton showClose>Button</EnhancedButton>
              <EnhancedButton variant="primary" showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="outline" showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="default" size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="primary" size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="outline" size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="outline" showClose>
                BUTTON
              </EnhancedButton>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">HOVER</h3>
            <div className="flex flex-wrap gap-2">
              <EnhancedButton state="hover" showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="primary" state="hover" showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="outline" state="hover" showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="outline" state="hover" size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="primary" state="hover" size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="outline" state="hover" showClose>
                BUTTON
              </EnhancedButton>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">DISABLED</h3>
            <div className="flex flex-wrap gap-2">
              <EnhancedButton state="disabled" disabled showClose>
                Button
              </EnhancedButton>
              <EnhancedButton variant="default" state="disabled" disabled size="lg" showClose>
                BUTTON
              </EnhancedButton>
              <EnhancedButton variant="outline" state="disabled" disabled showClose>
                BUTTON
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Table Main Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Table Main</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">DEFAULT</h3>
            <EnhancedTable
              title="DLD SALES"
              data={tableData}
              dateRange="From 16 Dec, 2024 to 23 Dec, 2024"
              totalResults={24}
              state="default"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">HOVERING</h3>
            <EnhancedTable
              title="DLD SALES"
              data={tableData.map((item) => ({ ...item, state: "hover" as const }))}
              dateRange="From 16 Dec, 2024 to 23 Dec, 2024"
              totalResults={24}
              state="hovering"
            />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Cards</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-green-300 rounded">
              <div className="text-green-600 font-medium text-sm mb-2">12,5% ↗</div>
            </div>
            <div className="p-4 border-2 border-dashed border-red-300 rounded">
              <div className="text-red-600 font-medium text-sm mb-2">12,5% ↘</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">OPEN</h3>
              <CollapsibleCard title="Price" metrics={priceMetrics} defaultOpen={true} state="open" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">CLOSE</h3>
              <CollapsibleCard title="Price" metrics={priceMetrics} defaultOpen={false} state="closed" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">HOVER</h3>
              <CollapsibleCard title="Price" metrics={priceMetrics} defaultOpen={true} state="hover" />
            </div>
          </div>
        </div>
      </section>

      {/* Table Analytics Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Table Analytics</h2>
        <div className="space-y-6">
          {/* Frame sections */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border-2 border-dashed border-purple-300 rounded">
              <div className="text-purple-500 text-xs mb-2">◆ Fra...</div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">DEFAULT</div>
                <div className="text-sm font-medium text-gray-600">SELECTED</div>
                <div className="p-2 border border-gray-300 rounded text-sm">Unit +</div>
                <div className="p-2 border border-blue-500 bg-blue-50 rounded text-sm text-blue-600">Unit +</div>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-purple-300 rounded">
              <div className="text-purple-500 text-xs mb-2">◆ Frame 117</div>
              <div className="p-2 border border-gray-300 rounded text-sm text-center">Unit +</div>
            </div>

            <div className="p-4 border-2 border-dashed border-purple-300 rounded">
              <div className="text-purple-500 text-xs mb-2">◆ Frame 116</div>
              <div className="p-8 border border-gray-300 rounded text-center text-lg font-semibold">0,8</div>
            </div>
          </div>

          {/* Main analytics table */}
          <div className="p-4 border-2 border-dashed border-purple-300 rounded">
            <div className="text-purple-500 text-xs mb-4">◆ Frame 120</div>
            <div className="space-y-4">
              <div className="grid grid-cols-9 gap-2 text-xs font-medium text-gray-500">
                <div></div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
                <div>Unit +</div>
              </div>

              {["DEFAULT", "HOVER", "FIXED"].map((state, index) => (
                <div
                  key={state}
                  className={`grid grid-cols-9 gap-2 text-sm p-2 rounded ${
                    state === "HOVER" ? "bg-gray-50" : state === "FIXED" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="font-medium text-gray-600">{state}</div>
                  <div>Mercedes-Benz Places, town</div>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>0,8</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Filter sections */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border-2 border-dashed border-purple-300 rounded">
              <div className="text-purple-500 text-xs mb-4">◆ Frame 24</div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">DEFAULT</div>
                  <div className="text-sm font-medium text-gray-600">ACTIVE</div>
                  <div className="text-sm font-medium text-gray-600">SELECTED</div>
                </div>
                <EnhancedSelect
                  options={[{ value: "building", label: "Building" }]}
                  value="building"
                  placeholder="Building"
                />
                <EnhancedSelect
                  options={[{ value: "building", label: "Building" }]}
                  value="building"
                  placeholder="Building"
                  state="selected"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Building</span>
                  <button className="text-gray-400 hover:text-gray-600">×</button>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-purple-300 rounded">
              <div className="text-purple-500 text-xs mb-4">◆ Frame 53</div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">OPEN</div>
                  <div className="text-sm font-medium text-gray-600">SELECTED</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">From 16 Dec, 2024 to 23 Dec, 2024</div>
                  <EnhancedSelect
                    options={[
                      { value: "1bedroom", label: "1 bedroom" },
                      { value: "2bedrooms", label: "2 bedrooms" },
                      { value: "3bedrooms", label: "3 bedrooms" },
                      { value: "4bedrooms", label: "4 bedrooms" },
                      { value: "studio", label: "Studio" },
                    ]}
                    value="1bedroom"
                    placeholder="Beds"
                  />
                  <div className="text-xs text-gray-500">24 results</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">From 16 Dec, 2024 to 23 Dec, 2024</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Beds</span>
                    <button className="text-gray-400 hover:text-gray-600">×</button>
                  </div>
                  <div className="text-xs text-gray-500">24 results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icons Section */}
      <IconLibrary />

      {/* Tooltips Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Tooltip</h2>
        <TooltipDemo />
      </section>

      {/* DLD Marketplaces Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">DLD Marketplaces</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">PRESSED</h3>
            <div className="grid grid-cols-2 gap-6">
              <EnhancedDataSourceCard
                id="dld-pressed"
                title="DLD"
                description="Analyze all real transaction data obtained from Dubai Land Department."
                icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                logo="/dubai-land-department-logo.png"
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="pressed"
              />
              <EnhancedDataSourceCard
                id="marketplace-pressed"
                title="Marketplaces"
                description="Analyze data received from real estate sales marketplaces."
                icon={<Building2 className="h-5 w-5 text-red-500" />}
                logos={["/property-finder-logo.png", "/bayut-logo.png"]}
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="pressed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">HOVER</h3>
            <div className="grid grid-cols-2 gap-6">
              <EnhancedDataSourceCard
                id="dld-hover"
                title="DLD"
                description="Analyze all real transaction data obtained from Dubai Land Department."
                icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                logo="/dubai-land-department-logo.png"
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="hover"
              />
              <EnhancedDataSourceCard
                id="marketplace-hover"
                title="Marketplaces"
                description="Analyze data received from real estate sales marketplaces."
                icon={<Building2 className="h-5 w-5 text-red-500" />}
                logos={["/property-finder-logo.png", "/bayut-logo.png"]}
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="hover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">DEFAULT</h3>
            <div className="grid grid-cols-2 gap-6">
              <EnhancedDataSourceCard
                id="dld-default"
                title="DLD"
                description="Analyze all real transaction data obtained from Dubai Land Department."
                icon={<CheckCircle className="h-5 w-5 text-blue-500" />}
                logo="/dubai-land-department-logo.png"
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="default"
              />
              <EnhancedDataSourceCard
                id="marketplace-default"
                title="Marketplaces"
                description="Analyze data received from real estate sales marketplaces."
                icon={<Building2 className="h-5 w-5 text-red-500" />}
                logos={["/property-finder-logo.png", "/bayut-logo.png"]}
                propertyTypes={["All", "Apartments", "Villas", "Land", "Commercial"]}
                activeType="Apartments"
                state="default"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Dropdown</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600">Dropdown menu</h3>
            <div className="p-4 border rounded bg-white shadow-sm">
              <div className="space-y-2">
                {["Item", "Item", "Item", "Item", "Item", "Item", "Item", "Item"].map((item, index) => (
                  <div key={index} className="p-2 hover:bg-gray-50 rounded text-sm cursor-pointer">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">DEFAULT</h3>
                <EnhancedSelect
                  options={[
                    { value: "item1", label: "Item" },
                    { value: "item2", label: "Item" },
                  ]}
                  value={selectedValue}
                  onValueChange={setSelectedValue}
                  state="default"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">HOVER</h3>
                <EnhancedSelect options={[{ value: "item1", label: "Item" }]} value="item1" state="hover" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">SELECTED</h3>
                <EnhancedSelect options={[{ value: "item1", label: "Item" }]} value="item1" state="selected" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Controls</h2>
        <ControlsPanel />
      </section>
    </div>
  )
}
