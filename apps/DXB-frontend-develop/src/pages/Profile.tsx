import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import apiService from '@/services/apiService';

const Profile: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await apiService.getProfile();
        setData(resp || null);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'premium': return 'default';
      case 'free': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No profile data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Badge variant={getRoleColor(data.role)} className="text-sm px-3 py-1">
          {data.role?.toUpperCase() || 'USER'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {(data.first_name?.[0] || data.username?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {data.first_name && data.last_name 
                    ? `${data.first_name} ${data.last_name}` 
                    : data.username}
                </CardTitle>
                <CardDescription>{data.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-sm">{data.username}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{data.email}</p>
              </div>
              {data.first_name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <p className="text-sm">{data.first_name}</p>
                </div>
              )}
              {data.last_name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <p className="text-sm">{data.last_name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant={getRoleColor(data.role)} className="w-full justify-center py-2">
                {data.role?.toUpperCase() || 'USER'} ACCOUNT
              </Badge>
            </div>
            
            {data.role === 'free' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Upgrade to unlock premium features
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/payment'}>
                  Upgrade to Premium
                </Button>
              </div>
            )}
            
            {data.role === 'premium' && (
              <div className="space-y-3">
                <p className="text-sm text-center text-green-600">
                  ✅ Premium features active
                </p>
                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </div>
            )}
            
            {data.role === 'admin' && (
              <div className="space-y-3">
                <p className="text-sm text-center text-blue-600">
                  🛡️ Administrator privileges
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/admin', '_blank')}
                >
                  Open Admin Panel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              📊 Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/analytics'}>
              📈 Analytics
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/payment'}>
              💳 Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;


