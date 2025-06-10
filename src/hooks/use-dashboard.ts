'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats, getRecentBookings, getRevenueData } from '@/data/dashboard';

// Type definitions
interface TrendData {
  bookings: string;
  revenue: string;
  users: string;
  tours: string;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  totalTours: number;
  trends: TrendData;
}

import type { BookingWithRelations as DashboardBookingWithRelations } from '@/data/dashboard';

type BookingWithRelations = DashboardBookingWithRelations;

export type RevenueData = Array<{ date: string; revenue: number }>;

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalTours: 0,
    trends: {
      bookings: '',
      revenue: '',
      users: '',
      tours: '',
    },
  });
  
  const [recentBookings, setRecentBookings] = useState<BookingWithRelations[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Format currency helper function
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsData, bookingsData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRecentBookings(),
        getRevenueData(30), // Last 30 days
      ]);

      setStats({
        totalBookings: statsData.totalBookings,
        totalRevenue: statsData.totalRevenue,
        activeUsers: statsData.activeUsers,
        totalTours: statsData.totalTours,
        trends: statsData.trends,
      });

      setRecentBookings(bookingsData);
      setRevenueData(revenueData);
      setError(null);
    } catch (err) {
      // Log error to your error tracking service in production
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  const refreshData = useCallback(async () => {
    try {
      await fetchDashboardData();
    } catch {
      // Error is already handled in fetchDashboardData
      // In a production environment, you might want to log this to an error tracking service
    }
  }, [fetchDashboardData]);

  return {
    stats,
    recentBookings,
    revenueData,
    loading,
    error,
    refreshData,
    formatCurrency,
  };
}

export default useDashboard;
