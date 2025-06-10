'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useDashboard } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Loader2, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  Users, 
  Package, 
  User,
} from 'lucide-react';

function StatCard({ title, value, icon: Icon, loading }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}) {
  const { formatCurrency } = useDashboard();
  // Format function is not used since we're formatting in the component
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof value === 'number' && title.includes('Revenue') ? formatCurrency(value) : value}
            </div>

          </>
        )}
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data, loading, formatCurrency }: { 
  data: Array<{ date: string; revenue: number }>; 
  loading: boolean;
  formatCurrency: (amount: number) => string;
}) {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
        <p>No revenue data available</p>
        <p className="text-sm">Revenue data will appear here when available</p>
      </div>
    );
  }

  // Simple chart implementation - in a real app, you might want to use a charting library
  const maxRevenue = Math.max(...data.map(d => d.revenue), 0);
  
  return (
    <div className="h-[300px] flex items-end gap-2 pt-4">
      {data.map((item, i) => {
        const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-primary/50 rounded-t-sm hover:bg-primary/70 transition-colors"
              style={{ height: `${height}%` }}
              title={`${formatCurrency(item.revenue)} on ${format(new Date(item.date), 'MMM d')}`}
            />
            <span className="text-xs text-muted-foreground mt-1">
              {format(new Date(item.date), 'MMM d')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { stats, recentBookings, revenueData, loading, error, formatCurrency, refreshData } = useDashboard();

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[125px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={refreshData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Bookings', 
      value: stats?.totalBookings ?? 0, 
      icon: Calendar, 
      trend: stats?.trends?.bookings ?? '0%',
      format: (val: number) => val.toLocaleString()
    },
    { 
      title: 'Total Revenue', 
      value: stats?.totalRevenue ?? 0, 
      icon: DollarSign, 
      trend: stats?.trends?.revenue ?? '0%',
      format: formatCurrency
    },
    { 
      title: 'Active Users', 
      value: stats?.activeUsers ?? 0, 
      icon: Users, 
      trend: stats?.trends?.users ?? '0%',
      format: (val: number) => val.toLocaleString()
    },
    { 
      title: 'Tours', 
      value: stats?.totalTours ?? 0, 
      icon: Package, 
      trend: stats?.trends?.tours ?? '0%',
      format: (val: number) => val.toLocaleString()
    },
  ] as const;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          onClick={refreshData} 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {loading ? 'Refreshing...' : 'Refresh'}
          </span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={revenueData} loading={loading} formatCurrency={formatCurrency} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.accommodations?.name || 'Accommodation'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.check_in), 'MMM d, yyyy')} - {format(new Date(booking.check_out), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {formatCurrency(booking.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No recent bookings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  New bookings will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
