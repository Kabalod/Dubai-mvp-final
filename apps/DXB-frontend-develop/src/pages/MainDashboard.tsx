import React, { useState, useEffect } from 'react';
import { RealEstateDashboard } from '../components/real-estate-dashboard';
import { api, type PropertyStats, type Property } from '../utils/api';

const MainDashboard: React.FC = () => {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ ИСПРАВЛЕНО: используем apiService вместо api
        const [statsResponse, propertiesResponse] = await Promise.all([
          fetch('/api/stats/').then(r => r.json()), // временное решение для stats
          apiService.getProperties({ limit: 20 })
        ]);
        
        setStats(statsResponse);
        setProperties(propertiesResponse.results);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform API data to component props
  const dashboardProps = {
    stats: stats ? {
      totalProperties: stats.total_properties,
      totalBuildings: stats.total_buildings,
      totalDeals: stats.total_deals,
      averagePrice: stats.average_price,
      medianPrice: stats.median_price,
      avgPricePerSqm: stats.avg_price_per_sqm,
      priceRange: stats.price_range,
      marketVolume: stats.market_volume,
      liquidity: stats.liquidity,
      roi: stats.roi,
    } : null,
    properties: properties.map(property => ({
      id: property.id,
      title: property.title,
      price: property.price,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqm: property.sqm,
      location: property.location,
      images: property.images || [],
      listingType: property.listing_type,
    })),
  };

  return <RealEstateDashboard {...dashboardProps} />;
};

export default MainDashboard;