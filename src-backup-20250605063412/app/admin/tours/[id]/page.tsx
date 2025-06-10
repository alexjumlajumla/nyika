import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { TourForm } from '@/components/admin/TourForm';
import { getPayload } from '@/lib/payload';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Edit Tour | Nyika Safaris Admin`,
    description: 'Edit tour details for Nyika Safaris',
  };
}

export default async function EditTourPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?redirect=/admin/tours/${params.id}`);
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

  // Fetch the tour
  let tour;
  try {
    const result = await payload.findByID({
      collection: 'tours',
      id: params.id,
      depth: 1,
    });
    tour = result;
  } catch (error) {
    console.error('Error fetching tour:', error);
    notFound();
  }

  if (!tour) {
    notFound();
  }

  // Transform the tour data to match the form shape if needed
  const initialData = {
    ...tour,
    // Ensure arrays are always arrays and have at least one item
    highlights: tour.highlights?.length ? tour.highlights : [''],
    included: tour.included?.length ? tour.included : [''],
    excluded: tour.excluded?.length ? tour.excluded : [],
    // Ensure itinerary has at least one day
    itinerary: tour.itinerary?.length 
      ? tour.itinerary.map((day: any) => ({
          ...day,
          meals: day.meals || [],
        }))
      : [
          {
            day: 1,
            title: '',
            description: '',
            accommodation: '',
            meals: [],
          },
        ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Tour</h1>
        <p className="text-muted-foreground">
          Update the details for {tour.title}
        </p>
      </div>
      
      <div className="rounded-md border p-6">
        <TourForm initialData={initialData} isEditing />
      </div>
    </div>
  );
}
