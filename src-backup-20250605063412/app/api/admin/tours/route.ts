import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPayload } from '@/lib/payload';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
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
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 403 }
    );
  }

  // Fetch tours
  const tours = await payload.find({
    collection: 'tours',
    limit: 50,
    sort: '-createdAt',
    depth: 1,
  });

  return NextResponse.json(tours);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
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
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 403 }
    );
  }

  try {
    const data = await request.json();
    
    // Create new tour
    const tour = await payload.create({
      collection: 'tours',
      data,
    });

    return NextResponse.json(tour);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 400 }
    );
  }
}
