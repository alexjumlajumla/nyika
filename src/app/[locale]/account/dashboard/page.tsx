'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading && !user) {
      const currentPath = window.location.pathname;
      const locale = currentPath.split('/')[1] || 'en';
      window.location.href = `/${locale}/auth/signin?redirectedFrom=/account/dashboard`;
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, {user.email?.split('@')[0] || 'User'}!</h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Bookings</h3>
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
            <p className="text-gray-500">No upcoming bookings</p>
          </div>
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800">
            View all bookings →
          </button>
        </div>

        {/* Saved Tours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Tours</h3>
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded">
            <p className="text-gray-500">No saved tours</p>
          </div>
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800">
            Browse tours →
          </button>
        </div>

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">
                {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800">
            Update profile →
          </button>
        </div>
      </div>
    </div>
  );
}
