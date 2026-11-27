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

  async deleteSection(id: string): Promise<boolean> {
    const res = await api.delete(`/admin/library/sections/${id}`);
    return res.success;
  },
};

export default LibrarySectionService;
