import api from "@/services/api";

// --- Shared Types ---

export interface JapaPurpose {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

/**
 * Japa recitation count tier variant.
 * Matches backend ritual pricing engine (calculateJapaPriceInternal) and seed schema.
 */
export interface JapaCountVariant {
  count: number;
  startingPrice: number;
  label?: string;
  estimatedDuration?: string;
  minimumPandits?: number;
  recommendedPandits?: number;
  dailyCapacity?: number;
}

export interface JapaFaqItem {
  question: string;
  answer: string;
}

export interface JapaSeoData {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  metaTitle?: string;
  metaDescription?: string;
}

// --- Listing Item ---

export interface AdminJapaServiceListingItem {
  id: string;
  slug: string;
  name: string;
  mantra: string;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  purposeCategory: string | null;
  purposeCategories: string[];
  availableCounts: number[];
  dailyCapacityPerPandit: number;
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  startingPrice: number;
  formattedPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminJapaServiceListingResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AdminJapaServiceListingItem[];
}

// --- Detail Record ---

export interface AdminJapaServiceDetail {
  id: string;
  slug: string;
  name: string;
  mantra: string;
  mantraMeaning: string | null;
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
  availableCounts: number[];
  variants: JapaCountVariant[];
  dailyCapacityPerPandit: number;
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  requiredSkills: string | null;
  dailyHours: string;
  completionWindow: string | null;
  startingPrice: number;
  formattedPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  galleryImages: string[];
  samagri: string[];
  prasad: string | null;
  seo: JapaSeoData;
  faqs: JapaFaqItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Filters ---

export type JapaSortBy =
  | "created-newest"
  | "created-oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "";

export interface JapaServiceFilters {
  search?: string;
  purpose?: string;
  isActive?: string | boolean;
  isFeatured?: string | boolean;
  sortBy?: JapaSortBy;
  page?: number;
  limit?: number;
}

// --- Payload ---

export interface JapaServicePayload {
  name: string;
  mantra: string;
  startingPrice: number;
  slug?: string;
  mantraMeaning?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  purposeId?: string | null;
  purposeSummary?: string | null;
  purposeCategory?: string | null;
  purposeCategories?: string[];
  availableCounts?: number[];
  variants?: JapaCountVariant[];
  dailyCapacityPerPandit?: number;
  minimumPandits?: number;
  recommendedPandits?: number;
  maximumPandits?: number;
  requiredSkills?: string | null;
  dailyHours?: string;
  completionWindow?: string | null;
  isKashiAvailable?: boolean;
  isRemoteAvailable?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  bannerImage?: string | null;
  galleryImages?: string[];
  samagri?: string[];
  prasad?: string | null;
  seo?: JapaSeoData;
  faqs?: JapaFaqItem[];
}

// --- Service Functions ---

export const getJapaServices = async (
  filters: JapaServiceFilters = {},
): Promise<AdminJapaServiceListingResponse> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) query.append("search", filters.search.trim());
  if (filters.purpose && filters.purpose.trim()) query.append("purpose", filters.purpose.trim());
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "")
    query.append("isActive", String(filters.isActive));
  if (typeof filters.isFeatured !== "undefined" && filters.isFeatured !== "")
    query.append("isFeatured", String(filters.isFeatured));
  if (filters.sortBy && filters.sortBy.trim()) query.append("sortBy", filters.sortBy.trim());
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));
  const qs = query.toString() ? `?${query.toString()}` : "";
  const response = await api.get(`/admin/japa-services${qs}`);
  return response as AdminJapaServiceListingResponse;
};

export const getJapaService = async (id: string): Promise<AdminJapaServiceDetail> => {
  const response = await api.get(`/admin/japa-services/${id}`);
  return response.data as AdminJapaServiceDetail;
};

export const createJapaService = async (
  payload: JapaServicePayload,
): Promise<AdminJapaServiceDetail> => {
  const response = await api.post("/admin/japa-services", payload);
  return response.data as AdminJapaServiceDetail;
};

export const updateJapaService = async (
  id: string,
  payload: Partial<JapaServicePayload>,
): Promise<AdminJapaServiceDetail> => {
  const response = await api.put(`/admin/japa-services/${id}`, payload);
  return response.data as AdminJapaServiceDetail;
};

export const deleteJapaService = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/admin/japa-services/${id}`);
  return response as { success: boolean; message: string };
};

export const getJapaPurposes = async (): Promise<JapaPurpose[]> => {
  const response = await api.get("/japa-services/purposes");
  return (response.data || []) as JapaPurpose[];
};

export default {
  getJapaServices,
  getJapaService,
  createJapaService,
  updateJapaService,
  deleteJapaService,
  getJapaPurposes,
};
