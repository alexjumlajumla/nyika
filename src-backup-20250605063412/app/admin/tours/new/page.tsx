import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { TourForm } from '@/components/admin/TourForm';
import { getPayload } from '@/lib/payload';

export const metadata: Metadata = {
  title: 'Create New Tour | Nyika Safaris Admin',
  description: 'Create a new tour for Nyika Safaris',
};

export default async function NewTourPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?redirect=/admin/tours/new');
  }

  // Check if user is admin
  const payload = await getPayload();
  const user = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: session.user?.email,
      },
    },
  });

  const isAdmin = user.docs[0]?.role === 'admin';

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Tour</h1>
        <p className="text-muted-foreground">
          Add a new tour to the Nyika Safaris collection
        </p>
      </div>
      
      <div className="rounded-md border p-6">
        <TourForm />
      </div>
    </div>
  );
}
