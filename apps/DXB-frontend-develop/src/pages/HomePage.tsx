import React, { useState, useEffect } from 'react';
import { ApplicationHeader } from '../components/application-header';
import { DataSourceSelector } from '../components/data-source-selector';
import { RealEstateDashboard } from '../components/real-estate-dashboard';
import { api, type PropertyStats, type Property } from '../utils/api';

const HomePage: React.FC = () => {
  const [activeSource, setActiveSource] = useState<string>("DLD");
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats and properties in parallel
        const [statsResponse, propertiesResponse] = await Promise.all([
          api.getStats(),
          api.getProperties({ limit: 20 })
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
  }, [activeSource]); // Reload data when source changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ApplicationHeader activeRoute="Main" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ApplicationHeader activeRoute="Main" />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ApplicationHeader activeRoute="Main" />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Data Source Selector */}
        <div className="mb-8">
          <DataSourceSelector 
            activeSource={activeSource}
            onSourceChange={setActiveSource}
          />
        </div>
        
        {/* Dashboard with Reports */}
        <RealEstateDashboard 
          stats={stats}
          properties={properties}
        />
      </div>
    </div>
  );
};

export default HomePage;
