export interface User {
  id: number;
  username: string;
}

export interface Calculation {
  id: number;
  user_id: number;
  parent_id: number | null;
  operation: string | null;
  number: number;
  result: number;
  created_at: string;
  username?: string;
  children?: Calculation[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface CreateCalculationRequest {
  number: number;
  parentId?: number;
  operation?: '+' | '-' | '*' | '/';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}
