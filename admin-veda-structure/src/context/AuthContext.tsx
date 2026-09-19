import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService, { UserPayload } from "@/services/authService";

interface AuthContextType {
  user: UserPayload | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<UserPayload | null>;
  logout: () => Promise<void>;
  setUser: (user: UserPayload | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("user");
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("accessToken"));
  });

  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async (): Promise<UserPayload | null> => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authService.getCurrentUser();
      const currentUser = res.data || (res as any).user;
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        return currentUser;
      }
      return null;
    } catch (err: any) {
      console.warn("Session synchronization error:", err?.message || err);
      if (err?.status === 401 || err?.message?.includes("expired") || err?.message?.includes("Invalid")) {
        authService.clearSession();
        setUser(null);
      }
      setError(err?.message || "Failed to synchronize session with server.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Synchronize session on mount if token exists
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const isAuthenticated = Boolean(user && typeof window !== "undefined" && localStorage.getItem("accessToken"));
  const isAdmin = Boolean(user && user.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        refreshUser,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
