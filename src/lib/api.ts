// API utilities for Rail-Jee
import { API_ENDPOINTS } from './apiConfig';
import { emitExternalApiError } from './externalApiError';

export interface UserProfilePayload {
  supabaseId: string;
  email: string;
  username: string;
}

export async function syncUserProfile(payload: UserProfilePayload): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      emitExternalApiError();
      return { success: false, error: errorData.message || `HTTP error! status: ${response.status}` };
    }

    return { success: true };
  } catch (error: any) {
    emitExternalApiError();
    return { success: false, error: error.message || 'Failed to create user profile' };
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred' };
  }
}

// Types
export interface TopPaper {
  _id: string;
  departmentId: string;
  paperId: string;
  paperCode: string;
  name: string;
  description: string;
  year: number;
  shift: string;
  zones: string;
  examType: string;
  totalQuestions: number;
  duration: number;
  passMarks: number;
  negativeMarking: number;
  rating: number;
  isFree: boolean;
  isNew: boolean;
  paperType: string;
  sections?: any[];
  createdAt: string;
  updatedAt: string;
}

// API Functions
export async function getTopPapers(limit: number = 6): Promise<TopPaper[]> {
  try {
    const response = await fetch(API_ENDPOINTS.TOP_PAPERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error('Error fetching top papers:', error);
    emitExternalApiError();
    return [];
  }
}

// Subscription Types
export interface Subscription {
  _id: string;
  userId: string;
  accessType: string;
  departmentId: string;
  planId: string;
  paperIds: string[];
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  paymentRef: string;
  paymentGateway: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  message?: string;
}

// Fetch user subscriptions
export async function getUserSubscriptions(accessToken: string): Promise<Subscription[]> {
  try {
    const response = await fetch(API_ENDPOINTS.USER_SUBSCRIPTIONS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SubscriptionsResponse = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    emitExternalApiError();
    return [];
  }
}
