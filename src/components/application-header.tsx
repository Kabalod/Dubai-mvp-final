import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Building2, ChevronDown, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { apiService } from "@/services/apiService"
import { useAuth } from "@/contexts/AuthContext"

interface ApplicationHeaderProps {
  activeRoute?: string
}

export function ApplicationHeader({ activeRoute = "Main" }: ApplicationHeaderProps) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const navigationItems = ["Main", "Analytics", "Reports", "Pricing"]

  // DEBUG: Log user state
  console.log('👤 Header render - User:', user)
  console.log('🔐 Header render - IsAuthenticated:', isAuthenticated)

  const handleLogout = () => {
    apiService.clearAuth();
    navigate('/auth');
    window.location.reload(); // Принудительная перезагрузка для очистки состояния
  }

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">Dubai MVP</span>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
                                  const getRoute = (navItem: string) => {
                        switch (navItem) {
                            case 'Main': return '/';
                            case 'Analytics': return '/analytics';
                            case 'Reports': return '/reports';
                            case 'Pricing': return '/pricing';
                            default: return '/';
                        }
                    };
              
              return (
                <Button
                  key={item}
                  variant="ghost"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeRoute === item ? "text-blue-600 border-b-2 border-blue-600 rounded-none pb-1" : "text-gray-600"
                  }`}
                  onClick={() => navigate(getRoute(item))}
                >
                  {item}
                </Button>
              );
            })}
          </nav>

                            {/* Right: User Profile or Auth Buttons */}
                  <div className="flex items-center space-x-4">
                    {user ? (
                      // Авторизованный пользователь
                      <>
                        <div className="hidden md:flex flex-col items-end">
                          <span className="text-sm font-medium text-gray-900">
                            {user.email}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {user.subscription_type?.toUpperCase() || 'FREE'} MEMBER
                          </Badge>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center space-x-2 p-2 border-2 border-green-500"
                              onClick={() => console.log('🎯 Dropdown trigger clicked!')}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || "/placeholder.svg?height=32&width=32"} />
                                <AvatarFallback>
                                  {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 border-4 border-purple-500 bg-pink-100"
                            onOpenAutoFocus={() => console.log('📂 Dropdown content opened!')}
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('🖱️ Profile button clicked!');
                                console.log('🔗 Navigating to /profile...');
                                navigate('/profile');
                              }}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              <span className="flex flex-col">
                                <span>Profile Settings</span>
                                <span className="text-xs text-gray-500">View current plan & settings</span>
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/payment')}>
                              <span className="flex flex-col">
                                <span>Billing</span>
                                <span className="text-xs text-gray-500">Manage subscription & payments</span>
                              </span>
                            </DropdownMenuItem>

                            {/* Debug button for testing */}
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('🐛 Debug button clicked!');
                                navigate('/debug');
                              }}
                              className="cursor-pointer hover:bg-yellow-100"
                            >
                              <span className="flex flex-col">
                                <span>🔧 Debug</span>
                                <span className="text-xs text-gray-500">Test navigation & environment</span>
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                              <LogOut className="h-4 w-4 mr-2" />
                              <span className="flex flex-col">
                                <span>Logout</span>
                                <span className="text-xs text-red-400">Switch user account</span>
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      // Неавторизованный пользователь - показываем кнопки входа
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => navigate('/auth')}
                          className="text-sm font-medium text-gray-600 hover:text-blue-600"
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => navigate('/auth?tab=register')}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2"
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </div>
        </div>
      </div>
    </header>
  )
}
