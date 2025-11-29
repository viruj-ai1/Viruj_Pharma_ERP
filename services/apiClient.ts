/**
 * API Client for communicating with FastAPI backend
 * 
 * This service handles all HTTP requests to the backend API,
 * including authentication, error handling, and response parsing.
 */

const resolveDefaultApiBaseUrl = () => {
  const protocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https:' : 'http:';
  const host =
    typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';

  const configuredPort =
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_PORT) ||
    (globalThis as any)?.VITE_API_PORT;

  const port = configuredPort && `${configuredPort}`.trim() !== '' ? configuredPort : '8000';

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

    console.log('[API Client] Making request:', {
      method: options.method || 'GET',
      url,
      hasToken: !!this.token,
      hasBody: !!options.body,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[API Client] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API Client] Error response body:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || response.statusText };
        }
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        return jsonData;
      }
      return {} as T;
    } catch (error) {
      console.error('[API Client] Request failed:', error);
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
    console.log('[API Client] POST request:', endpoint, data);
    try {
      const result = await this.request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
      console.log('[API Client] POST response:', endpoint, result);
      return result;
    } catch (error) {
      console.error('[API Client] POST error:', endpoint, error);
      throw error;
    }
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

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  plant_id?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string | null;
};

export type UserCreatePayload = {
  name: string;
  email: string;
  role: string;
  department: string;
  plant_id?: string | null;
  password: string;
};

export const usersApi = {
  getAll: () => apiClient.get<ApiUser[]>('/api/users'),
  getById: (id: string) => apiClient.get<ApiUser>(`/api/users/${id}`),
  create: (user: UserCreatePayload) => apiClient.post<ApiUser>('/api/users', user),
  update: (id: string, user: Partial<ApiUser>) => apiClient.put<ApiUser>(`/api/users/${id}`, user),
  delete: (id: string) => apiClient.delete(`/api/users/${id}`),
};

export type SecurityLogPayload = {
  material_name: string;
  material_category?: string;
  po_number?: string;
  vehicle_name?: string;
  vehicle_number: string;
  driver_name?: string;
  driver_contact?: string;
  supplier_name?: string;
  document_number?: string;
  quantity?: number;
  uom?: string;
  remarks?: string;
  seal_intact?: boolean;
  plant_id?: string | null;
};

export type SecurityLog = SecurityLogPayload & {
  id: string;
  entry_code: string;
  status: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
};

export type GrnItem = {
  description: string;
  stock_code?: string | null;
  status?: string | null;
  quantity: number;
  price: number;
  vat_rate?: number;
  net?: number;
  vat_amount?: number;
  gross?: number;
  nominal?: string | null;
  account?: string | null;
};

export type CreateGrnPayload = {
  gate_entry_id: string;
  po_number: string;
  delivery_challan?: string;
  quantity_received: number;
  remarks?: string;
  supplier_name?: string;
  supplier_address?: string;
  supplier_location?: string;
  supplier_contact?: string;
  document_status?: string;
  document_date?: string;
  delivery_date?: string;
  period?: string;
  reference?: string;
  comment?: string;
  items: GrnItem[];
};

export type GrnResponse = {
  id: string;
  gate_entry_id: string;
  entry_code: string;
  grn_code: string;
  po_number: string;
  delivery_challan?: string | null;
  quantity_received?: number | null;
  remarks?: string | null;
  status: string;
  created_by?: string | null;
  created_by_name?: string | null;
  created_at: string;
  updated_at: string;
  supplier_name?: string | null;
  supplier_address?: string | null;
  supplier_location?: string | null;
  supplier_contact?: string | null;
  document_status?: string | null;
  document_date?: string | null;
  delivery_date?: string | null;
  period?: string | null;
  reference?: string | null;
  comment?: string | null;
  items: GrnItem[];
  net_total?: number | null;
  vat_total?: number | null;
  gross_total?: number | null;
};

export type PendingQaGrn = {
  grn_id: string;
  entry_code: string;
  po_number: string;
  delivery_challan?: string | null;
  quantity_received?: number | null;
  remarks?: string | null;
  status: string;
  material_name: string;
  vehicle_number: string;
  driver_name?: string | null;
  driver_contact?: string | null;
  gate_quantity?: number | null;
  uom?: string | null;
  gate_created_at: string;
};

export const securityApi = {
  getLogs: (status?: string) => {
    const query = status ? `?status_filter=${encodeURIComponent(status)}` : '';
    return apiClient.get<SecurityLog[]>(`/api/security/logs${query}`);
  },
  createLog: (payload: SecurityLogPayload) =>
    apiClient.post<SecurityLog>('/api/security/logs', payload),
};

export const grnApi = {
  create: (payload: CreateGrnPayload) => apiClient.post<GrnResponse>('/api/grn', payload),
  getPendingQA: () => apiClient.get<PendingQaGrn[]>('/api/grn/pending-qa'),
  requestSampling: (grnId: string, qaNotes?: string) =>
    apiClient.post<GrnResponse>(`/api/grn/${grnId}/request-sampling`, {
      qa_notes: qaNotes,
    }),
  getAll: () => apiClient.get<GrnResponse[]>('/api/grn'),
};

export const plantsApi = {
  getAll: () => apiClient.get('/api/plants'),
  getById: (id: string) => apiClient.get(`/api/plants/${id}`),
};

export type QualitySample = {
  id: string;
  grn_id?: string | null;
  entry_code: string;
  product_name: string;
  batch_number: string;
  sample_type: string;
  sample_date?: string | null;
  due_date?: string | null;
  status: string;
  analyst_id?: string | null;
  requested_by_name?: string | null;
  priority?: string | null;
  qa_notes?: string | null;
  test_count?: number;
};

export type QualityTest = {
  id: string;
  test_name: string;
  method?: string | null;
  status: string;
  assigned_to?: string | null;
  instrument_id?: string | null;
  submitted_on?: string | null;
  reviewed_by?: string | null;
  manager_notes?: string | null;
  result_data?: Record<string, any> | null;
};

export type QualityTestReviewItem = QualityTest & {
  sample: QualitySample;
  analyst?: { id: string | null; name?: string | null };
  reviewer_name?: string | null;
  qa_officer?: { id: string | null; name?: string | null };
  qa_officer_notes?: string | null;
  qa_officer_recommendation?: string | null;
  qa_manager_decision?: string | null;
  qa_manager_decision_notes?: string | null;
  material_disposition?: string | null;
  warehouse_action?: string | null;
  warehouse_notes?: string | null;
  warehouse_acknowledged_at?: string | null;
};

export const qualitySamplesApi = {
  getUnassigned: () => apiClient.get<QualitySample[]>('/api/quality-samples/unassigned'),
  getAssigned: () => apiClient.get<QualitySample[]>('/api/quality-samples/assigned'),
  assignSample: (sampleId: string, analystId: string) =>
    apiClient.post<{ id: string; product_name: string; analyst_id: string; status: string }>(
      `/api/quality-samples/${sampleId}/assign`,
      { analyst_id: analystId }
    ),
  getSampleTests: (sampleId: string) =>
    apiClient.get<QualityTest[]>(`/api/quality-samples/${sampleId}/tests`),
  createTests: (sampleId: string, tests: Array<{ test_name: string; method?: string }>) =>
    apiClient.post<QualityTest[]>(`/api/quality-samples/${sampleId}/tests/create`, tests),
  assignTest: (testId: string, employeeId: string) => {
    console.log('[API] assignTest called with:', { testId, employeeId });
    return apiClient.post<{ id: string; test_name: string; assigned_to: string; status: string }>(
      `/api/quality-tests/${testId}/assign`,
      { employee_id: employeeId }
    );
  },
  getMyTests: () =>
    apiClient.get<Array<QualityTest & { sample: QualitySample }>>('/api/quality-tests/my-tests'),
  startTest: (testId: string) =>
    apiClient.post<{ id: string; test_name: string; assigned_to: string; status: string }>(
      `/api/quality-tests/${testId}/start`
    ),
  submitTestResult: (testId: string, payload: { result_data: Record<string, any>; analyst_notes?: string }) =>
    apiClient.post<{ id: string; test_name: string; status: string; submitted_on?: string | null }>(
      `/api/quality-tests/${testId}/submit`,
      payload
    ),
  getTestsForReview: (
    status: 'pending' | 'reviewed' = 'pending',
    stage: 'qc' | 'qa-manager' | 'qa-officer' = 'qc'
  ) =>
    apiClient.get<QualityTestReviewItem[]>(
      `/api/quality-tests/review?status=${status}&stage=${stage}`
    ),
  reviewTest: (
    testId: string,
    action: 'Approve' | 'Reject' | 'Return' | 'SendToQA',
    managerNotes?: string,
  ) =>
    apiClient.post<{ id: string; test_name: string; status: string }>(`/api/quality-tests/${testId}/review`, {
      action,
      manager_notes: managerNotes,
    }),
  assignQaOfficer: (testId: string, officerId: string, notes?: string) =>
    apiClient.post<{ id: string; test_name: string; status: string }>(
      `/api/quality-tests/${testId}/qa-assign`,
      { officer_id: officerId, notes }
    ),
  qaOfficerReview: (testId: string, recommendation: 'Approve' | 'Reject', notes?: string) =>
    apiClient.post<{ id: string; test_name: string; status: string }>(
      `/api/quality-tests/${testId}/qa-officer-review`,
      { recommendation, notes }
    ),
  qaManagerDecision: (testId: string, decision: 'Approve' | 'Reject', notes?: string) =>
    apiClient.post<{ id: string; test_name: string; status: string }>(
      `/api/quality-tests/${testId}/qa-manager-decision`,
      { decision, notes }
    ),
  getWarehouseDecisions: (status: 'pending' | 'completed' = 'pending') =>
    apiClient.get<QualityTestReviewItem[]>(`/api/quality-tests/warehouse-decisions?status=${status}`),
  submitWarehouseAction: (testId: string, action: 'Accepted' | 'Rejected', notes?: string) =>
    apiClient.post<{ id: string; test_name: string; warehouse_action: string | null }>(
      `/api/quality-tests/${testId}/warehouse-action`,
      { action, notes }
    ),
};

// Export for use in components
export default apiClient;

