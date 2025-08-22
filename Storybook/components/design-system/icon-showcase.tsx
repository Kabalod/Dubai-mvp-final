import {
  Home,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  Share,
  Copy,
  Link,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react"

export function IconShowcase() {
  const iconCategories = [
    {
      title: "Navigation",
      icons: [
        { icon: Home, name: "Home" },
        { icon: BarChart3, name: "Analytics" },
        { icon: FileText, name: "Reports" },
        { icon: CreditCard, name: "Payments" },
        { icon: Settings, name: "Settings" },
        { icon: User, name: "Profile" },
      ],
    },
    {
      title: "Actions",
      icons: [
        { icon: Search, name: "Search" },
        { icon: Filter, name: "Filter" },
        { icon: Download, name: "Download" },
        { icon: Upload, name: "Upload" },
        { icon: Edit, name: "Edit" },
        { icon: Trash2, name: "Delete" },
      ],
    },
    {
      title: "Interface",
      icons: [
        { icon: Plus, name: "Add" },
        { icon: Minus, name: "Remove" },
        { icon: X, name: "Close" },
        { icon: Check, name: "Confirm" },
        { icon: Copy, name: "Copy" },
        { icon: Link, name: "Link" },
      ],
    },
    {
      title: "Arrows",
      icons: [
        { icon: ChevronDown, name: "Down" },
        { icon: ChevronUp, name: "Up" },
        { icon: ChevronLeft, name: "Left" },
        { icon: ChevronRight, name: "Right" },
        { icon: ArrowUp, name: "Arrow Up" },
        { icon: ArrowDown, name: "Arrow Down" },
      ],
    },
    {
      title: "Status",
      icons: [
        { icon: Info, name: "Info" },
        { icon: AlertCircle, name: "Warning" },
        { icon: CheckCircle, name: "Success" },
        { icon: XCircle, name: "Error" },
        { icon: Star, name: "Favorite" },
        { icon: Heart, name: "Like" },
      ],
    },
    {
      title: "Communication",
      icons: [
        { icon: Mail, name: "Email" },
        { icon: Phone, name: "Phone" },
        { icon: Share, name: "Share" },
        { icon: MapPin, name: "Location" },
        { icon: Calendar, name: "Calendar" },
        { icon: Clock, name: "Time" },
      ],
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Icon Showcase</h3>

        {/* Icon Grid by Category */}
        <div className="space-y-8">
          {iconCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{category.title}</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {category.icons.map((iconItem, iconIndex) => {
                  const IconComponent = iconItem.icon
                  return (
                    <div
                      key={iconIndex}
                      className="flex flex-col items-center space-y-2 p-3 bg-card border border-border rounded-[var(--radius-md)] hover:bg-accent transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-foreground" />
                      <span className="text-xs text-muted-foreground text-center">{iconItem.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Icon Sizes */}
        <div className="space-y-4 mt-12">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">ICON SIZES</h4>
          <div className="flex items-center space-x-8 p-4 bg-card border border-border rounded-[var(--radius-md)]">
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-3 w-3 text-foreground" />
              <span className="text-xs text-muted-foreground">12px</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-4 w-4 text-foreground" />
              <span className="text-xs text-muted-foreground">16px</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-5 w-5 text-foreground" />
              <span className="text-xs text-muted-foreground">20px</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-6 w-6 text-foreground" />
              <span className="text-xs text-muted-foreground">24px</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-8 w-8 text-foreground" />
              <span className="text-xs text-muted-foreground">32px</span>
            </div>
          </div>
        </div>

        {/* Icon States */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">ICON STATES</h4>
          <div className="flex items-center space-x-8 p-4 bg-card border border-border rounded-[var(--radius-md)]">
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-5 w-5 text-foreground" />
              <span className="text-xs text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Muted</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Home className="h-5 w-5 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
