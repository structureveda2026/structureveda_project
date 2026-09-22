import api from "@/services/api";

export type PujaAvailableMode = "in_person" | "remote" | "hybrid";

export interface PujaPurpose {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface AdminPujaServiceListingItem {
  id: string;
  slug: string;
  name: string;
  purpose: {
    id: string;
    name: string;
    slug: string;
  };
  startingPrice: number;
  formattedPrice: string;
  availableMode: PujaAvailableMode;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPujaServiceListingResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AdminPujaServiceListingItem[];
}

export interface PujaFaqItem {
  question: string;
  answer: string;
  q?: string;
  a?: string;
}

export interface AdminPujaServiceDetail {
  id: string;
  slug: string;
  name: string;
  eyebrow?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  deity: string;
  purposeId: string;
  purpose?: {
    id: string;
    name: string;
    slug: string;
  };
  purposeSummary?: string | null;
  availableDurations: string[];
  duration?: string | null;
  durationHours: number[];
  locationType: "temple" | "ashram" | "home" | "custom";
  location?: string | null;
  availableMode: PujaAvailableMode;
  isKashiAvailable: boolean;
  startingPrice: number;
  formattedPrice: string;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage?: string | null;
  galleryImages: string[];
  whatsIncluded: string[];
  whyPerform: string[];
  significance: string[];
  procedureSteps: string[];
  faqs: PujaFaqItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PujaServiceFilters {
  search?: string;
  purpose?: string;
  isActive?: string | boolean;
  isFeatured?: string | boolean;
  mode?: PujaAvailableMode | "";
  sortBy?:
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "created-newest"
    | "created-oldest"
    | "";
  page?: number;
  limit?: number;
}

export interface PujaServicePayload {
  name: string;
  slug: string;
  deity: string;
  startingPrice: number;
  availableMode: PujaAvailableMode;
  purposeId: string;
  eyebrow?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  purposeSummary?: string | null;
  availableDurations?: string[];
  duration?: string | null;
  durationHours?: number[];
  locationType?: "temple" | "ashram" | "home" | "custom";
  location?: string | null;
  isKashiAvailable?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  bannerImage?: string | null;
  galleryImages?: string[];
  whatsIncluded?: string[];
  whyPerform?: string[];
  significance?: string[];
  procedureSteps?: string[];
  faqs?: PujaFaqItem[];
}

/**
 * Fetch list of Puja services for Admin table with filters and pagination.
 */
const getPujaServices = async (
  filters: PujaServiceFilters = {},
): Promise<AdminPujaServiceListingResponse> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (filters.purpose && filters.purpose.trim()) {
    query.append("purpose", filters.purpose.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }
  if (typeof filters.isFeatured !== "undefined" && filters.isFeatured !== "") {
    query.append("isFeatured", String(filters.isFeatured));
  }
  if (filters.mode && filters.mode.trim()) {
    query.append("mode", filters.mode.trim());
  }
  if (filters.sortBy && filters.sortBy.trim()) {
    query.append("sortBy", filters.sortBy.trim());
  }
  if (filters.page) {
    query.append("page", String(filters.page));
  }
  if (filters.limit) {
    query.append("limit", String(filters.limit));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = await api.get(`/admin/puja-services${queryString}`);
  return response as AdminPujaServiceListingResponse;
};

/**
 * Fetch complete editable Puja service record by ID.
 */
const getPujaService = async (id: string): Promise<AdminPujaServiceDetail> => {
  const response = await api.get(`/admin/puja-services/${id}`);
  return response.data as AdminPujaServiceDetail;
};

/**
 * Create a new Puja service.
 */
const createPujaService = async (
  payload: PujaServicePayload,
): Promise<AdminPujaServiceDetail> => {
  const response = await api.post("/admin/puja-services", payload);
  return response.data as AdminPujaServiceDetail;
};

/**
 * Partial update of an existing Puja service.
 */
const updatePujaService = async (
  id: string,
  payload: Partial<PujaServicePayload>,
): Promise<AdminPujaServiceDetail> => {
  const response = await api.put(`/admin/puja-services/${id}`, payload);
  return response.data as AdminPujaServiceDetail;
};

/**
 * Soft delete (deactivate) a Puja service.
 */
const deletePujaService = async (
  id: string,
): Promise<{ success: boolean; message: string; data: { id: string; isActive: boolean } }> => {
  const response = await api.delete(`/admin/puja-services/${id}`);
  return response as { success: boolean; message: string; data: { id: string; isActive: boolean } };
};

/**
 * Fetch list of Puja purposes from public API for dynamic purpose selector.
 */
const getPurposes = async (): Promise<PujaPurpose[]> => {
  const response = await api.get("/puja-services/purposes");
  return (response.data || []) as PujaPurpose[];
};

export default {
  getPujaServices,
  getPujaService,
  createPujaService,
  updatePujaService,
  deletePujaService,
  getPurposes,
};
