import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/context/ToastContext";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import UpcomingPujas from "@/pages/UpcomingPujas";
import UpcomingPujaForm from "@/pages/UpcomingPujaForm";
import UpcomingPujaDetail from "@/pages/UpcomingPujaDetail";
import PujaServices from "@/pages/PujaServices";
import PujaServiceForm from "@/pages/PujaServiceForm";
import PujaServiceDetail from "@/pages/PujaServiceDetail";
import ConsultationDetail from "@/pages/ConsultationDetail";

// Veda Library Module (Modular Architecture)
import {
  BlogListPage,
  BlogFormPage,
  BlogDetailPage,
} from "@/modules/library";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Upcoming Pujas */}
              <Route path="upcoming-pujas" element={<UpcomingPujas />} />
              <Route path="upcoming-pujas/new" element={<UpcomingPujaForm />} />
              <Route
                path="upcoming-pujas/:id"
                element={<UpcomingPujaDetail />}
              />
              <Route
                path="upcoming-pujas/:id/edit"
                element={<UpcomingPujaForm />}
              />

              {/* Puja Services Catalogue */}
              <Route path="puja-services" element={<PujaServices />} />
              <Route path="puja-services/new" element={<PujaServiceForm />} />
              <Route path="puja-services/:id" element={<PujaServiceDetail />} />
              <Route path="puja-services/:id/edit" element={<PujaServiceForm />} />

              {/* Veda Library Module - Blog Routes */}
              <Route path="library/blogs" element={<BlogListPage />} />
              <Route path="library/blogs/new" element={<BlogFormPage />} />
              <Route path="library/blogs/:id" element={<BlogDetailPage />} />
              <Route path="library/blogs/:id/edit" element={<BlogFormPage />} />

              {/* Direct Blog Aliases */}
              <Route path="blogs" element={<BlogListPage />} />
              <Route path="blogs/new" element={<BlogFormPage />} />
              <Route path="blogs/:id" element={<BlogDetailPage />} />
              <Route path="blogs/:id/edit" element={<BlogFormPage />} />

              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
