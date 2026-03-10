const MANAGER_API_URL = "https://manager-api.farmacias.shop";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export class ManagerBackendBff {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = MANAGER_API_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...customHeaders,
    };
    
    // Add Authorization header if token is set
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  private isAuthenticated(): boolean {
    return !!this.authToken;
  }

  private requireAuth(): void {
    if (!this.isAuthenticated()) {
      throw new Error("Autenticação necessária. Faça login novamente.");
    }
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  removeAuthToken(): void {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Authenticate user and get access token
   */
  async signIn(credentials: SignInRequest): Promise<ApiResponse<SignInResponse>> {
    try {
      const url = this.buildUrl("/v1/SignIn/validate");
      const response = await fetch(url, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Credenciais inválidas",
          status: response.status,
        };
      }

      // Automatically set the token after successful login
      if (data.token) {
        this.setAuthToken(data.token);
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: "Erro de conexão. Tente novamente.",
        status: 0,
      };
    }
  }

  /**
   * Sign out and clear auth token
   */
  signOut(): void {
    this.removeAuthToken();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Require authentication for all API calls
      this.requireAuth();
      
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "GET",
        headers: this.mergeHeaders(options?.headers),
      });

      const data = await response.json();

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          data: null,
          error: "Sessão expirada. Faça login novamente.",
          status: response.status,
        };
      }

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Erro ao buscar dados",
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Require authentication for all API calls
      this.requireAuth();
      
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "POST",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          data: null,
          error: "Sessão expirada. Faça login novamente.",
          status: response.status,
        };
      }

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Erro ao enviar dados",
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Require authentication for all API calls
      this.requireAuth();
      
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "PUT",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          data: null,
          error: "Sessão expirada. Faça login novamente.",
          status: response.status,
        };
      }

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Erro ao atualizar dados",
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Require authentication for all API calls
      this.requireAuth();
      
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "PATCH",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          data: null,
          error: "Sessão expirada. Faça login novamente.",
          status: response.status,
        };
      }

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Erro ao atualizar dados",
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Require authentication for all API calls
      this.requireAuth();
      
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.mergeHeaders(options?.headers),
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          data: null,
          error: "Sessão expirada. Faça login novamente.",
          status: response.status,
        };
      }

      if (response.status === 204) {
        return {
          data: null,
          error: null,
          status: response.status,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "Erro ao deletar dados",
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }
}

// Singleton instance for global use
export const managerBackendBff = new ManagerBackendBff();
