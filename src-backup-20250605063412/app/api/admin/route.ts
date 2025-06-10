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

  // Return admin data
  return NextResponse.json({
    message: 'Welcome to the admin API',
    user: {
      id: user.docs[0].id,
      name: user.docs[0].name,
      email: user.docs[0].email,
      role: user.docs[0].role,
    },
  });
}
