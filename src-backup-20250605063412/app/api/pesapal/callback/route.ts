import { NextResponse } from 'next/server';
import { getAccessToken, getTransactionStatus } from '@/lib/pesapal';
import { prisma } from '@/lib/prisma';

interface CallbackPayload {
  OrderTrackingId: string;
  OrderNotificationType: 'IPN_CHANGE' | 'URL_STATUS';
  OrderMerchantReference: string;
  OrderTxnStatus?: string;
}

interface StatusResponse {
  payment_method?: string;
  amount?: number;
  payment_status_description?: string;
  payment_status_code?: string;
  message?: string;
  payment_date?: string;
}

export async function POST(req: Request) {
  try {
    const payload: CallbackPayload = await req.json();
    
    if (!payload.OrderTrackingId) {
      console.error('Missing OrderTrackingId in payload:', payload);
      return NextResponse.json(
        { error: 'Missing OrderTrackingId' },
        { status: 400 }
      );
    }

    // Get the transaction status from Pesapal
    const token = await getAccessToken();
    const statusResponse: StatusResponse = await getTransactionStatus(token, payload.OrderTrackingId);

    // Determine the booking status based on payment status
    let bookingStatus = 'PENDING';
    let paymentStatus = 'PENDING';
    
    if (statusResponse.payment_status_code === '1') {
      bookingStatus = 'CONFIRMED';
      paymentStatus = 'PAID';
    } else if (['2', '3', '4'].includes(statusResponse.payment_status_code || '')) {
      bookingStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
    }

    // Update the booking with the payment status
    try {
      // First find the booking by payment reference using raw SQL
      const bookings = await prisma.$queryRaw`
        SELECT b.*, 
               json_build_object('title', t.title) as tour,
               json_build_object('email', u.email, 'name', u.name) as user
        FROM "bookings" b
        LEFT JOIN "tours" t ON b.tour_id = t.id
        LEFT JOIN "users" u ON b.user_id = u.id
        WHERE b.payment_reference = ${payload.OrderTrackingId}
        LIMIT 1
      `;
      
      const booking = Array.isArray(bookings) ? bookings[0] : null;

      if (!booking) {
        console.error('Booking not found for payment reference:', payload.OrderTrackingId);
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      // Prepare the update data
      const updateData: any = {
        status: bookingStatus,
        payment_status: paymentStatus,
        updated_at: new Date()
      };
      
      if (statusResponse.payment_method) {
        updateData.payment_method = statusResponse.payment_method;
      }
      
      if (statusResponse.payment_date) {
        updateData.updated_at = new Date(statusResponse.payment_date);
      }
      
      // Build the SET clause for the SQL update
      const setClauses: string[] = [];
      const values: any[] = [];
      
      // Handle status and payment_status as enums
      if (updateData.status) {
        setClauses.push(`status = '${updateData.status}'::"BookingStatus"`);
      }
      
      if (updateData.payment_status) {
        setClauses.push(`payment_status = '${updateData.payment_status}'::"PaymentStatus"`);
      }
      
      // Handle other fields
      for (const [key, value] of Object.entries(updateData)) {
        if (key !== 'status' && key !== 'payment_status' && value !== undefined) {
          setClauses.push(`${key} = $${setClauses.length + 1}`);
          values.push(value instanceof Date ? value.toISOString() : value);
        }
      }
      
      // Only proceed if we have fields to update
      if (setClauses.length === 0) {
        console.log('No fields to update');
        return NextResponse.json({ success: true, message: 'No updates needed' });
      }
      
      // Add the WHERE clause parameter
      values.push(booking.id);
      
      // Execute the update query
      await prisma.$executeRawUnsafe(
        `UPDATE "bookings" SET ${setClauses.join(', ')} WHERE id = $${setClauses.length + 1}`,
        ...values
      );
      
      console.log('Booking updated successfully:', {
        bookingId: booking.id,
        status: bookingStatus,
        paymentStatus,
        tour: booking.tour?.title,
        user: booking.user?.email,
      });
      
      // Here you could also send a confirmation email to the user
      // await sendBookingConfirmation(booking);

    } catch (dbError) {
      console.error('Error updating booking in database:', dbError);
      // Don't fail the request if the database update fails
      // Pesapal will retry the callback later
    }

    return NextResponse.json({ 
      success: true,
      message: 'Callback processed successfully',
      orderTrackingId: payload.OrderTrackingId,
      status: statusResponse.payment_status_description
    });

  } catch (error) {
    console.error('Error processing Pesapal callback:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process callback',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
