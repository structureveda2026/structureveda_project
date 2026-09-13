import api from "@/services/api";

export interface PujaPackageData {
  id?: string;
  pujaId?: string;
  name: string;
  price: number;
  maxDevotees: number;
  description?: string | null;
  features?: string[];
  isDefault?: boolean;
}

export type UpcomingPujaStatus =
  | "Draft"
  | "Published"
  | "Booking Closed"
  | "Completed"
  | "Cancelled";

export interface UpcomingPujaData {
  id: string;
  name: string;
  slug: string;
  eyebrow?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  bannerImage?: string | null;
  galleryImages?: string[];
  location?: string | null;
  temple?: string | null;
  deity?: string | null;
  category?: string | null;
  occasion?: string | null;
  purposeCategories?: string[];
  ceremonyDate: string;
  startDateTime: string;
  bookingCloseAt?: string | null;
  totalCapacity: number;
  bookedCount: number;
  isFeatured: boolean;
  remoteAvailable: boolean;
  benefits?: string[];
  significance?: string[];
  whatsIncluded?: string[];
  procedureSteps?: string[];
  status: UpcomingPujaStatus;
  packages?: PujaPackageData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpcomingPujaFilters {
  status?: string;
  category?: string;
  occasion?: string;
  isFeatured?: string | boolean;
  search?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface UpcomingPujaPayload {
  name: string;
  slug?: string;
  eyebrow?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  bannerImage?: string | null;
  galleryImages?: string[];
  location?: string | null;
  temple?: string | null;
  deity?: string | null;
  category?: string | null;
  occasion?: string | null;
  purposeCategories?: string[];
  ceremonyDate: string;
  startDateTime: string;
  bookingCloseAt?: string | null;
  totalCapacity: number;
  isFeatured?: boolean;
  remoteAvailable?: boolean;
  benefits?: string[];
  significance?: string[];
  whatsIncluded?: string[];
  procedureSteps?: string[];
  status?: UpcomingPujaStatus;
  packages?: {
    id?: string;
    name: string;
    price: number;
    maxDevotees: number;
    description?: string | null;
    features?: string[];
    isDefault?: boolean;
  }[];
}

const getUpcomingPujas = async (filters: UpcomingPujaFilters = {}) => {
  const query = new URLSearchParams();
  if (filters.status) query.append("status", filters.status);
  if (filters.category) query.append("category", filters.category);
  if (filters.occasion) query.append("occasion", filters.occasion);
  if (typeof filters.isFeatured !== "undefined" && filters.isFeatured !== "") {
    query.append("isFeatured", String(filters.isFeatured));
  }
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (filters.sort) query.append("sort", filters.sort);
  if (filters.order) query.append("order", filters.order);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = await api.get(`/admin/upcoming-pujas${queryString}`);
  return response.data as UpcomingPujaData[];
};

const getUpcomingPuja = async (id: string) => {
  const response = await api.get(`/admin/upcoming-pujas/${id}`);
  return response.data as UpcomingPujaData;
};

const createUpcomingPuja = async (payload: UpcomingPujaPayload) => {
  const response = await api.post("/admin/upcoming-pujas", payload);
  return response.data as UpcomingPujaData;
};

const updateUpcomingPuja = async (id: string, payload: Partial<UpcomingPujaPayload>) => {
  const response = await api.put(`/admin/upcoming-pujas/${id}`, payload);
  return response.data as UpcomingPujaData;
};

const deleteUpcomingPuja = async (id: string) => {
  const response = await api.delete(`/admin/upcoming-pujas/${id}`);
  return response;
};

export default {
  getUpcomingPujas,
  getUpcomingPuja,
  createUpcomingPuja,
  updateUpcomingPuja,
  deleteUpcomingPuja,
};
