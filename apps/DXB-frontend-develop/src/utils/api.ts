// API client for Dubai MVP
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://workerproject-production.up.railway.app/api'
  : 'http://localhost:8000/api';

// Types
export interface Property {
  id: string;
  listing_id: string;
  title: string;
  description: string;
  property_type: string;
  price: number;
  area: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  location: {
    area: string;
    building: string;
    floor?: string;
  };
  images?: string[];
  listing_type: 'sale' | 'rent';
  created_at: string;
}

export interface Area {
  id: number;
  name: string;
  name_en: string;
  properties_count: number;
}

export interface PropertyStats {
  total_properties: number;
  total_buildings: number;
  total_deals: number;
  average_price: number;
  median_price: number;
  avg_price_per_sqm: number;
  price_range: {
    min: number;
    max: number;
  };
  market_volume: {
    deals: number;
    total_volume: number;
  };
  liquidity: number;
  roi: number;
}

export interface PropertyFilters {
  search?: string;
  property_type?: string;
  bedrooms?: number;
  area?: string;
  min_price?: number;
  max_price?: number;
  listing_type?: 'sale' | 'rent';
  limit?: number;
  offset?: number;
}

// API functions
export const api = {
  // Properties API
  async getProperties(filters: PropertyFilters = {}): Promise<{ results: Property[], count: number }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/properties/?${params}`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async getPropertyDetail(listingId: string): Promise<Property> {
    const response = await fetch(`${API_BASE_URL}/properties/${listingId}/`);
    if (!response.ok) throw new Error('Failed to fetch property detail');
    return response.json();
  },

  // Areas API
  async getAreas(): Promise<Area[]> {
    const response = await fetch(`${API_BASE_URL}/areas/`);
    if (!response.ok) throw new Error('Failed to fetch areas');
    return response.json();
  },

  // Stats API
  async getStats(): Promise<PropertyStats> {
    const response = await fetch(`${API_BASE_URL}/stats/`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health/`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }
};
