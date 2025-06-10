'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname;
      const locale = currentPath.split('/')[1] || 'en';
      router.push(`/${locale}/auth/signin`);
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Mock upcoming bookings data
  const upcomingBookings = [
    {
      id: '1',
      tour: 'Serengeti Migration Safari',
      date: '2023-11-15',
      duration: '7 days',
      status: 'confirmed',
    },
    {
      id: '2',
      tour: 'Mount Kilimanjaro Trek',
      date: '2024-02-20',
      duration: '8 days',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your bookings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <span className="text-sm font-medium">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,850</div>
            <p className="text-xs text-muted-foreground">+$2,500 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Tanzania, Kenya, Rwanda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days of Adventure</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{booking.tour}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.duration}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="w-full justify-start">
                Book a New Tour
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View All Bookings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
