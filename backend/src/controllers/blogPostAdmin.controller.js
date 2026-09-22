import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { BlogPost } from "../models/index.js";

const VALID_STATUSES = ["Draft", "Published", "Archived"];

export const sanitizeSlug = (str) => {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * GET /api/admin/blogs
 * List all blogs with pagination, filtering & search
 */
export const getAdminBlogPosts = async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      isFeatured,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
    } = req.query;

    const where = {};

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { author: { [Op.iLike]: searchTerm } },
        { excerpt: { [Op.iLike]: searchTerm } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const validSortFields = [
      "createdAt",
      "updatedAt",
      "publishedAt",
      "title",
      "viewsCount",
      "category",
      "status",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows: blogs } = await BlogPost.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Blog posts retrieved successfully",
      data: {
        blogs,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum) || 1,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAdminBlogPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/blogs/stats
 * Get quick dashboard metrics for blogs
 */
export const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await BlogPost.count();
    const publishedBlogs = await BlogPost.count({ where: { status: "Published" } });
    const draftBlogs = await BlogPost.count({ where: { status: "Draft" } });
    const archivedBlogs = await BlogPost.count({ where: { status: "Archived" } });
    const totalViewsResult = await BlogPost.sum("views_count");
    const totalViews = totalViewsResult || 0;

    // Categories aggregate
    const categoriesCount = await BlogPost.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["category"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs,
        totalViews,
        categories: categoriesCount,
      },
    });
  } catch (error) {
    console.error("Error in getBlogStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog statistics",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/blogs/:id
 * Get single blog post by ID
 */
export const getAdminBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error in getAdminBlogPostById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve blog post",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/blogs
 * Create a new blog post
 */
export const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      featuredImage,
      author,
      authorAvatar,
      category,
      tags,
      status = "Draft",
      isFeatured = false,
      readTime,
      metaTitle,
      metaDescription,
      metaKeywords,
      publishedAt,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Auto-generate or sanitize slug
    let finalSlug = sanitizeSlug(customSlug || title);
    if (!finalSlug) {
      finalSlug = `post-${Date.now()}`;
    }

    // Check slug uniqueness
    const existingSlug = await BlogPost.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Calculate auto read time if not provided
    let finalReadTime = readTime;
    if (!finalReadTime || !finalReadTime.trim()) {
      const wordCount = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      finalReadTime = `${minutes} min read`;
    }

    // Determine publishedAt
    let finalPublishedAt = publishedAt || null;
    if (status === "Published" && !finalPublishedAt) {
      finalPublishedAt = new Date();
    }

    const blog = await BlogPost.create({
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle ? subtitle.trim() : null,
      excerpt: excerpt ? excerpt.trim() : null,
      content,
      featuredImage: featuredImage || null,
      author: author ? author.trim() : "Veda Structure Team",
      authorAvatar: authorAvatar || null,
      category: category ? category.trim() : "Vedic Wisdom",
      tags: Array.isArray(tags) ? tags : [],
      status: VALID_STATUSES.includes(status) ? status : "Draft",
      isFeatured: Boolean(isFeatured),
      readTime: finalReadTime,
      viewsCount: 0,
      metaTitle: metaTitle ? metaTitle.trim() : null,
      metaDescription: metaDescription ? metaDescription.trim() : null,
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
      publishedAt: finalPublishedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error in createBlogPost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog post",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/blogs/:id
 * Update an existing blog post
 */
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogPost.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      featuredImage,
      author,
      authorAvatar,
      category,
      tags,
      status,
      isFeatured,
      readTime,
      metaTitle,
      metaDescription,
      metaKeywords,
      publishedAt,
    } = req.body;

    let finalSlug = blog.slug;
    if (customSlug && customSlug.trim()) {
      const sanitized = sanitizeSlug(customSlug);
      if (sanitized !== blog.slug) {
        const slugExists = await BlogPost.findOne({
          where: { slug: sanitized, id: { [Op.ne]: id } },
        });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: "Slug already exists. Please choose a unique slug.",
          });
        }
        finalSlug = sanitized;
      }
    }

    let finalPublishedAt = blog.publishedAt;
    if (publishedAt) {
      finalPublishedAt = new Date(publishedAt);
    } else if (status === "Published" && !blog.publishedAt) {
      finalPublishedAt = new Date();
    }

    await blog.update({
      title: typeof title !== "undefined" ? title.trim() : blog.title,
      slug: finalSlug,
      subtitle: typeof subtitle !== "undefined" ? (subtitle ? subtitle.trim() : null) : blog.subtitle,
      excerpt: typeof excerpt !== "undefined" ? (excerpt ? excerpt.trim() : null) : blog.excerpt,
      content: typeof content !== "undefined" ? content : blog.content,
      featuredImage: typeof featuredImage !== "undefined" ? featuredImage : blog.featuredImage,
      author: typeof author !== "undefined" ? author.trim() : blog.author,
      authorAvatar: typeof authorAvatar !== "undefined" ? authorAvatar : blog.authorAvatar,
      category: typeof category !== "undefined" ? category.trim() : blog.category,
      tags: typeof tags !== "undefined" ? (Array.isArray(tags) ? tags : []) : blog.tags,
      status: status && VALID_STATUSES.includes(status) ? status : blog.status,
      isFeatured: typeof isFeatured !== "undefined" ? Boolean(isFeatured) : blog.isFeatured,
      readTime: typeof readTime !== "undefined" ? readTime : blog.readTime,
      metaTitle: typeof metaTitle !== "undefined" ? (metaTitle ? metaTitle.trim() : null) : blog.metaTitle,
      metaDescription: typeof metaDescription !== "undefined" ? (metaDescription ? metaDescription.trim() : null) : blog.metaDescription,
      metaKeywords: typeof metaKeywords !== "undefined" ? (Array.isArray(metaKeywords) ? metaKeywords : []) : blog.metaKeywords,
      publishedAt: finalPublishedAt,
    });

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error in updateBlogPost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog post",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/blogs/:id
 * Delete blog post
 */
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogPost.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBlogPost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/blogs/:id/status
 * Quick toggle status
 */
export const toggleBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    let publishedAt = blog.publishedAt;
    if (status === "Published" && !publishedAt) {
      publishedAt = new Date();
    }

    await blog.update({ status, publishedAt });

    return res.status(200).json({
      success: true,
      message: `Blog post status updated to ${status}`,
      data: blog,
    });
  } catch (error) {
    console.error("Error in toggleBlogStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog status",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/blogs/:id/featured
 * Toggle isFeatured
 */
export const toggleBlogFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await blog.update({ isFeatured: Boolean(isFeatured) });

    return res.status(200).json({
      success: true,
      message: `Blog post ${blog.isFeatured ? "marked as featured" : "unfeatured"}`,
      data: blog,
    });
  } catch (error) {
    console.error("Error in toggleBlogFeatured:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
      error: error.message,
    });
  }
};
