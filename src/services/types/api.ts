// Common API response types
export interface APIResponse<T = unknown> {
  result: {
    data: T;
    message?: string;
    success?: boolean;
  };
}

// Base entity interfaces
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Config entity interface
export interface Config extends Record<string, unknown> {
  appName?: string;
  version?: string;
  environment?: string;
  features?: Record<string, boolean>;
  settings?: Record<string, unknown>;
  apiStatus?: string;
  error?: string;
  errorDetails?: string;
  expectedEndpoint?: string;
  lastAttempt?: string;
  lastRefresh?: string;
  fallbackData?: boolean;
}

// Query parameter types
export interface QueryParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// Generic list response
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
