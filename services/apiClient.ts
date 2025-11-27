/**
 * API Client for communicating with FastAPI backend
 * 
 * This service handles all HTTP requests to the backend API,
 * including authentication, error handling, and response parsing.
 */

const resolveDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const host = window.location.hostname;
  const frontendPort = window.location.port;
  const port =
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_PORT) ||
    (frontendPort && frontendPort !== '' && frontendPort !== '3000' && frontendPort !== '5173'
      ? frontendPort
      : '8000');

  return `${protocol}//${host}:${port}`;
};

const apiBaseEnv =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_BASE_URL) ||
  (globalThis as any)?.VITE_API_BASE_URL;

const API_BASE_URL =
  apiBaseEnv && typeof apiBaseEnv === 'string' && apiBaseEnv.trim() !== ''
    ? apiBaseEnv
    : resolveDefaultApiBaseUrl();

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: response.statusText,
        }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoint helpers
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ access_token: string; token_type: string; user: unknown }>(
      '/api/auth/login',
      { email, password }
    ),
  
  logout: () => apiClient.post('/api/auth/logout'),
  
  getCurrentUser: () => apiClient.get('/api/auth/me'),
  
  refreshToken: () => apiClient.post('/api/auth/refresh'),
};

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  plant_id?: string | null;
  is_active: boolean;
};

export const usersApi = {
  getAll: () => apiClient.get<ApiUser[]>('/api/users'),
  getById: (id: string) => apiClient.get<ApiUser>(`/api/users/${id}`),
  create: (user: Partial<ApiUser>) => apiClient.post<ApiUser>('/api/users', user),
  update: (id: string, user: Partial<ApiUser>) => apiClient.put<ApiUser>(`/api/users/${id}`, user),
  delete: (id: string) => apiClient.delete(`/api/users/${id}`),
};

export const plantsApi = {
  getAll: () => apiClient.get('/api/plants'),
  getById: (id: string) => apiClient.get(`/api/plants/${id}`),
};

// Export for use in components
export default apiClient;

