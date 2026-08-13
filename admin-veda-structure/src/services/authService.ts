import api from "@/services/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  profileImage: string | null;
  lastLoginAt?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: UserPayload;
  accessToken: string;
}

export interface CurrentUserResponse {
  success: boolean;
  data: UserPayload;
}

const login = async (credentials: LoginCredentials) => {
  const response = await api.post("/auth/login", credentials);
  return response as AuthResponse;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response as CurrentUserResponse;
};

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

const logout = async () => {
  try {
    await api.post("/auth/logout", {});
  } catch {
    // Ignore logout failures, still clear local session.
  } finally {
    clearSession();
  }
};

export default { login, logout, getCurrentUser, clearSession };
