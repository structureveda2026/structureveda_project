import api from "@/services/api";
import React from "react";
import {
  Sparkles,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Flame,
  Scroll,
  BookOpen,
} from "lucide-react";

export const SUPPORTED_CATEGORY_ICONS = [
  { name: "Sparkles", label: "Sparkles (Divine & Blessing)" },
  { name: "Coins", label: "Coins (Wealth & Lakshmi)" },
  { name: "ShieldCheck", label: "ShieldCheck (Protection & Suraksha)" },
  { name: "Sun", label: "Sun (Surya & Vitality)" },
  { name: "Compass", label: "Compass (Guidance & Vastu)" },
  { name: "Heart", label: "Heart (Harmony & Relationships)" },
  { name: "Flame", label: "Flame (Yagya & Agni)" },
  { name: "Scroll", label: "Scroll (Vedic Scripture)" },
  { name: "BookOpen", label: "BookOpen (Wisdom & Saraswati)" },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Flame,
  Scroll,
  BookOpen,
};

export interface AdminPujaCategory {
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

export interface PujaCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface PujaCategoryFilters {
  search?: string;
  isActive?: string | boolean;
}

export interface PujaCategoryListResponse {
  success: boolean;
  count: number;
  data: AdminPujaCategory[];
}

/**
 * Fetch all Puja categories for admin view (both active & inactive).
 */
export const getCategories = async (
  filters: PujaCategoryFilters = {}
): Promise<AdminPujaCategory[]> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = (await api.get(
    `/admin/puja-categories${queryString}`
  )) as PujaCategoryListResponse;

  return response.data || [];
};

/**
 * Fetch a single category by ID for admin detail or edit form.
 */
export const getCategoryById = async (
  id: string
): Promise<AdminPujaCategory> => {
  const response = (await api.get(`/admin/puja-categories/${id}`)) as {
    success: boolean;
    data: AdminPujaCategory;
  };
  return response.data;
};

/**
 * Create a new Puja category.
 */
export const createCategory = async (
  payload: PujaCategoryPayload
): Promise<AdminPujaCategory> => {
  const response = (await api.post("/admin/puja-categories", payload)) as {
    success: boolean;
    message: string;
    data: AdminPujaCategory;
  };
  return response.data;
};

/**
 * Update an existing Puja category.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<PujaCategoryPayload>
): Promise<AdminPujaCategory> => {
  const response = (await api.put(
    `/admin/puja-categories/${id}`,
    payload
  )) as {
    success: boolean;
    message: string;
    data: AdminPujaCategory;
  };
  return response.data;
};

/**
 * Soft deactivate a Puja category.
 * Existing Puja services will remain untouched.
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; slug: string; name: string; isActive: boolean };
}> => {
  const response = (await api.delete(`/admin/puja-categories/${id}`)) as {
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
