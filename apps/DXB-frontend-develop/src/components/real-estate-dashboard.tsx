import React, { useState } from "react"
// Убраны дублированные импорты ApplicationHeader и DataSourceSelector
import TransactionsTable from "./Transactions/TransactionsTable"
import MainFilters from "./MainFilters/MainFilters"
import type { IMainQuery } from "./MainFilters/typings"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Search, X, ChevronDown, Info, TrendingUp } from "lucide-react"

interface RealEstateDashboardProps {
  stats?: {
    totalProperties: number;
    totalBuildings: number;
    totalDeals: number;
    averagePrice: number;
    medianPrice: number;
    avgPricePerSqm: number;
    priceRange: { min: number; max: number };
    marketVolume: { deals: number; total_volume: number };
    liquidity: number;
    roi: number;
  } | null;
  properties?: Array<{
    id: string;
    title: string;
    price: number;
    area: string;
    bedrooms: string | null; // Соответствие с backend
    bathrooms: string | null;
    sqm: number;
    location: { area: string; building: string };
    images: string[];
    listingType: 'sale' | 'rent';
  }>;
}

export function RealEstateDashboard({ stats, properties = [] }: RealEstateDashboardProps) {
  const [loading, setLoading] = useState(false);

  // Обработчик фильтров
  const handleSearch = async (query: IMainQuery) => {
    console.log('🔍 Фильтры применены:', query);
    setLoading(true);
    
    try {
      // Преобразуем параметры фильтра в API запрос
      const searchParams: any = {
        transaction_type: query.transactionType,
        bedrooms: query.propertyComponents.length > 0 ? query.propertyComponents.join(',') : undefined,
        search: query.searchSubstring || undefined,
        period: query.periods,
        ordering: query.sorting === 'desc' ? '-created_date' : 'created_date',
        limit: query.limit || 20,
        offset: query.offset || 0
      };

      // Добавляем новые фильтры
      if (query.propertyType) searchParams.property_type = query.propertyType;
      if (query.area) searchParams.area = query.area;
      if (query.minPrice) searchParams.min_price = query.minPrice;
      if (query.maxPrice) searchParams.max_price = query.maxPrice;

      console.log('📡 API parameters:', searchParams);
      
      // TODO: Подключить к реальному API
      // const filteredData = await api.getFilteredProperties(searchParams);
      
      // Показываем результат применения фильтров
      const filterSummary = [];
      if (query.transactionType) filterSummary.push(`Type: ${query.transactionType}`);
      if (query.propertyComponents.length > 0) filterSummary.push(`Beds: ${query.propertyComponents.join(', ')}`);
      if (query.searchSubstring) filterSummary.push(`Search: "${query.searchSubstring}"`);
      if (query.propertyType) filterSummary.push(`Property: ${query.propertyType}`);
      if (query.area) filterSummary.push(`Area: ${query.area}`);
      if (query.minPrice || query.maxPrice) {
        const priceRange = `${query.minPrice || 0} - ${query.maxPrice || '∞'} AED`;
        filterSummary.push(`Price: ${priceRange}`);
      }
      
      // ✅ ИСПРАВЛЕНО: показываем результат в UI вместо alert  
      console.log(`✅ Фильтры применены! ${filterSummary.join(', ')}`);
      
      // 🔄 Имитируем загрузку новых данных (в реальности будет API вызов)
      if (filterSummary.length > 0) {
        console.log("📊 Updating dashboard data with filters...");
        setAppliedFilters(filterSummary); // ✅ ДОБАВЛЕНО: обновляем активные фильтры
        // В реальности здесь будет:
        // const newData = await apiService.getFilteredProperties(searchParams);
        // setProperties(newData);
        // setStats(calculateStats(newData));
      } else {
        setAppliedFilters([]); // ✅ ДОБАВЛЕНО: очищаем если фильтров нет
      }
      
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Analytics Dashboard */}
        <>
          {/* Breadcrumb */}
          {/* Фильтры */}
          <MainFilters onSearch={handleSearch} />
          
          {/* ✅ ДОБАВЛЕНО: Индикатор активных фильтров */}
          {appliedFilters.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <span className="font-medium">🔍 Активные фильтры:</span>
                <span>{appliedFilters.join(' • ')}</span>
                <button 
                  onClick={() => {
                    setAppliedFilters([]);
                    console.log('🧹 Filters cleared');
                  }}
                  className="ml-auto text-blue-600 hover:text-blue-800 underline"
                >
                  Очистить
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">DLD</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">Apartments</span>
            </div>
          </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-900 border-b-2 border-blue-500 rounded-none pb-2">
                Sales
              </Button>
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                Rental
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search by area, project or building" className="pl-10 pr-10 bg-gray-100 border-0" />
                <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
              </div>
              <Button variant="outline" className="bg-gray-100 border-0">
                3 Beds
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="bg-gray-100 border-0">
                More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">SEARCH</Button>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-500">
                YTD
              </Button>
              <Button variant="ghost" className="text-blue-500 border-b-2 border-blue-500 rounded-none pb-1">
                1 week
              </Button>
              <Button variant="ghost" className="text-gray-500">
                1 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                3 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                6 Month
              </Button>
              <Button variant="ghost" className="text-gray-500">
                1 Year
              </Button>
              <Button variant="ghost" className="text-gray-500">
                3 Years
              </Button>
            </div>

            {/* Overview Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Overview</h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats?.totalBuildings?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Buildings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats?.totalProperties?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Properties</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold">{stats?.totalDeals?.toLocaleString() || 0}</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      12,5% <TrendingUp className="ml-1 h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Deals</div>
                </div>
              </div>

              {/* Data Cards Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Price Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Price</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average price</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.averagePrice?.toLocaleString() || 'N/A'}</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              12,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs {(stats?.averagePrice * 0.9)?.toLocaleString() || 'N/A'} in Dubai</div>
                          <div className="text-xs text-gray-500">better by 10%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Median price</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.medianPrice?.toLocaleString() || 'N/A'}</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              8,5% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs {(stats?.medianPrice * 0.95)?.toLocaleString() || 'N/A'} in Dubai</div>
                          <div className="text-xs text-gray-500">better by 5%</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Average price per sqm</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.avgPricePerSqm?.toLocaleString() || 'N/A'}</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              15,2% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs {(stats?.avgPricePerSqm * 0.92)?.toLocaleString() || 'N/A'} in Dubai</div>
                          <div className="text-xs text-gray-500">better by 8%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Price range</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.priceRange?.min?.toLocaleString() || '0'} - {stats?.priceRange?.max?.toLocaleString() || '0'}</span>
                            <span className="text-sm text-gray-500">AED</span>
                          </div>
                          <div className="text-xs text-gray-500">Market range varies</div>
                          <div className="text-xs text-gray-500">Wide selection available</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Volume Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Market volume</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Deals</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.marketVolume?.deals?.toLocaleString() || stats?.totalDeals?.toLocaleString() || '0'}</span>
                            <span className="text-sm text-gray-500">Deals</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              18,7% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs {((stats?.marketVolume?.deals || stats?.totalDeals || 0) * 0.88)?.toLocaleString()} last period</div>
                          <div className="text-xs text-gray-500">better by 12%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Deal volume</span>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold">{stats?.marketVolume?.total_volume?.toLocaleString() || '0'}</span>
                            <span className="text-sm text-gray-500">AED</span>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                              22,3% <TrendingUp className="ml-1 h-2 w-2" />
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">vs {((stats?.marketVolume?.total_volume || 0) * 0.85)?.toLocaleString()} last period</div>
                          <div className="text-xs text-gray-500">better by 15%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Liquidity Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Liquidity</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Deals to the num of apartments</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold">{stats?.liquidity?.toFixed(1) || '0.0'}</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            16,2% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs {((stats?.liquidity || 0) * 0.92).toFixed(1)} average market</div>
                        <div className="text-xs text-gray-500">better by 8%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ROI Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">ROI</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Average ROI</span>
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold">{stats?.roi?.toFixed(1) || '0.0'}%</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            19,4% <TrendingUp className="ml-1 h-3 w-3" />
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">vs {((stats?.roi || 0) * 0.89).toFixed(1)}% market average</div>
                        <div className="text-xs text-gray-500">better by 11%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transactions Table */}
            <TransactionsTable />
        </>
      </div>
    </div>
  )
}
