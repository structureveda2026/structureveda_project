import api from "@/services/api";

// --- Shared Types ---

export interface HomaPurpose {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface HomaSamagriItem {
  name: string;
  status?: string;
}

export interface HomaFaqItem {
  question: string;
  answer: string;
}

export interface HomaSeoData {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface HomaSankalpaFields {
  gotra?: boolean;
  nakshatra?: boolean;
  rashi?: boolean;
  deity?: boolean;
  specialInstructions?: boolean;
  [key: string]: boolean | undefined;
}

// --- Listing Item ---

export interface AdminHomaServiceListingItem {
  id: string;
  slug: string;
  name: string;
  homaType: string;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  purposeCategory: string | null;
  purposeCategories: string[];
  availableHavanCounts: number[];
  availableDays: number[];
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  startingPrice: number;
  formattedPrice: string;
  basePrice: number;
  perHavanPrice: number;
  perDayPrice: number;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  availableLocations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminHomaServiceListingResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AdminHomaServiceListingItem[];
}

// --- Detail Record ---

export interface AdminHomaServiceDetail {
  id: string;
  slug: string;
  name: string;
  homaType: string;
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
  availableHavanCounts: number[];
  availableDays: number[];
  minimumPandits: number;
  recommendedPandits: number;
  maximumPandits: number;
  requiredSkills: string | null;
  dailyHours: string;
  havanCapacityPerPandit: string | null;
  startingPrice: number;
  formattedPrice: string;
  basePrice: number;
  perHavanPrice: number;
  perDayPrice: number;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  availableLocations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  galleryImages: string[];
  samagri: HomaSamagriItem[] | string[];
  prasad: string | null;
  sankalpaFields: HomaSankalpaFields;
  seo: HomaSeoData;
  faqs: HomaFaqItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Filters ---

export type HomaSortBy =
  | "created-newest"
  | "created-oldest"
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "";

export interface HomaServiceFilters {
  search?: string;
  purpose?: string;
  status?: "all" | "active" | "inactive" | string;
  isActive?: string | boolean;
  featured?: "all" | "featured" | "not featured" | string;
  isFeatured?: string | boolean;
  sortBy?: HomaSortBy;
  page?: number;
  limit?: number;
}

// --- Payload ---

export interface HomaServicePayload {
  name: string;
  basePrice: number;
  availableHavanCounts: number[];
  availableDays: number[];
  slug?: string;
  homaType?: string;
  shortDescription?: string | null;
  description?: string | null;
  purposeId?: string | null;
  purposeSummary?: string | null;
  purposeCategory?: string | null;
  purposeCategories?: string[];
  minimumPandits?: number;
  recommendedPandits?: number;
  maximumPandits?: number;
  requiredSkills?: string | null;
  dailyHours?: string;
  havanCapacityPerPandit?: string | null;
  perHavanPrice?: number;
  perDayPrice?: number;
  isKashiAvailable?: boolean;
  isRemoteAvailable?: boolean;
  availableLocations?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  bannerImage?: string | null;
  galleryImages?: string[];
  samagri?: HomaSamagriItem[] | string[];
  prasad?: string | null;
  sankalpaFields?: HomaSankalpaFields;
  seo?: HomaSeoData;
  faqs?: HomaFaqItem[];
}

// --- Service Functions ---

export const getHomaServices = async (
  filters: HomaServiceFilters = {},
): Promise<AdminHomaServiceListingResponse> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) query.append("search", filters.search.trim());
  if (filters.purpose && filters.purpose.trim()) query.append("purpose", filters.purpose.trim());
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
  const response = await api.get(`/admin/homa-services${qs}`);
  return response as AdminHomaServiceListingResponse;
};

export const getHomaService = async (id: string): Promise<AdminHomaServiceDetail> => {
  const response = await api.get(`/admin/homa-services/${id}`);
  return response.data as AdminHomaServiceDetail;
};

export const createHomaService = async (
  payload: HomaServicePayload,
): Promise<AdminHomaServiceDetail> => {
  const response = await api.post("/admin/homa-services", payload);
  return response.data as AdminHomaServiceDetail;
};

export const updateHomaService = async (
  id: string,
  payload: Partial<HomaServicePayload>,
): Promise<AdminHomaServiceDetail> => {
  const response = await api.put(`/admin/homa-services/${id}`, payload);
  return response.data as AdminHomaServiceDetail;
};

export const deleteHomaService = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/admin/homa-services/${id}`);
  return response as { success: boolean; message: string };
};

export const getHomaPurposes = async (): Promise<HomaPurpose[]> => {
  const response = await api.get("/homa-services/purposes");
  return (response.data || []) as HomaPurpose[];
};

export default {
  getHomaServices,
  getHomaService,
  createHomaService,
  updateHomaService,
  deleteHomaService,
  getHomaPurposes,
};
