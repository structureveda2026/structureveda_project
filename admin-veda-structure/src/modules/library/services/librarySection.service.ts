import api from "../../../services/api";

export interface LibrarySectionItem {
  id: string;
  slug: string;
  name: string;
  enName?: string;
  label: string;
  labelHi?: string;
  path: string;
  adminPath: string;
  categorySlug?: string;
  orderIndex?: number;
  status?: string;
  isPreset?: boolean;
}

export const LibrarySectionService = {
  async getSections(): Promise<LibrarySectionItem[]> {
    try {
      const res = await api.get("/library/sections");
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch library sections from API", e);
    }
    return [];
  },

  async createSection(data: Partial<LibrarySectionItem>): Promise<LibrarySectionItem> {
    const res = await api.post("/admin/library/sections", data);
    return res.data;
  },

  async deleteSection(identifier: string): Promise<boolean> {
    // Try deleting by slug first, then by ID
    try {
      const res = await api.delete(`/admin/library/sections/${identifier}`);
      if (res.success) return true;
    } catch (e) {
      // fallback: try with section- prefix
      try {
        const res = await api.delete(`/admin/library/sections/section-${identifier}`);
        if (res.success) return true;
      } catch (e2) {
        console.warn("Delete section failed for identifier:", identifier, e2);
        throw e2;
      }
    }
    throw new Error(`Failed to delete library section: ${identifier}`);
  },
};

export default LibrarySectionService;
