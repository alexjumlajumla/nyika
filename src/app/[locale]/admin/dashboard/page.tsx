'use client';

import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // If still loading, do nothing
    if (isLoading) return;
    
    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1] || 'en';
    
    // If no user, redirect to sign in
    if (!user) {
      window.location.href = `/${locale}/auth/signin?redirectedFrom=${encodeURIComponent(currentPath)}`;
      return;
    }
    
    // If user is not admin, redirect to user dashboard
    if (!user.email?.endsWith('@nyika.co.tz')) {
      window.location.href = `/${locale}/account/dashboard`;
      return;
    }
    
    // If we get here, user is an admin and can view this page
  }, [user, isLoading]);

  // Show loading state while checking auth
  if (isLoading || !user || !user.email?.endsWith('@nyika.co.tz')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">Loading...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Tours</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">Loading...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Bookings</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}
