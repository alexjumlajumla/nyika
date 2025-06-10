export interface User {
  id: string;
  name?: string | null;
  email: string;
  phone?: string;
  address?: string;
  roles: ('admin' | 'editor' | 'user')[];
  updatedAt: string;
  createdAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  roles: string[];
  accessToken?: string;
}
