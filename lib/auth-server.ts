import { cookies } from 'next/headers';
import axios from 'axios';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

export async function getAuthUser(): Promise<{ user: UserProfile | null; token: string | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return { user: null, token: null };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await axios.get<ProfileResponse>(`${apiUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return { user: response.data.data.user, token };
    }

    return { user: null, token: null };
  } catch (error) {
    console.error('Error fetching user on server:', error);
    return { user: null, token: null };
  }
}
