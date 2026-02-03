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

export class ManagerBackendBff {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

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
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  setAuthToken(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders["Authorization"];
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "GET",
        headers: this.mergeHeaders(options?.headers),
      });

      const data = await response.json();

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
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "POST",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

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
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "PUT",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

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
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "PATCH",
        headers: this.mergeHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

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
      const url = this.buildUrl(endpoint, options?.params);
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.mergeHeaders(options?.headers),
      });

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
