"use client"
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Star,
  Sparkles,
  Check,
  TrendingDown,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  HelpCircle,
} from "lucide-react"

export function IconLibrary() {
  const icons = [
    { name: "search", icon: <Search className="h-8 w-8" />, label: "search" },
    { name: "chevron-down", icon: <ChevronDown className="h-8 w-8" />, label: "chevro..." },
    { name: "chevron-up", icon: <ChevronUp className="h-8 w-8" />, label: "chevro..." },
    { name: "close", icon: <X className="h-8 w-8" />, label: "close" },
    { name: "arrow-up", icon: <TrendingUp className="h-8 w-8" />, label: "arrow-..." },
    { name: "star", icon: <Star className="h-8 w-8" />, label: "star" },
    { name: "sparkles", icon: <Sparkles className="h-8 w-8" />, label: "sparkles" },
    { name: "check", icon: <Check className="h-8 w-8" />, label: "check" },
    { name: "arrow-down", icon: <TrendingDown className="h-8 w-8" />, label: "arrow-..." },
    { name: "chevron-right", icon: <ChevronRight className="h-8 w-8" />, label: "chevro..." },
    { name: "info", icon: <Info className="h-8 w-8" />, label: "sinfo-..." },
    { name: "trending", icon: <TrendingUp className="h-8 w-8" />, label: "strea..." },
    { name: "eye", icon: <Eye className="h-8 w-8" />, label: "iconamoo..." },
    { name: "eye-off", icon: <EyeOff className="h-8 w-8" />, label: "iconamoo..." },
    { name: "help", icon: <HelpCircle className="h-8 w-8" />, label: "help..." },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Icons</h2>
      <div className="grid grid-cols-5 gap-6">
        {icons.map((iconItem) => (
          <div key={iconItem.name} className="flex flex-col items-center space-y-2">
            <div className="text-purple-500">
              <span className="text-xs text-purple-400">◆ {iconItem.label}</span>
            </div>
            <div className="text-gray-900">{iconItem.icon}</div>
          </div>
        ))}
      </div>

      {/* Cursor Section */}
      <div className="mt-8 space-y-4">
        <div className="text-purple-500">
          <span className="text-xs text-purple-400">◆ Cursor</span>
        </div>
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 flex items-center justify-center space-x-8">
          <div className="cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-900">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="currentColor" />
            </svg>
          </div>
          <div className="cursor-grab">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-900">
              <path
                d="M8 9V7a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zM14 9V7a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zM8 13v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zM14 13v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zM8 17v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zM14 17v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
