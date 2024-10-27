import { UserProfile } from "../types/user.types";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokenResponse {
  token: string;
  valid?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export interface AuthResponse {
  valid: boolean;
  token: string;
  user: UserProfile;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message || `HTTP error! status: ${status}`);
    this.status = status;
    this.name = "ApiError";
  }
}
