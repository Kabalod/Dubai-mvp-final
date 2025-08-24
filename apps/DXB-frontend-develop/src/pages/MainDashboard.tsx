import React from 'react';

const MainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Temporary simple version - will add RealEstateDashboard later */}
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">DLD</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">Apartments</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-900 border-b-2 border-blue-500 rounded-none pb-2">
            Sales
          </button>
          <button className="text-gray-500 hover:text-gray-900">
            Rental
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <input 
              placeholder="Search by area, project or building" 
              className="pl-10 pr-10 bg-gray-100 border-0 w-full p-3 rounded-lg" 
            />
          </div>
          <button className="bg-gray-100 border-0 px-4 py-2 rounded-lg">
            3 Beds
          </button>
          <button className="bg-gray-100 border-0 px-4 py-2 rounded-lg">
            More
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
            SEARCH
          </button>
        </div>

        {/* Overview Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Overview</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">13</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Buildings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Apartments</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold">3000</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  +12.5%
                </span>
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Deals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;