import api from "@/services/api";

// --- Shared Types ---

export interface PathPurpose {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface PathSamagriItem {
  name: string;
  status?: string;
}

export interface PathFaqItem {
  question: string;
  answer: string;
}

export interface PathSeoData {
  title?: string;
  description?: string;
  keywords?: string[] | string;
}

export interface PathSankalpaFields {
  name?: boolean;
  gotra?: boolean;
  nakshatra?: boolean;
  rashi?: boolean;
  familyMembers?: boolean;
  specialSankalpa?: boolean;
  specialInstructions?: boolean;
  [key: string]: boolean | undefined;
}

// --- Recitation Formats ---

export type PathFormatType =
  | "single_session"
  | "same_day"
  | "multi_day"
  | "akhand_path"
  | "custom_request";

export const PATH_FORMAT_LABELS: Record<PathFormatType, string> = {
  single_session: "Single Session (Ek Satra)",
  same_day: "Same-Day Extended (Morning & Evening)",
  multi_day: "Multi-Day Recitation",
  akhand_path: "Akhand Path (Continuous)",
  custom_request: "Custom Request / Anushthan",
};

// --- Listing Item ---

export interface AdminPathServiceListingItem {
  id: string;
  slug: string;
  name: string;
  pathType: string;
  scripture: string;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  purposeCategory: string | null;
  purposeCategories: string[];
  availableFormats: string[];
  availableDurations: string[];
  minimumDays: number;
  recommendedDays: number;
  maximumDays: number;
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  startingPrice: number;
  formattedPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  availableLocations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPathServiceListingResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AdminPathServiceListingItem[];
}

// --- Detail Record ---

export interface AdminPathServiceDetail {
  id: string;
  slug: string;
  name: string;
  pathType: string;
  scripture: string;
  shortDescription: string | null;
  description: string | null;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  purposeCategory: string | null;
  purposeCategories: string[];
  purposeDetails: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconName: string;
    displayOrder: number;
    isActive: boolean;
  } | null;
  availableFormats: string[];
  availableDurations: string[];
  chapterStructure: string | null;
  totalChapters: number | null;
  totalSections: number | null;
  totalVerses: number | null;
  estimatedRecitationHours: number | null;
  dailyRecitationTarget: string | null;
  minimumDays: number;
  recommendedDays: number;
  maximumDays: number;
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  requiredSkills: string | null;
  dailyHours: string;
  dailyRecitationCapacity: string | null;
  startingPrice: number;
  formattedPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  availableLocations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  galleryImages: string[];
  samagri: PathSamagriItem[] | string[];
  prasad: string | null;
  sankalpaFields: PathSankalpaFields;
  seo: PathSeoData;
  faqs: PathFaqItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Filters & Sorts ---

export type PathSortBy =
  | "created-newest"
  | "created-oldest"
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "";

export interface PathServiceFilters {
  search?: string;
  purpose?: string;
  purposeId?: string;
  status?: "all" | "active" | "inactive" | string;
  isActive?: string | boolean;
  featured?: "all" | "featured" | "not featured" | string;
  isFeatured?: string | boolean;
  sortBy?: PathSortBy;
  page?: number;
  limit?: number;
}

// --- Payloads ---

export interface PathServicePayload {
  name: string;
  scripture: string;
  startingPrice: number;
  availableFormats: string[];
  slug?: string;
  pathType?: string;
  shortDescription?: string | null;
  description?: string | null;
  purposeId?: string | null;
  purposeSummary?: string | null;
  purposeCategory?: string | null;
  purposeCategories?: string[];
  availableDurations?: string[];
  chapterStructure?: string | null;
  totalChapters?: number | null;
  totalSections?: number | null;
  totalVerses?: number | null;
  estimatedRecitationHours?: number | null;
  dailyRecitationTarget?: string | null;
  minimumDays?: number;
  recommendedDays?: number;
  maximumDays?: number;
  minimumPandits?: number;
  recommendedPandits?: number;
  maximumPandits?: number;
  requiredSkills?: string | null;
  dailyHours?: string;
  dailyRecitationCapacity?: string | null;
  isKashiAvailable?: boolean;
  isRemoteAvailable?: boolean;
  availableLocations?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  bannerImage?: string | null;
  galleryImages?: string[];
  samagri?: PathSamagriItem[] | string[];
  prasad?: string | null;
  sankalpaFields?: PathSankalpaFields;
  seo?: PathSeoData;
  faqs?: PathFaqItem[];
}

// --- Service Functions ---

export const getPathServices = async (
  filters: PathServiceFilters = {},
): Promise<AdminPathServiceListingResponse> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) query.append("search", filters.search.trim());
  if (filters.purpose && filters.purpose.trim()) query.append("purpose", filters.purpose.trim());
  if (filters.purposeId && filters.purposeId.trim()) query.append("purposeId", filters.purposeId.trim());
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "")
    query.append("isActive", String(filters.isActive));
  if (typeof filters.status !== "undefined" && filters.status !== "" && filters.status !== "all")
    query.append("status", String(filters.status));
  if (typeof filters.isFeatured !== "undefined" && filters.isFeatured !== "")
    query.append("isFeatured", String(filters.isFeatured));
  if (typeof filters.featured !== "undefined" && filters.featured !== "" && filters.featured !== "all")
    query.append("featured", String(filters.featured));
  if (filters.sortBy && filters.sortBy.trim()) query.append("sortBy", filters.sortBy.trim());
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));
  const qs = query.toString() ? `?${query.toString()}` : "";
  const response = await api.get(`/admin/path-services${qs}`);
  return response as AdminPathServiceListingResponse;
};

export const getPathService = async (id: string): Promise<AdminPathServiceDetail> => {
  const response = await api.get(`/admin/path-services/${id}`);
  return response.data as AdminPathServiceDetail;
};

export const createPathService = async (
  payload: PathServicePayload,
): Promise<AdminPathServiceDetail> => {
  const response = await api.post("/admin/path-services", payload);
  return response.data as AdminPathServiceDetail;
};

export const updatePathService = async (
  id: string,
  payload: Partial<PathServicePayload>,
): Promise<AdminPathServiceDetail> => {
  const response = await api.put(`/admin/path-services/${id}`, payload);
  return response.data as AdminPathServiceDetail;
};

export const deletePathService = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/admin/path-services/${id}`);
  return response as { success: boolean; message: string };
};

export const getPathPurposes = async (): Promise<PathPurpose[]> => {
  const response = await api.get("/path-services/purposes");
  return (response.data || []) as PathPurpose[];
};

export default {
  getPathServices,
  getPathService,
  createPathService,
  updatePathService,
  deletePathService,
  getPathPurposes,
};
