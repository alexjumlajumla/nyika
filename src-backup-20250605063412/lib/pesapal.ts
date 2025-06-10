import axios from 'axios';

const consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
const baseUrl = process.env.NEXT_PUBLIC_PESAPAL_ENV === 'sandbox' 
  ? 'https://cybqa.pesapal.com/pesapalv3' 
  : 'https://pay.pesapal.com/v3';

export async function getAccessToken() {
  try {
    const { data } = await axios.post(`${baseUrl}/api/Auth/RequestToken`, {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    });
    return data.token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with Pesapal');
  }
}

export interface IPesapalOrder {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
  };
  redirect_mode?: string;
  cancellation_url?: string;
}

export async function submitOrder(token: string, order: IPesapalOrder) {
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const { data } = await axios.post(
      `${baseUrl}/api/Transactions/SubmitOrderRequest`,
      {
        ...order,
        redirect_mode: order.redirect_mode || 'PARENT_WINDOW',
      },
      { headers }
    );
    
    return data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw new Error('Failed to submit order to Pesapal');
  }
}

export async function getTransactionStatus(token: string, orderTrackingId: string) {
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const { data } = await axios.get(
      `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers }
    );
    
    return data;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw new Error('Failed to get transaction status from Pesapal');
  }
}

export async function registerIPN(token: string, url: string) {
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const { data } = await axios.post(
      `${baseUrl}/api/URLSetup/RegisterIPN`,
      { url, ipn_notification_type: 'POST' },
      { headers }
    );
    
    return data;
  } catch (error) {
    console.error('Error registering IPN:', error);
    throw new Error('Failed to register IPN with Pesapal');
  }
}
