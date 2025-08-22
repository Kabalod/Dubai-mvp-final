import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsSegmented() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tabs & Segmented Control</h3>

        {/* Standard Tabs */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">TABS</h4>
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary rounded-[var(--radius-md)]">
              <TabsTrigger
                value="sales"
                className="rounded-[var(--radius-sm)] data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger
                value="rental"
                className="rounded-[var(--radius-sm)] data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Rental
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="mt-4">
              <div className="p-4 bg-card rounded-[var(--radius-md)] border border-border">
                <p className="text-sm text-muted-foreground">Sales content goes here</p>
              </div>
            </TabsContent>
            <TabsContent value="rental" className="mt-4">
              <div className="p-4 bg-card rounded-[var(--radius-md)] border border-border">
                <p className="text-sm text-muted-foreground">Rental content goes here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Segmented Control */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">SEGMENTED CONTROL</h4>
          <div className="inline-flex bg-secondary rounded-[var(--radius-md)] p-1">
            <button className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-background text-foreground shadow-sm">
              Default
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground">
              Hover
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-muted-foreground/50 cursor-not-allowed">
              Disabled
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-4 mt-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">NAVIGATION TABS</h4>
          <div className="flex space-x-8 border-b border-border">
            <button className="pb-2 text-sm font-medium text-primary border-b-2 border-primary">Active</button>
            <button className="pb-2 text-sm font-medium text-muted-foreground hover:text-foreground">Inactive</button>
            <button className="pb-2 text-sm font-medium text-muted-foreground hover:text-foreground">Another</button>
          </div>
        </div>
      </div>
    </div>
  )
}
