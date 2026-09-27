import api from "@/services/api";
import type {
  BlogPost,
  BlogStatus,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogFilterParams,
  BlogStats,
} from "../types/blog.types";
import { BLOG_CATEGORIES } from "../constants/blog.constants";

export { BLOG_CATEGORIES };

/**
 * Helper to execute API requests with automatic endpoint alias fallback
 * Supports both standard `/admin/library/blogs` and alias `/admin/blogs`
 */
async function requestWithFallback(
  primaryPath: string,
  aliasPath: string,
  method: "get" | "post" | "put" | "patch" | "del",
  payload?: any
): Promise<any> {
  try {
    if (method === "get") return await api.get(primaryPath);
    if (method === "post") return await api.post(primaryPath, payload);
    if (method === "put") return await api.put(primaryPath, payload);
    if (method === "patch") return await api.patch(primaryPath, payload);
    if (method === "del") return await api.del(primaryPath);
  } catch (err: any) {
    // If primary path returns 404, automatically attempt alias endpoint
    if (err?.status === 404 || String(err?.message || "").includes("404")) {
      console.info(`Primary route ${primaryPath} returned 404, attempting alias route ${aliasPath}`);
      if (method === "get") return await api.get(aliasPath);
      if (method === "post") return await api.post(aliasPath, payload);
      if (method === "put") return await api.put(aliasPath, payload);
      if (method === "patch") return await api.patch(aliasPath, payload);
      if (method === "del") return await api.del(aliasPath);
    }
    throw err;
  }
}

/**
 * Service to manage blog posts for Admin Panel & Veda Library
 */
export const blogService = {
  /**
   * Get all admin blogs with filters and pagination
   */
  async getAdminBlogs(params: BlogFilterParams = {}): Promise<{
    blogs: BlogPost[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.status && params.status !== "All") query.append("status", params.status);
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.search && params.search.trim()) query.append("search", params.search.trim());
    if (typeof params.isFeatured !== "undefined" && params.isFeatured !== "") {
      query.append("isFeatured", String(params.isFeatured));
    }
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.sort) query.append("sort", params.sort);
    if (params.order) query.append("order", params.order);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const primaryPath = `/admin/library/blogs${qs}`;
    const aliasPath = `/admin/blogs${qs}`;

    const res = await requestWithFallback(primaryPath, aliasPath, "get");
    if (res && res.data) {
      return res.data;
    }
    if (Array.isArray(res)) {
      return {
        blogs: res,
        pagination: { total: res.length, page: 1, limit: res.length || 10, totalPages: 1 },
      };
    }
    throw new Error(res?.message || "Failed to fetch blog posts");
  },

  /**
   * Get single blog by ID
   */
  async getAdminBlogById(id: string): Promise<BlogPost> {
    if (!id) throw new Error("Blog ID is required");
    const primaryPath = `/admin/library/blogs/${encodeURIComponent(id)}`;
    const aliasPath = `/admin/blogs/${encodeURIComponent(id)}`;

    const res = await requestWithFallback(primaryPath, aliasPath, "get");
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Blog post not found");
  },

  /**
   * Create new blog post
   */
  async createBlog(data: CreateBlogPostInput): Promise<BlogPost> {
    const primaryPath = `/admin/library/blogs`;
    const aliasPath = `/admin/blogs`;

    const res = await requestWithFallback(primaryPath, aliasPath, "post", data);
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Failed to create blog post");
  },

  /**
   * Update existing blog post
   */
  async updateBlog(id: string, data: UpdateBlogPostInput): Promise<BlogPost> {
    if (!id) throw new Error("Blog ID is required for update");
    const primaryPath = `/admin/library/blogs/${encodeURIComponent(id)}`;
    const aliasPath = `/admin/blogs/${encodeURIComponent(id)}`;

    const res = await requestWithFallback(primaryPath, aliasPath, "put", data);
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Failed to update blog post");
  },

  /**
   * Delete blog post
   */
  async deleteBlog(id: string): Promise<boolean> {
    if (!id) throw new Error("Blog ID is required for deletion");
    const primaryPath = `/admin/library/blogs/${encodeURIComponent(id)}`;
    const aliasPath = `/admin/blogs/${encodeURIComponent(id)}`;

    const res = await requestWithFallback(primaryPath, aliasPath, "del");
    return Boolean(res?.success !== false);
  },

  /**
   * Toggle blog status (Draft | Published | Archived)
   */
  async toggleBlogStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    if (!id) throw new Error("Blog ID is required");
    const primaryPath = `/admin/library/blogs/${encodeURIComponent(id)}/status`;
    const aliasPath = `/admin/blogs/${encodeURIComponent(id)}/status`;

    const res = await requestWithFallback(primaryPath, aliasPath, "patch", { status });
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || `Failed to update blog status to ${status}`);
  },

  /**
   * Toggle featured flag
   */
  async toggleBlogFeatured(id: string, isFeatured: boolean): Promise<BlogPost> {
    if (!id) throw new Error("Blog ID is required");
    const primaryPath = `/admin/library/blogs/${encodeURIComponent(id)}/featured`;
    const aliasPath = `/admin/blogs/${encodeURIComponent(id)}/featured`;

    const res = await requestWithFallback(primaryPath, aliasPath, "patch", { isFeatured });
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || "Failed to update featured status");
  },

  /**
   * Get blog statistics
   */
  async getBlogStats(): Promise<BlogStats> {
    try {
      const primaryPath = `/admin/library/blogs/stats`;
      const aliasPath = `/admin/blogs/stats`;

      const res = await requestWithFallback(primaryPath, aliasPath, "get");
      if (res && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Could not fetch blog statistics from backend:", err);
    }

    return {
      totalBlogs: 0,
      publishedBlogs: 0,
      draftBlogs: 0,
      archivedBlogs: 0,
      totalViews: 0,
      categories: [],
    };
  },
};

export default blogService;
