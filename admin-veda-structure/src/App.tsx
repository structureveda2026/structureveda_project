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
import Astrologers from "@/pages/Astrologers";
import AstrologerDetail from "@/pages/AstrologerDetail";
import AstrologerForm from "@/pages/AstrologerForm";
import AstrologerPackages from "@/pages/AstrologerPackages";


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
  PuranaItihasaListPage,
  PuranaItihasaFormPage,
  PuranaItihasaStructureTreePage,
  PuranaItihasaShlokaListPage,
  PuranaItihasaShlokaFormPage,
  MantraStotraBranchesPage,
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

              {/* Astrologers */}
              <Route path="astrologers" element={<Astrologers />} />
              <Route path="astrologers/new" element={<AstrologerForm />} />
              <Route path="astrologers/:id" element={<AstrologerDetail />} />
              <Route path="astrologers/:id/packages" element={<AstrologerPackages />} />
              <Route path="astrologers/:id/edit" element={<AstrologerForm />} />

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

              {/* Veda Library Module - Vedas (Ved) */}
              <Route path="library/vedas" element={<VedaListPage />} />
              <Route path="library/vedas/new" element={<VedaFormPage />} />
              <Route path="library/vedas/:id" element={<VedaTreePage />} />
              <Route path="library/vedas/:id/edit" element={<VedaFormPage />} />
              <Route path="library/vedas/:id/structure" element={<VedaTreePage />} />

              {/* Purana & Itihasa Archive Module */}
              {/* Purana & Itihasa Archive */}
              <Route path="purana-itihasa" element={<PuranaItihasaListPage />} />
              <Route path="purana-itihasa/new" element={<PuranaItihasaFormPage />} />
              <Route path="purana-itihasa/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="purana-itihasa/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="purana-itihasa/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="purana-itihasa/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="purana-itihasa/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />
              <Route path="purana-itihasa/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="purana-itihasa/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />
              <Route path="purana-itihasa/shlokas/:shlokaId/edit" element={<PuranaItihasaShlokaFormPage />} />

              <Route path="library/purana-itihasa" element={<PuranaItihasaListPage />} />
              <Route path="library/purana-itihasa/new" element={<PuranaItihasaFormPage />} />
              <Route path="library/purana-itihasa/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/purana-itihasa/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="library/purana-itihasa/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/purana-itihasa/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="library/purana-itihasa/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />
              <Route path="library/purana-itihasa/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="library/purana-itihasa/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />
              <Route path="library/purana-itihasa/shlokas/:shlokaId/edit" element={<PuranaItihasaShlokaFormPage />} />

              {/* Veda Library Module - Puranas (पुराण) */}
              <Route path="library/puranas" element={<PuranaItihasaListPage />} />
              <Route path="library/puranas/new" element={<PuranaItihasaFormPage />} />
              <Route path="library/puranas/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/puranas/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="library/puranas/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/puranas/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="library/puranas/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />

              {/* Veda Library Module - Itihasa (इतिहास) */}
              <Route path="library/itihasas" element={<PuranaItihasaListPage />} />
              <Route path="library/itihasas/new" element={<PuranaItihasaFormPage />} />
              <Route path="library/itihasas/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/itihasas/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="library/itihasas/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="library/itihasas/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="library/itihasas/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />

              {/* Veda Library Module - Upanishads (उपनिषद्) */}
              <Route path="library/upanishads" element={<VedaListPage category="upanishad" title="Upanishads (उपनिषद्)" />} />
              <Route path="library/upanishads/new" element={<VedaFormPage />} />
              <Route path="library/upanishads/:id" element={<VedaTreePage />} />
              <Route path="library/upanishads/:id/edit" element={<VedaFormPage />} />
              <Route path="library/upanishads/:id/structure" element={<VedaTreePage />} />

              {/* Veda Library Module - Darshana (दर्शन शास्त्र) */}
              <Route path="library/darshanas" element={<VedaListPage category="darshana" title="Darshana (दर्शन शास्त्र)" />} />
              <Route path="library/darshanas/new" element={<VedaFormPage />} />
              <Route path="library/darshanas/:id" element={<VedaTreePage />} />
              <Route path="library/darshanas/:id/edit" element={<VedaFormPage />} />
              <Route path="library/darshanas/:id/structure" element={<VedaTreePage />} />

              {/* Veda Library Module - Mantras & Suktas */}
              <Route path="library/mantras" element={<MantraListPage />} />
              <Route path="library/mantras/new" element={<MantraFormPage />} />
              <Route path="library/mantras/:id" element={<MantraDetailPage />} />
              <Route path="library/mantras/:id/edit" element={<MantraFormPage />} />

              {/* Mantra-Stotra Branches & Subcategories (उप-विभाग एवं शाखाएँ) */}
              <Route path="library/mantra-stotra-branches" element={<MantraStotraBranchesPage />} />
              <Route path="library/branches" element={<MantraStotraBranchesPage />} />
              <Route path="mantra-stotra-branches" element={<MantraStotraBranchesPage />} />
              <Route path="branches" element={<MantraStotraBranchesPage />} />

              {/* Direct Veda Aliases */}
              <Route path="vedas" element={<VedaListPage />} />
              <Route path="vedas/new" element={<VedaFormPage />} />
              <Route path="vedas/:id" element={<VedaTreePage />} />
              <Route path="vedas/:id/edit" element={<VedaFormPage />} />
              <Route path="vedas/:id/structure" element={<VedaTreePage />} />

              <Route path="puranas" element={<PuranaItihasaListPage />} />
              <Route path="puranas/new" element={<PuranaItihasaFormPage />} />
              <Route path="puranas/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="puranas/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="puranas/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="puranas/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="puranas/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />

              <Route path="itihasas" element={<PuranaItihasaListPage />} />
              <Route path="itihasas/new" element={<PuranaItihasaFormPage />} />
              <Route path="itihasas/:id" element={<PuranaItihasaStructureTreePage />} />
              <Route path="itihasas/:id/edit" element={<PuranaItihasaFormPage />} />
              <Route path="itihasas/:id/structure" element={<PuranaItihasaStructureTreePage />} />
              <Route path="itihasas/:id/shlokas" element={<PuranaItihasaShlokaListPage />} />
              <Route path="itihasas/:id/shlokas/new" element={<PuranaItihasaShlokaFormPage />} />

              <Route path="upanishads" element={<VedaListPage category="upanishad" title="Upanishads (उपनिषद्)" />} />
              <Route path="upanishads/new" element={<VedaFormPage />} />
              <Route path="upanishads/:id" element={<VedaTreePage />} />
              <Route path="upanishads/:id/edit" element={<VedaFormPage />} />
              <Route path="upanishads/:id/structure" element={<VedaTreePage />} />

              <Route path="darshanas" element={<VedaListPage category="darshana" title="Darshana (दर्शन शास्त्र)" />} />
              <Route path="darshanas/new" element={<VedaFormPage />} />
              <Route path="darshanas/:id" element={<VedaTreePage />} />
              <Route path="darshanas/:id/edit" element={<VedaFormPage />} />
              <Route path="darshanas/:id/structure" element={<VedaTreePage />} />

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
