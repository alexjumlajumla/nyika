import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPayload } from '@/lib/payload';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
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
    // Fetch tour by ID
    const tour = await payload.findByID({
      collection: 'tours',
      id: params.id,
      depth: 1,
    });

    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json(
      { message: 'Tour not found' },
      { status: 404 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
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
    
    // Update tour
    const tour = await payload.update({
      collection: 'tours',
      id: params.id,
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

export async function DELETE(request: Request, { params }: Params) {
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
    // Delete tour
    await payload.delete({
      collection: 'tours',
      id: params.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete tour' },
      { status: 400 }
    );
  }
}
