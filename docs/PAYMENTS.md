# Pesapal Payment Integration

This document outlines how to set up and use the Pesapal payment gateway in the Nyika Safaris application.

## Prerequisites

1. Pesapal merchant account (sandbox or production)
2. Obtain your Consumer Key and Secret from the Pesapal dashboard
3. Set up an IPN (Instant Payment Notification) URL in your Pesapal dashboard

## Environment Variables

Add the following to your `.env.local` file:

```env
# Pesapal Configuration
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_NOTIFICATION_ID=your_notification_id
NEXT_PUBLIC_PESAPAL_ENV=sandbox # or 'production' for live environment
```

## API Endpoints

### 1. Create Order
**Endpoint:** `POST /api/pesapal/create-order`

**Request Body:**
```json
{
  "amount": 1000,
  "description": "Safari Tour Booking",
  "email": "customer@example.com",
  "phone": "+254712345678",
  "firstName": "John",
  "lastName": "Doe",
  "tourId": "tour-123"
}
```

**Response:**
```json
{
  "orderId": "unique-order-id",
  "redirectUrl": "https://pesapal.com/checkout/..."
}
```

### 2. Payment Callback (IPN)
**Endpoint:** `POST /api/pesapal/callback`

This endpoint receives payment status updates from Pesapal. Update your database accordingly in this handler.

## Frontend Component

Use the `PesapalCheckoutButton` component to initiate payments:

```tsx
import PesapalCheckoutButton from '@/components/checkout/PesapalCheckoutButton';

// In your component:
<PesapalCheckoutButton
  amount={1000}
  description="Safari Tour Booking"
  tourId="tour-123"
  onSuccess={() => {
    // Handle successful payment initiation
  }}
  onError={(error) => {
    // Handle errors
  }}
/>
```

## Testing

1. Use the sandbox environment for testing
2. Test with Pesapal test cards:
   - Card: 4111 1111 1111 1012
   - Expiry: Any future date
   - CVV: Any 3 digits
   - OTP: 123456

## Going Live

1. Update environment variables to use production credentials
2. Set `NEXT_PUBLIC_PESAPAL_ENV=production`
3. Ensure your production domain is whitelisted in the Pesapal dashboard
4. Test thoroughly before going live

## Troubleshooting

- **Payments not processing**: Check browser console and server logs for errors
- **IPN not received**: Verify IPN URL in Pesapal dashboard and server logs
- **Authentication errors**: Double-check your consumer key and secret

## Security Considerations

- Never expose your consumer secret in client-side code
- Always use HTTPS in production
- Implement proper error handling and logging
- Regularly check Pesapal's status page for any service interruptions
