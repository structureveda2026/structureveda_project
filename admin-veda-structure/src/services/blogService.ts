import api from "./api";
import type {
  BlogPost,
  BlogStatus,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogFilterParams,
  BlogStats,
} from "@/types";

// Default categories for Veda Library blogs
export const BLOG_CATEGORIES = [
  "Vedic Astrology",
  "Puja & Rituals",
  "Vastu Shastra",
  "Spirituality & Meditation",
  "Ayurveda & Health",
  "Festivals & Fasting",
  "Kundali & Planetary Remedies",
  "Mantras & Stotrams",
  "Sanatan Dharma",
];

// Fallback mock blogs in case backend server is initializing
const MOCK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "benefits-of-rudrabhishek-puja",
    title: "The Divine Power of Rudrabhishek Puja: Complete Guide and Benefits",
    subtitle: "Discover how performing Rudrabhishek brings peace, health, and spiritual growth.",
    excerpt:
      "Rudrabhishek is one of the most powerful Vedic rituals dedicated to Lord Shiva. Learn about the holy mantras, offerings, and the immense cosmic blessings it brings to your life.",
    content: `<h2>Introduction to Rudrabhishek</h2>
<p>Rudrabhishek is an ancient Vedic ritual performed to invoke the divine blessings of <strong>Lord Shiva</strong>. In Sanskrit, <em>Rudra</em> is one of the revered names of Shiva signifying the transformer of sorrow, while <em>Abhishek</em> signifies the sacred ceremonial bathing of the Shiva Linga with holy offerings.</p>

<h3>Key Offerings & Their Significance</h3>
<ul>
  <li><strong>Panchamrit (Milk, Curd, Ghee, Honey, Sugar):</strong> Purifies the physical aura and brings prosperity.</li>
  <li><strong>Ganga Jal:</strong> Cleanses negative karmas and bestows spiritual serenity.</li>
  <li><strong>Bael Leaves (Bilva Patra):</strong> Pleases Mahadev and destroys lifetime sins.</li>
  <li><strong>Sugarcane Juice:</strong> Attracts wealth, success, and positive vibrations.</li>
</ul>

<h3>Spiritual & Material Benefits</h3>
<p>Performing Rudrabhishek during auspicious times like <strong>Maha Shivratri</strong>, <strong>Shravan Somwar</strong>, or monthly <strong>Pradosh Vrat</strong> neutralizes malefic planetary influences (especially Saturn and Rahu) and brings profound peace to family life.</p>
<blockquote>"Om Namah Shivaya – Chanting the sacred panchakshari mantra during abhishek amplifies the positive energy manifold."</blockquote>`,
    featuredImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    author: "Acharya Shastri",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    category: "Puja & Rituals",
    tags: ["Shiva", "Rudrabhishek", "Puja", "Spiritual Growth", "Mantras"],
    status: "Published",
    isFeatured: true,
    readTime: "6 min read",
    viewsCount: 1420,
    metaTitle: "Divine Power of Rudrabhishek Puja - Complete Guide & Benefits",
    metaDescription: "Learn everything about Rudrabhishek Puja ritual, Shiva Linga abhishek items, vidhi, and astrological benefits for prosperity.",
    metaKeywords: ["Rudrabhishek", "Lord Shiva", "Vedic Puja", "Shravan", "Maha Shivratri"],
    publishedAt: "2026-09-18T10:00:00Z",
    createdAt: "2026-09-18T09:30:00Z",
    updatedAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "blog-2",
    slug: "navgrah-shanti-and-planetary-remedies",
    title: "Navgrah Shanti: Understanding Planetary Influences and Effective Remedies",
    subtitle: "Harmonize the nine cosmic energies influencing your karma and destiny.",
    excerpt:
      "Astrology reveals that the 9 celestial bodies govern different dimensions of life. Discover how Navgrah Shanti rituals and simple daily habits can bring harmony.",
    content: `<h2>What is Navgrah Shanti?</h2>
<p>In Vedic Astrology (Jyotish), our destiny and everyday experiences are deeply connected with the nine cosmic influencers known as the <strong>Navgrahas</strong>: Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani, Rahu, and Ketu.</p>

<h3>Recognizing Planetary Afflictions</h3>
<p>When a planet is afflicted or placed in an unfavorable house in your Janam Kundali, it can create specific hurdles in career, relationships, or health.</p>
<ol>
  <li><strong>Surya (Sun):</strong> Affects confidence, government relations, and leadership vitality.</li>
  <li><strong>Chandra (Moon):</strong> Influences mental tranquility, emotions, and peace of mind.</li>
  <li><strong>Mangal (Mars):</strong> Energy, courage, property, and marital harmony (Manglik Dosha).</li>
  <li><strong>Shani (Saturn):</strong> Discipline, hard work, life lessons, and longevity (Sade Sati).</li>
</ol>`,
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    author: "Dr. Arvind Joshi",
    category: "Vedic Astrology",
    tags: ["Navgrah", "Kundali", "Jyotish", "Planets", "Astrology"],
    status: "Published",
    isFeatured: true,
    readTime: "7 min read",
    viewsCount: 890,
    publishedAt: "2026-09-15T14:30:00Z",
    createdAt: "2026-09-15T14:00:00Z",
    updatedAt: "2026-09-15T14:30:00Z",
  },
  {
    id: "blog-3",
    slug: "vastu-tips-for-home-entrance",
    title: "10 Essential Vastu Shastra Tips for Positive Energy at Your Main Entrance",
    subtitle: "Transform your home doorway into a magnet for prosperity and peace.",
    excerpt:
      "The main door of a house is considered the portal through which cosmic prana and wealth enter. Optimize it with these easy, proven Vastu guidelines.",
    content: `<h2>The Importance of the Main Door in Vastu</h2>
<p>According to ancient <strong>Vastu Shastra</strong> texts, the main entrance (<em>Mahadwara</em>) represents the mouth of the home through which cosmic energy (Prana) and wealth flow into the living space.</p>
<h3>Essential Guidelines:</h3>
<ul>
  <li>Keep the entrance bright, clutter-free, and well-illuminated.</li>
  <li>Avoid placing mirrors directly facing the front doorway.</li>
  <li>Place auspicious symbols like the Swastika, Om, or Kalash.</li>
  <li>Ensure the door opens smoothly in a clockwise direction without creaking sounds.</li>
</ul>`,
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    author: "Veda Structure Team",
    category: "Vastu Shastra",
    tags: ["Vastu", "Home Energy", "Positive Vibrations", "Prosperity"],
    status: "Draft",
    isFeatured: false,
    readTime: "4 min read",
    viewsCount: 310,
    createdAt: "2026-09-20T11:00:00Z",
    updatedAt: "2026-09-20T11:00:00Z",
  },
];

let mockStore = [...MOCK_BLOGS];

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
    try {
      const query = new URLSearchParams();
      if (params.status && params.status !== "All") query.append("status", params.status);
      if (params.category && params.category !== "All") query.append("category", params.category);
      if (params.search) query.append("search", params.search);
      if (typeof params.isFeatured !== "undefined") query.append("isFeatured", String(params.isFeatured));
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));
      if (params.sort) query.append("sort", params.sort);
      if (params.order) query.append("order", params.order);

      const res = await api.get(`/admin/blogs?${query.toString()}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, using in-memory mock store:", err);
    }

    // Client-side fallback filter
    let filtered = [...mockStore];
    if (params.status && params.status !== "All") {
      filtered = filtered.filter((b) => b.status === params.status);
    }
    if (params.category && params.category !== "All") {
      filtered = filtered.filter((b) => b.category === params.category);
    }
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.excerpt?.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term),
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      blogs: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  /**
   * Get single blog by ID
   */
  async getAdminBlogById(id: string): Promise<BlogPost> {
    try {
      const res = await api.get(`/admin/blogs/${id}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, querying local store:", err);
    }

    const found = mockStore.find((b) => b.id === id || b.slug === id);
    if (found) return found;
    throw new Error("Blog post not found");
  },

  /**
   * Create new blog post
   */
  async createBlog(data: CreateBlogPostInput): Promise<BlogPost> {
    try {
      const res = await api.post("/admin/blogs", data);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, saving to local store:", err);
    }

    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      slug: data.slug || data.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
      title: data.title,
      subtitle: data.subtitle || null,
      excerpt: data.excerpt || null,
      content: data.content,
      featuredImage: data.featuredImage || null,
      author: data.author || "Veda Structure Team",
      authorAvatar: data.authorAvatar || null,
      category: data.category || "Vedic Wisdom",
      tags: data.tags || [],
      status: data.status || "Draft",
      isFeatured: Boolean(data.isFeatured),
      readTime: data.readTime || "5 min read",
      viewsCount: 0,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || [],
      publishedAt: data.status === "Published" ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore = [newBlog, ...mockStore];
    return newBlog;
  },

  /**
   * Update existing blog post
   */
  async updateBlog(id: string, data: UpdateBlogPostInput): Promise<BlogPost> {
    try {
      const res = await api.put(`/admin/blogs/${id}`, data);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, updating local store:", err);
    }

    const index = mockStore.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockStore[index] = {
        ...mockStore[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return mockStore[index];
    }
    throw new Error("Blog post not found for update");
  },

  /**
   * Delete blog post
   */
  async deleteBlog(id: string): Promise<boolean> {
    try {
      const res = await api.del(`/admin/blogs/${id}`);
      if (res.success) return true;
    } catch (err) {
      console.warn("Backend API unavailable, deleting from local store:", err);
    }

    mockStore = mockStore.filter((b) => b.id !== id);
    return true;
  },

  /**
   * Toggle blog status
   */
  async toggleBlogStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    try {
      const res = await api.patch(`/admin/blogs/${id}/status`, { status });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, updating status in local store:", err);
    }

    const index = mockStore.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockStore[index].status = status;
      if (status === "Published" && !mockStore[index].publishedAt) {
        mockStore[index].publishedAt = new Date().toISOString();
      }
      return mockStore[index];
    }
    throw new Error("Blog post not found");
  },

  /**
   * Toggle featured flag
   */
  async toggleBlogFeatured(id: string, isFeatured: boolean): Promise<BlogPost> {
    try {
      const res = await api.patch(`/admin/blogs/${id}/featured`, { isFeatured });
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, updating featured flag in local store:", err);
    }

    const index = mockStore.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockStore[index].isFeatured = isFeatured;
      return mockStore[index];
    }
    throw new Error("Blog post not found");
  },

  /**
   * Get blog statistics
   */
  async getBlogStats(): Promise<BlogStats> {
    try {
      const res = await api.get("/admin/blogs/stats");
      if (res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API unavailable, calculating from local store:", err);
    }

    const totalBlogs = mockStore.length;
    const publishedBlogs = mockStore.filter((b) => b.status === "Published").length;
    const draftBlogs = mockStore.filter((b) => b.status === "Draft").length;
    const archivedBlogs = mockStore.filter((b) => b.status === "Archived").length;
    const totalViews = mockStore.reduce((sum, b) => sum + (b.viewsCount || 0), 0);

    const catMap: Record<string, number> = {};
    mockStore.forEach((b) => {
      catMap[b.category] = (catMap[b.category] || 0) + 1;
    });

    const categories = Object.entries(catMap).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      archivedBlogs,
      totalViews,
      categories,
    };
  },
};

export default blogService;
