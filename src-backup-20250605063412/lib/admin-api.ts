import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function fetchAdminData(endpoint: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/admin${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

export async function getTours() {
  return fetchAdminData('/tours');
}

export async function getTour(id: string) {
  return fetchAdminData(`/tours/${id}`);
}

export async function createTour(data: any) {
  return fetchAdminData('/tours', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTour(id: string, data: any) {
  return fetchAdminData(`/tours/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTour(id: string) {
  return fetchAdminData(`/tours/${id}`, {
    method: 'DELETE',
  });
}
