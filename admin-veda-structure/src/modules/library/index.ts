/**
 * Veda Library Frontend Module
 * Encapsulates Blog Posts, Vedas, Shakhas, Suktas, Mantras, and Vedic Wisdom content
 */

// Blog Pages
export { default as BlogListPage } from "./pages/BlogListPage";
export { default as BlogFormPage } from "./pages/BlogFormPage";
export { default as BlogDetailPage } from "./pages/BlogDetailPage";

// Veda & Mantra Pages
export { default as VedaListPage } from "./pages/VedaListPage";
export { default as VedaFormPage } from "./pages/VedaFormPage";
export { default as VedaTreePage } from "./pages/VedaTreePage";
export { default as MantraListPage } from "./pages/MantraListPage";
export { default as MantraFormPage } from "./pages/MantraFormPage";
export { default as MantraDetailPage } from "./pages/MantraDetailPage";
export { default as MantraStotraBranchesPage } from "./pages/MantraStotraBranchesPage";

// Purana & Itihasa Archive Pages
export { default as PuranaItihasaListPage } from "./pages/PuranaItihasaListPage";
export { default as PuranaItihasaFormPage } from "./pages/PuranaItihasaFormPage";
export { default as PuranaItihasaStructureTreePage } from "./pages/PuranaItihasaStructureTreePage";
export { default as PuranaItihasaShlokaListPage } from "./pages/PuranaItihasaShlokaListPage";
export { default as PuranaItihasaShlokaFormPage } from "./pages/PuranaItihasaShlokaFormPage";

// Components
export { default as RichTextEditor } from "./components/RichTextEditor";
export { default as BlogStatsCards } from "./components/BlogStatsCards";
export { default as BlogFilters } from "./components/BlogFilters";
export { default as PadapathaEditor } from "./components/PadapathaEditor";
export { default as BulkMantraModal } from "./components/BulkMantraModal";
export { default as VedaNodeModal } from "./components/VedaNodeModal";

// Services
export { blogService, default as BlogService } from "./services/blog.service";
export { VedaAdminService, default as VedaService } from "./services/veda.service";
export type { VedaQueryParams } from "./services/veda.service";
export { VedaMantraAdminService, default as VedaMantraService } from "./services/vedaMantra.service";
export {
  PuranaItihasaAdminService,
  puranaItihasaAdminService,
  default as PuranaItihasaService,
} from "./services/puranaItihasa.service";
export {
  libraryBranchService,
  DEFAULT_MANTRA_BRANCHES,
  default as LibraryBranchService,
} from "./services/libraryBranch.service";
export type { LibraryBranch } from "./services/libraryBranch.service";

// Constants & Types
export * from "./constants/blog.constants";
export * from "./types/blog.types";
export * from "./types/veda.types";
export * from "./types/puranaItihasa.types";
