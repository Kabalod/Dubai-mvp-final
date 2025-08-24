import { RealEstateDashboard } from "@/components/real-estate-dashboard"
import { ComponentShowcase } from "@/components/component-showcase"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RealEstateDashboard />
      <div className="border-t-8 border-purple-200 mt-8">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">UI Components Showcase</h1>
            <ComponentShowcase />
          </div>
        </div>
      </div>
    </div>
  )
}
