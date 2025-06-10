import { Metadata } from 'next';
import { getPayload } from '@/lib/payload';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Nyika Safaris',
  description: 'Nyika Safaris Admin Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is admin
  const payload = await getPayload();
  const userDoc = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: user?.email,
      },
    },
  });

  const isAdmin = userDoc.docs[0]?.role === 'admin';

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="flex">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
