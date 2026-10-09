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
import PujaCategories from "@/pages/PujaCategories";
import PujaCategoryForm from "@/pages/PujaCategoryForm";
import PujaCategoryDetail from "@/pages/PujaCategoryDetail";
import YagyaServices from "@/pages/YagyaServices";
import YagyaServiceForm from "@/pages/YagyaServiceForm";
import YagyaServiceDetail from "@/pages/YagyaServiceDetail";
import YagyaCategories from "@/pages/YagyaCategories";
import YagyaCategoryForm from "@/pages/YagyaCategoryForm";
import YagyaCategoryDetail from "@/pages/YagyaCategoryDetail";
import JapaServices from "@/pages/JapaServices";
import JapaServiceForm from "@/pages/JapaServiceForm";
import JapaServiceDetail from "@/pages/JapaServiceDetail";
import JapaCategories from "@/pages/JapaCategories";
import JapaCategoryForm from "@/pages/JapaCategoryForm";
import JapaCategoryDetail from "@/pages/JapaCategoryDetail";
import HomaServices from "@/pages/HomaServices";
import HomaServiceForm from "@/pages/HomaServiceForm";
import HomaServiceDetail from "@/pages/HomaServiceDetail";
import HomaCategories from "@/pages/HomaCategories";
import HomaCategoryForm from "@/pages/HomaCategoryForm";
import HomaCategoryDetail from "@/pages/HomaCategoryDetail";
import PathServices from "@/pages/PathServices";
import PathServiceForm from "@/pages/PathServiceForm";
import PathServiceDetail from "@/pages/PathServiceDetail";
import PathCategories from "@/pages/PathCategories";
import PathCategoryForm from "@/pages/PathCategoryForm";
import PathCategoryDetail from "@/pages/PathCategoryDetail";


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

              {/* Puja Categories */}
              <Route path="puja/categories" element={<PujaCategories />} />
              <Route path="puja/categories/new" element={<PujaCategoryForm />} />
              <Route path="puja/categories/:id" element={<PujaCategoryDetail />} />
              <Route path="puja/categories/:id/edit" element={<PujaCategoryForm />} />

              {/* Puja Categories Direct Aliases */}
              <Route path="puja-categories" element={<PujaCategories />} />
              <Route path="puja-categories/new" element={<PujaCategoryForm />} />
              <Route path="puja-categories/:id" element={<PujaCategoryDetail />} />
              <Route path="puja-categories/:id/edit" element={<PujaCategoryForm />} />

              {/* Yagya Services Catalogue */}
              <Route path="yagya-services" element={<YagyaServices />} />
              <Route path="yagya-services/new" element={<YagyaServiceForm />} />
              <Route path="yagya-services/:id" element={<YagyaServiceDetail />} />
              <Route path="yagya-services/:id/edit" element={<YagyaServiceForm />} />

              {/* Yagya Categories */}
              <Route path="yagya/categories" element={<YagyaCategories />} />
              <Route path="yagya/categories/new" element={<YagyaCategoryForm />} />
              <Route path="yagya/categories/:id" element={<YagyaCategoryDetail />} />
              <Route path="yagya/categories/:id/edit" element={<YagyaCategoryForm />} />

              {/* Yagya Categories Direct Aliases */}
              <Route path="yagya-categories" element={<YagyaCategories />} />
              <Route path="yagya-categories/new" element={<YagyaCategoryForm />} />
              <Route path="yagya-categories/:id" element={<YagyaCategoryDetail />} />
              <Route path="yagya-categories/:id/edit" element={<YagyaCategoryForm />} />

              {/* Japa Categories */}
              <Route path="japa/categories" element={<JapaCategories />} />
              <Route path="japa/categories/new" element={<JapaCategoryForm />} />
              <Route path="japa/categories/:id" element={<JapaCategoryDetail />} />
              <Route path="japa/categories/:id/edit" element={<JapaCategoryForm />} />

              {/* Japa Categories Direct Aliases */}
              <Route path="japa-categories" element={<JapaCategories />} />
              <Route path="japa-categories/new" element={<JapaCategoryForm />} />
              <Route path="japa-categories/:id" element={<JapaCategoryDetail />} />
              <Route path="japa-categories/:id/edit" element={<JapaCategoryForm />} />

              {/* Japa Services Catalogue */}
              <Route path="japa-services" element={<JapaServices />} />
              <Route path="japa-services/new" element={<JapaServiceForm />} />
              <Route path="japa-services/:id" element={<JapaServiceDetail />} />
              <Route path="japa-services/:id/edit" element={<JapaServiceForm />} />

              {/* Homa Categories */}
              <Route path="homa/categories" element={<HomaCategories />} />
              <Route path="homa/categories/new" element={<HomaCategoryForm />} />
              <Route path="homa/categories/:id" element={<HomaCategoryDetail />} />
              <Route path="homa/categories/:id/edit" element={<HomaCategoryForm />} />

              {/* Homa Categories Direct Aliases */}
              <Route path="homa-categories" element={<HomaCategories />} />
              <Route path="homa-categories/new" element={<HomaCategoryForm />} />
              <Route path="homa-categories/:id" element={<HomaCategoryDetail />} />
              <Route path="homa-categories/:id/edit" element={<HomaCategoryForm />} />

              {/* Homa Services Catalogue */}
              <Route path="homa-services" element={<HomaServices />} />
              <Route path="homa-services/new" element={<HomaServiceForm />} />
              <Route path="homa-services/:id" element={<HomaServiceDetail />} />
              <Route path="homa-services/:id/edit" element={<HomaServiceForm />} />

              {/* Path Categories */}
              <Route path="path/categories" element={<PathCategories />} />
              <Route path="path/categories/new" element={<PathCategoryForm />} />
              <Route path="path/categories/:id" element={<PathCategoryDetail />} />
              <Route path="path/categories/:id/edit" element={<PathCategoryForm />} />

              {/* Path Categories Direct Aliases */}
              <Route path="path-categories" element={<PathCategories />} />
              <Route path="path-categories/new" element={<PathCategoryForm />} />
              <Route path="path-categories/:id" element={<PathCategoryDetail />} />
              <Route path="path-categories/:id/edit" element={<PathCategoryForm />} />

              {/* Path Services Catalogue */}
              <Route path="path-services" element={<PathServices />} />
              <Route path="path-services/new" element={<PathServiceForm />} />
              <Route path="path-services/:id" element={<PathServiceDetail />} />
              <Route path="path-services/:id/edit" element={<PathServiceForm />} />

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
