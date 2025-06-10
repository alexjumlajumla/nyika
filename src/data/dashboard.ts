import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type DashboardStats = {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  totalTours: number;
  trends: {
    bookings: string;
    revenue: string;
    users: string;
    tours: string;
  };
};

export type BookingWithRelations = Booking & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'> | null;
  accommodations: { name: string; image_url: string } | null;
};

export type RevenueData = Array<{ date: string; revenue: number }>;

export async function getDashboardStats() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's role from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Common where clause for queries
    const whereClause = profile.role === 'admin' ? {} : { user_id: user.id };

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .match(whereClause);

    // Get total revenue (only for bookings with paid status)
    const { data: revenueData, error: revenueError } = await supabase
      .rpc('get_total_revenue', {
        p_user_id: profile.role === 'admin' ? null : user.id,
        p_status: 'paid'
      });

    if (revenueError) throw revenueError;

    // Get active users (users with bookings in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: activeUsers } = await supabase
      .from('bookings')
      .select('user_id', { count: 'exact', head: true, distinct: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .match(profile.role === 'admin' ? {} : { user_id: user.id });

    // Get total tours (assuming we have a tours table)
    const { count: totalTours } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true });

    // Calculate trends (simplified - in a real app, you'd compare with previous period)
    const trends = {
      bookings: '12% from last month',
      revenue: '19% from last month',
      users: '5% from last month',
      tours: '2 new this month',
    };

    return {
      totalBookings: totalBookings || 0,
      totalRevenue: revenueData?.[0]?.total || 0,
      activeUsers: activeUsers || 0,
      totalTours: totalTours || 0,
      trends,
    };
  } catch (error) {
    // Log error to your error tracking service in production
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function getRecentBookings(limit = 5): Promise<BookingWithRelations[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Common where clause for queries
    const whereClause = profile?.role === 'admin' ? {} : { user_id: user.id };

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        accommodations:accommodation_id (name, image_url)
      `)
      .match(whereClause)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Cast to our defined type with relations
    return (bookings || []) as BookingWithRelations[];
  } catch (error) {
    // Log error to your error tracking service in production
    console.error('Error fetching recent bookings:', error);
    throw error;
  }
}

export async function getRevenueData(days = 30): Promise<Array<{
  date: string;
  revenue: number;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Call a PostgreSQL function to get revenue data
    const { data, error } = await supabase.rpc('get_revenue_by_date_range', {
      p_days: days,
      p_user_id: profile?.role === 'admin' ? null : user.id,
    });

    if (error) throw error;

    return data as Array<{
      date: string;
      revenue: number;
    }>;
  } catch (error) {
    // Log error to your error tracking service in production
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}
