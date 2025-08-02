// Interfaces pour les réponses API

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
  token: string;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
