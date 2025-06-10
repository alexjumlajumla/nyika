import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.tourId || !data.date || !data.totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking with only the fields that exist in the Prisma schema
    const bookingData: any = {
      tourId: data.tourId,
      userId: session.user.id,
      startDate: new Date(data.date),
      endDate: new Date(new Date(data.date).setDate(new Date(data.date).getDate() + 1)),
      guests: data.guests || 1,
      totalPrice: data.totalAmount,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    };

    // Add optional fields if they exist
    if (data.customerEmail || session.user.email) {
      bookingData.customerEmail = data.customerEmail || session.user.email;
    }
    if (data.customerName || session.user.name) {
      bookingData.customerName = data.customerName || session.user.name;
    }
    if (data.customerPhone) {
      bookingData.customerPhone = data.customerPhone;
    }
    if (data.notes) {
      bookingData.notes = data.notes;
    }

    const booking = await prisma.booking.create({
      data: bookingData,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Verify the booking belongs to the user
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking || existingBooking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...data,
        // Ensure date is properly formatted if present
        ...(data.date && { date: new Date(data.date) }),
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single booking
      const booking = await prisma.booking.findUnique({
        where: { 
          id,
          userId: session.user.id 
        },
        include: {
          tour: true,
        },
      });

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(booking);
    } else {
      // List all bookings for the user
      const bookings = await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: {
          tour: {
            select: {
              id: true,
              title: true,
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(bookings);
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
