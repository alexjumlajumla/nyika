import { Metadata } from 'next';
import { getPayload } from '@/lib/payload';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mountain, Hotel, Map, Calendar, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Nyika Safaris Admin',
  description: 'Nyika Safaris Admin Dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const payload = await getPayload();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is admin
  const userDoc = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: session.user?.email,
      },
    },
  });

  const isAdmin = userDoc.docs[0]?.role === 'admin';

  if (!isAdmin) {
    redirect('/');
  }

  // Fetch stats
  const [tours, accommodations, attractions, bookings, users] = await Promise.all([
    payload.find({ collection: 'tours' }),
    payload.find({ collection: 'accommodations' }),
    payload.find({ collection: 'attractions' }),
    payload.find({ collection: 'bookings' }),
    payload.find({ collection: 'users' }),
  ]);

  const stats = [
    {
      title: 'Tours',
      value: tours.totalDocs,
      icon: Mountain,
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Accommodations',
      value: accommodations.totalDocs,
      icon: Hotel,
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Attractions',
      value: attractions.totalDocs,
      icon: Map,
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Bookings',
      value: bookings.totalDocs,
      icon: Calendar,
      change: '+20%',
      changeType: 'increase',
    },
    {
      title: 'Users',
      value: users.totalDocs,
      icon: Users,
      change: '+15%',
      changeType: 'increase',
    },
  ];

  // Recent bookings
  const recentBookings = await payload.find({
    collection: 'bookings',
    limit: 5,
    sort: '-createdAt',
    populate: ['user', 'tour'],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user?.name || 'Admin'}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.docs.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">
                    {booking.user?.name || 'Guest'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.tour?.title || 'Tour'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${booking.totalPrice?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
