import React from "react";
import { Building2, ChevronDown, User } from "lucide-react";

interface FixedApplicationHeaderProps {
  activeRoute?: string;
}

export function FixedApplicationHeader({ activeRoute = "Main" }: FixedApplicationHeaderProps) {
  const navigationItems = ["Main", "Analytics", "Reports", "Payments", "Pricing"];

  const getRoute = (navItem: string) => {
    switch (navItem) {
      case 'Main': return '/';
      case 'Analytics': return '/analytics';
      case 'Reports': return '/reports';
      case 'Payments': return '/payment';
      case 'Pricing': return '/pricing';
      default: return '/';
    }
  };

  const handleNavClick = (item: string) => {
    window.location.href = getRoute(item);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">Dubai MVP</span>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeRoute === item 
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right: User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">john.doe@example.com</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                PREMIUM
              </span>
            </div>

            {/* Simple User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                <div className="py-1">
                  <button
                    onClick={() => window.location.href = '/profile'}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => window.location.href = '/payment'}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Billing
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
