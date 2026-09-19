import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ShieldAlert, RefreshCw, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading, isAuthenticated, isAdmin, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // 1. Loading verification state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg shadow-saffron-500/20 mb-4 animate-pulse">
          <Sun className="w-7 h-7 text-white animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <h2 className="text-base font-semibold text-charcoal-800">Verifying Admin Session</h2>
        <p className="text-xs text-charcoal-400 mt-1">Synchronizing authorization with Veda Structure...</p>
      </div>
    );
  }

  // 2. Unauthenticated state -> redirect to login
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Authenticated but non-admin role -> Access Denied screen (avoids redirect loop)
  if (!isAdmin) {
    const handleLogoutAndRedirect = async () => {
      await logout();
      navigate("/admin/login", { replace: true });
    };

    const handleRecheck = async () => {
      setRefreshing(true);
      try {
        await refreshUser();
      } finally {
        setRefreshing(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-cream-300 p-8 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-charcoal-900 mb-2">Administrator Access Required</h2>
          <p className="text-sm text-charcoal-500 mb-6 leading-relaxed">
            You are signed in as <span className="font-semibold text-charcoal-800">{user?.email || "User"}</span> with role{" "}
            <span className="inline-block px-2 py-0.5 rounded bg-cream-100 text-charcoal-700 font-mono text-xs font-semibold">
              {user?.role || "user"}
            </span>
            . Administrator privileges are required to access this portal.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogoutAndRedirect}
              className="w-full py-2.5 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-medium text-sm transition shadow-sm"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={handleRecheck}
              disabled={refreshing}
              className="w-full py-2.5 px-4 rounded-xl border border-cream-300 text-charcoal-600 hover:bg-cream-100 font-medium text-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Checking Permissions..." : "Re-check Permissions"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin
  return <Outlet />;
}
