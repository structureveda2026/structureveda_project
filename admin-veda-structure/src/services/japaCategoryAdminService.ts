import api from "@/services/api";
import React from "react";
import {
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
} from "lucide-react";

export const SUPPORTED_CATEGORY_ICONS = [
  { name: "Sparkles", label: "Sparkles (Divine & Blessing)" },
  { name: "Flame", label: "Flame (Sacred Agni & Energy)" },
  { name: "Coins", label: "Coins (Wealth & Lakshmi)" },
  { name: "ShieldCheck", label: "ShieldCheck (Protection & Raksha)" },
  { name: "Sun", label: "Sun (Surya, Gayatri & Vitality)" },
  { name: "Compass", label: "Compass (Guidance & Focus)" },
  { name: "Heart", label: "Heart (Bhakti & Harmony)" },
  { name: "Scroll", label: "Scroll (Vedic Chanting & Chandas)" },
  { name: "BookOpen", label: "BookOpen (Mantra Vidya & Wisdom)" },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
};

export interface AdminJapaCategory {
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

export interface JapaCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface JapaCategoryFilters {
  search?: string;
  isActive?: string | boolean;
}

export interface JapaCategoryListResponse {
  success: boolean;
  count: number;
  data: AdminJapaCategory[];
}

/**
 * Fetch all Japa categories for admin view (both active & inactive).
 */
export const getCategories = async (
  filters: JapaCategoryFilters = {}
): Promise<AdminJapaCategory[]> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = (await api.get(
    `/admin/japa-categories${queryString}`
  )) as JapaCategoryListResponse;

  return response.data || [];
};

/**
 * Fetch a single Japa category by ID for admin detail or edit form.
 */
export const getCategoryById = async (
  id: string
): Promise<AdminJapaCategory> => {
  const response = (await api.get(`/admin/japa-categories/${id}`)) as {
    success: boolean;
    data: AdminJapaCategory;
  };
  return response.data;
};

/**
 * Create a new Japa category.
 */
export const createCategory = async (
  payload: JapaCategoryPayload
): Promise<AdminJapaCategory> => {
  const response = (await api.post("/admin/japa-categories", payload)) as {
    success: boolean;
    message: string;
    data: AdminJapaCategory;
  };
  return response.data;
};

/**
 * Update an existing Japa category.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<JapaCategoryPayload>
): Promise<AdminJapaCategory> => {
  const response = (await api.put(
    `/admin/japa-categories/${id}`,
    payload
  )) as {
    success: boolean;
    message: string;
    data: AdminJapaCategory;
  };
  return response.data;
};

/**
 * Soft deactivate a Japa category.
 * Existing Japa services will remain untouched.
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; slug: string; name: string; isActive: boolean };
}> => {
  const response = (await api.delete(`/admin/japa-categories/${id}`)) as {
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
