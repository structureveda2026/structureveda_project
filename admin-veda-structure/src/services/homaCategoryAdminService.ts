import api from "@/services/api";
import React from "react";
import {
  Flame,
  Sparkles,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
  Layers,
} from "lucide-react";

export const SUPPORTED_CATEGORY_ICONS = [
  { name: "Flame", label: "Flame (Sacred Agni & Homa Fire)" },
  { name: "Sparkles", label: "Sparkles (Divine Blessings & Auspiciousness)" },
  { name: "Coins", label: "Coins (Wealth, Lakshmi & Kubera)" },
  { name: "ShieldCheck", label: "ShieldCheck (Protection, Durga & Raksha)" },
  { name: "Sun", label: "Sun (Surya, Navagraha & Vitality)" },
  { name: "Compass", label: "Compass (Vastu, Direction & Harmonization)" },
  { name: "Heart", label: "Heart (Ayushya, Health & Wellbeing)" },
  { name: "Scroll", label: "Scroll (Vedic Mantras & Srauta Tradition)" },
  { name: "BookOpen", label: "BookOpen (Sacred Vidya & Shastras)" },
  { name: "Layers", label: "Layers (Multiple Ahutis & Rituals)" },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Sparkles,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
  Layers,
};

export interface AdminHomaCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomaCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface HomaCategoryFilters {
  search?: string;
  isActive?: string | boolean;
  status?: string;
}

export interface HomaCategoryListResponse {
  success: boolean;
  count: number;
  data: AdminHomaCategory[];
}

/**
 * Fetch all Homa categories for admin view (both active & inactive).
 */
export const getCategories = async (
  filters: HomaCategoryFilters = {}
): Promise<AdminHomaCategory[]> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }
  if (typeof filters.status !== "undefined" && filters.status !== "") {
    query.append("status", String(filters.status));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = (await api.get(
    `/admin/homa-categories${queryString}`
  )) as HomaCategoryListResponse;

  return response.data || [];
};

/**
 * Fetch a single Homa category by ID for admin detail or edit form.
 */
export const getCategoryById = async (
  id: string
): Promise<AdminHomaCategory> => {
  const response = (await api.get(`/admin/homa-categories/${id}`)) as {
    success: boolean;
    data: AdminHomaCategory;
  };
  return response.data;
};

/**
 * Create a new Homa category.
 */
export const createCategory = async (
  payload: HomaCategoryPayload
): Promise<AdminHomaCategory> => {
  const response = (await api.post("/admin/homa-categories", payload)) as {
    success: boolean;
    message: string;
    data: AdminHomaCategory;
  };
  return response.data;
};

/**
 * Update an existing Homa category.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<HomaCategoryPayload>
): Promise<AdminHomaCategory> => {
  const response = (await api.put(
    `/admin/homa-categories/${id}`,
    payload
  )) as {
    success: boolean;
    message: string;
    data: AdminHomaCategory;
  };
  return response.data;
};

/**
 * Soft deactivate a Homa category.
 * Existing Homa services will remain untouched.
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; slug: string; name: string; isActive: boolean };
}> => {
  const response = (await api.delete(`/admin/homa-categories/${id}`)) as {
    success: boolean;
    message: string;
    data: { id: string; slug: string; name: string; isActive: boolean };
  };
  return response;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
