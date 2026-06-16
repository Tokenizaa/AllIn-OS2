// ============================================================================
// API CLIENT - ALLIN OS 2.0
// Cliente HTTP base para integração com API AllInBrasil
// ============================================================================

export interface ApiClientConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class ApiClient {
  private config: ApiClientConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async authenticate(): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);
  }

  async authenticateWithPassword(username: string, password: string): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'password',
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000);
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt) {
      await this.authenticate();
    }
  }

  // ============================================================================
  // HTTP METHODS
  // ============================================================================

  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    await this.ensureAuthenticated();

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      method,
      headers,
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data,
      status: response.status,
      headers: responseHeaders,
    };
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, {
      ...options,
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, {
      ...options,
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, options);
  }

  // ============================================================================
  // FILTERS
  // ============================================================================

  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  async getWithFilters<T>(
    endpoint: string,
    filters: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const queryString = this.buildQueryString(filters);
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.get<T>(url);
  }
}
