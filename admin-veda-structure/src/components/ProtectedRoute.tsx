import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

export default function ProtectedRoute() {
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}
