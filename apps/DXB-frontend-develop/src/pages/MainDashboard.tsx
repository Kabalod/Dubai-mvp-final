import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { api, Property, PropertyStats, Area, PropertyFilters } from '../utils/api';
import styles from './MainDashboard.module.scss';

// Format numbers for display
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).replace('AED', '').trim() + ' AED';
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-AE').format(num);
};

const MainDashboard: React.FC = () => {
  // State for data
  const [properties, setProperties] = useState<Property[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for filters
  const [activeDataSource, setActiveDataSource] = useState<'dld' | 'marketplace'>('dld');
  const [propertyType, setPropertyType] = useState<'all' | 'apartments' | 'villas' | 'land' | 'commercial'>('all');
  const [searchValue, setSearchValue] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState('1week');
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [propertyType, searchValue, bedroomsFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const filters: PropertyFilters = {
        limit: 12,
        offset: 0,
      };
      
      if (propertyType !== 'all') {
        filters.property_type = propertyType;
      }
      
      if (searchValue.trim()) {
        filters.search = searchValue.trim();
      }
      
      if (bedroomsFilter) {
        filters.bedrooms = parseInt(bedroomsFilter);
      }
      
      const [propertiesRes, areasRes, statsRes] = await Promise.all([
        api.getProperties(filters),
        api.getAreas(),
        api.getStats(),
      ]);
      
      setProperties(propertiesRes.results);
      setAreas(areasRes);
      setStats(statsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  // Render property card component
  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="rounded-[var(--radius-md)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{property.title || property.location.building}</CardTitle>
            <CardDescription>{property.location.area}</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            •••
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {property.bedrooms} Beds, {property.sqm} m²
            </span>
            <Badge variant="secondary" className="rounded-[var(--radius-sm)]">
              {property.property_type}
            </Badge>
          </div>
          <div className="text-2xl font-bold">{formatPrice(property.price)}</div>
          {property.location.floor && (
            <div className="text-sm text-muted-foreground">Floor No. {property.location.floor}</div>
          )}
        </div>
      </CardContent>
      <div className="flex justify-between p-6 pt-0">
        <Button variant="outline" className="rounded-[var(--radius-md)] bg-transparent">
          Details
        </Button>
        <Button className="rounded-[var(--radius-md)]">Contact Agent</Button>
      </div>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Data Source Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-[var(--radius-md)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">DLD</CardTitle>
                <CardDescription>Analyse all real transactions data obtained from Dubai Land Department</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'apartments', 'villas', 'land', 'commercial'] as const).map((type) => (
                <Button
                  key={type}
                  variant={propertyType === type ? 'default' : 'ghost'}
                  onClick={() => setPropertyType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[var(--radius-md)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Marketplace</CardTitle>
                <CardDescription>Analyse data received from real estate sales marketplaces</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button variant="ghost" className="capitalize">All</Button>
              <Button variant="ghost" className="capitalize">Apartments</Button>
              <Button variant="ghost" className="capitalize">Villas</Button>
              <Button variant="ghost" className="capitalize">Land</Button>
              <Button variant="ghost" className="capitalize">Commercial</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        DLD → {propertyType === 'all' ? 'All Properties' : propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
      </div>

      {/* Filters Bar */}
      <div className="flex gap-3 items-center p-4 bg-white rounded-xl shadow">
        <div className="flex-1">
          <Input
            placeholder="Search by area, project or building"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        <select 
          value={bedroomsFilter} 
          onChange={(e) => setBedroomsFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Beds</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds</option>
          <option value="3">3 Beds</option>
          <option value="4">4 Beds</option>
          <option value="5">5+ Beds</option>
        </select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Time Filter */}
      <div className="flex items-center gap-4">
        <span className="font-medium">YTD</span>
        <div className="flex gap-2">
          {(['1week', '1month', '3month', '6month', '1year', '3years'] as const).map((period) => (
            <Button
              key={period}
              variant={timeFilter === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeFilter(period)}
            >
              {period.replace(/(\d+)/, '$1 ').replace('week', 'Week').replace('month', 'Month').replace('year', 'Year')}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">Loading...</div>
      )}

      {!loading && stats && (
        <>
          {/* Overview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Buildings</div>
                <div className="mt-3 text-2xl font-semibold">
                  {formatNumber(stats.total_buildings)} 
                  <span className="text-green-600 text-sm align-top ml-2">+2.6%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs 12/2023 in Dubai</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Properties</div>
                <div className="mt-3 text-2xl font-semibold">
                  {formatNumber(stats.total_properties)} 
                  <span className="text-green-600 text-sm align-top ml-2">+5.2%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs 12/2023 in Dubai</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Deals</div>
                <div className="mt-3 text-2xl font-semibold">
                  {formatNumber(stats.total_deals)} 
                  <span className="text-green-600 text-sm align-top ml-2">+12.8%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">vs 12/2023 in Dubai</div>
              </Card>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Metrics */}
            <Card title="Price" className="rounded-[var(--radius-md)]">
              <CardHeader>
                <CardTitle>Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Average price</div>
                    <div className="text-xl font-bold">{formatPrice(stats.average_price)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.6%</span> vs Dubai avg
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Median price</div>
                    <div className="text-xl font-bold">{formatPrice(stats.median_price)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.8%</span> vs Dubai median
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Price per sqm</div>
                    <div className="text-xl font-bold">{formatPrice(stats.avg_price_per_sqm)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.6%</span> vs Dubai avg
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Price range</div>
                    <div className="text-lg font-bold">
                      {formatPrice(stats.price_range.min)} - {formatPrice(stats.price_range.max)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Volume */}
            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <CardTitle>Market Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Deals</div>
                    <div className="text-xl font-bold">{formatNumber(stats.market_volume.deals)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.6%</span> vs last period
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Deal Volume</div>
                    <div className="text-xl font-bold">{formatPrice(stats.market_volume.total_volume)}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.8%</span> vs last period
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Metrics */}
            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <CardTitle>Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Deals to total properties ratio</div>
                <div className="text-3xl font-bold">{stats.liquidity.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.6%</span> vs last period
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[var(--radius-md)]">
              <CardHeader>
                <CardTitle>ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Average ROI</div>
                <div className="text-3xl font-bold">{stats.roi.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.8%</span> vs last period
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Properties</h3>
            <div className="text-sm text-muted-foreground">
              {properties.length} results
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" onClick={() => {}}>
              Load More Properties
            </Button>
          </div>
        </div>
      )}

      {!loading && properties.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No properties found matching your criteria
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
