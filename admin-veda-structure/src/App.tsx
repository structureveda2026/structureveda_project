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
import YagyaServices from "@/pages/YagyaServices";
import YagyaServiceForm from "@/pages/YagyaServiceForm";
import YagyaServiceDetail from "@/pages/YagyaServiceDetail";
import JapaServices from "@/pages/JapaServices";
import JapaServiceForm from "@/pages/JapaServiceForm";
import JapaServiceDetail from "@/pages/JapaServiceDetail";
import HomaServices from "@/pages/HomaServices";
import HomaServiceForm from "@/pages/HomaServiceForm";
import HomaServiceDetail from "@/pages/HomaServiceDetail";
import PathServices from "@/pages/PathServices";
import PathServiceForm from "@/pages/PathServiceForm";
import PathServiceDetail from "@/pages/PathServiceDetail";
import ConsultationDetail from "@/pages/ConsultationDetail";

// Veda Library Module (Blogs, Vedas, Mantras & Suktas)
import {
  BlogListPage,
  BlogFormPage,
  BlogDetailPage,
  VedaListPage,
  VedaFormPage,
  VedaTreePage,
  MantraListPage,
  MantraFormPage,
  MantraDetailPage,
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

              {/* Yagya Services Catalogue */}
              <Route path="yagya-services" element={<YagyaServices />} />
              <Route path="yagya-services/new" element={<YagyaServiceForm />} />
              <Route path="yagya-services/:id" element={<YagyaServiceDetail />} />
              <Route path="yagya-services/:id/edit" element={<YagyaServiceForm />} />

              {/* Japa Services Catalogue */}
              <Route path="japa-services" element={<JapaServices />} />
              <Route path="japa-services/new" element={<JapaServiceForm />} />
              <Route path="japa-services/:id" element={<JapaServiceDetail />} />
              <Route path="japa-services/:id/edit" element={<JapaServiceForm />} />

              {/* Homa Services Catalogue */}
              <Route path="homa-services" element={<HomaServices />} />
              <Route path="homa-services/new" element={<HomaServiceForm />} />
              <Route path="homa-services/:id" element={<HomaServiceDetail />} />
              <Route path="homa-services/:id/edit" element={<HomaServiceForm />} />

              {/* Path Services Catalogue */}
              <Route path="path-services" element={<PathServices />} />
              <Route path="path-services/new" element={<PathServiceForm />} />
              <Route path="path-services/:id" element={<PathServiceDetail />} />
              <Route path="path-services/:id/edit" element={<PathServiceForm />} />

              {/* Veda Library Module - Vedas (Ved) */}
              <Route path="library/vedas" element={<VedaListPage />} />
              <Route path="library/vedas/new" element={<VedaFormPage />} />
              <Route path="library/vedas/:id" element={<VedaTreePage />} />
              <Route path="library/vedas/:id/edit" element={<VedaFormPage />} />
              <Route path="library/vedas/:id/structure" element={<VedaTreePage />} />

              {/* Veda Library Module - Mantras & Suktas */}
              <Route path="library/mantras" element={<MantraListPage />} />
              <Route path="library/mantras/new" element={<MantraFormPage />} />
              <Route path="library/mantras/:id" element={<MantraDetailPage />} />
              <Route path="library/mantras/:id/edit" element={<MantraFormPage />} />

              {/* Direct Veda Aliases */}
              <Route path="vedas" element={<VedaListPage />} />
              <Route path="vedas/new" element={<VedaFormPage />} />
              <Route path="vedas/:id" element={<VedaTreePage />} />
              <Route path="vedas/:id/edit" element={<VedaFormPage />} />
              <Route path="vedas/:id/structure" element={<VedaTreePage />} />
              <Route path="mantras" element={<MantraListPage />} />
              <Route path="mantras/new" element={<MantraFormPage />} />
              <Route path="mantras/:id" element={<MantraDetailPage />} />
              <Route path="mantras/:id/edit" element={<MantraFormPage />} />

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
