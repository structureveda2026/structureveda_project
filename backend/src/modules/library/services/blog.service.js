import { Op } from "sequelize";
import BlogPost from "../models/blog.model.js";
import {
  sanitizeSlug,
  calculateReadTime,
  extractExcerpt,
  normalizeTags,
  sanitizeSEO,
} from "../helpers/blog.helper.js";

const VALID_STATUSES = ["Draft", "Published", "Archived"];

class BlogService {
  /**
   * Fetch blogs with search, filters and pagination
   */
  async getAllBlogs(options = {}) {
    const {
      status,
      category,
      tag,
      search,
      isFeatured,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
      isAdmin = false,
    } = options;

    const where = {};

    if (!isAdmin) {
      where.status = "Published";
    } else if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (tag && tag.trim()) {
      where.tags = { [Op.contains]: [tag.trim().replace(/^#/, "")] };
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: searchTerm } },
        { titleHi: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { excerpt: { [Op.iLike]: searchTerm } },
        { excerptHi: { [Op.iLike]: searchTerm } },
        { author: { [Op.iLike]: searchTerm } },
        { category: { [Op.iLike]: searchTerm } },
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

    return {
      blogs,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum) || 1,
      },
    };
  }

  /**
   * Get single blog by ID
   */
  async getBlogById(id) {
    const blog = await BlogPost.findByPk(id);
    if (!blog) {
      const err = new Error("Blog post not found");
      err.statusCode = 404;
      throw err;
    }
    return blog;
  }

  /**
   * Get single public blog by slug and optionally increment views
   */
  async getBlogBySlug(slug, incrementViews = true) {
    const blog = await BlogPost.findOne({
      where: { slug, status: "Published" },
    });

    if (!blog) {
      const err = new Error("Blog post not found or not published");
      err.statusCode = 404;
      throw err;
    }

    if (incrementViews) {
      try {
        await blog.increment("viewsCount", { by: 1 });
      } catch (err) {
        console.warn("Error incrementing view count:", err.message);
      }
    }

    // Related posts in same category
    const relatedBlogs = await BlogPost.findAll({
      where: {
        status: "Published",
        category: blog.category,
        id: { [Op.ne]: blog.id },
      },
      limit: 3,
      order: [["publishedAt", "DESC"]],
      attributes: [
        "id",
        "slug",
        "title",
        "titleHi",
        "excerpt",
        "excerptHi",
        "featuredImage",
        "author",
        "category",
        "readTime",
        "publishedAt",
      ],
    });

    return { blog, relatedBlogs };
  }

  /**
   * Create a new blog post
   */
  async createBlog(data) {
    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      titleHi,
      subtitleHi,
      excerptHi,
      contentHi,
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
      metaTitleHi,
      metaDescriptionHi,
      metaKeywords,
      publishedAt,
    } = data;

    if (!title || !title.trim()) {
      const err = new Error("Blog title (English) is required");
      err.statusCode = 400;
      throw err;
    }

    if (!content || !content.trim()) {
      const err = new Error("Blog content is required");
      err.statusCode = 400;
      throw err;
    }

    // Generate unique slug
    let finalSlug = sanitizeSlug(customSlug || title);
    if (!finalSlug) {
      finalSlug = `post-${Date.now()}`;
    }

    const existingSlug = await BlogPost.findOne({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Auto excerpt if not provided
    const finalExcerpt = excerpt?.trim() || extractExcerpt(content, 160);
    const finalExcerptHi = excerptHi?.trim() || (contentHi ? extractExcerpt(contentHi, 160) : null);

    // Auto read time if not provided
    const finalReadTime = readTime?.trim() || calculateReadTime(content);

    // Normalize tags & SEO
    const finalTags = normalizeTags(tags);
    const seo = sanitizeSEO({
      metaTitle,
      metaDescription,
      metaKeywords,
      title,
      excerpt: finalExcerpt,
    });

    let finalPublishedAt = publishedAt || null;
    if (status === "Published" && !finalPublishedAt) {
      finalPublishedAt = new Date();
    }

    return await BlogPost.create({
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle ? subtitle.trim() : null,
      excerpt: finalExcerpt,
      content,
      titleHi: titleHi ? titleHi.trim() : null,
      subtitleHi: subtitleHi ? subtitleHi.trim() : null,
      excerptHi: finalExcerptHi,
      contentHi: contentHi || null,
      featuredImage: featuredImage || null,
      author: author ? author.trim() : "Veda Structure Team",
      authorAvatar: authorAvatar || null,
      category: category ? category.trim() : "Vedic Wisdom",
      tags: finalTags,
      status: VALID_STATUSES.includes(status) ? status : "Draft",
      isFeatured: Boolean(isFeatured),
      readTime: finalReadTime,
      viewsCount: 0,
      metaTitle: seo.metaTitle || null,
      metaDescription: seo.metaDescription || null,
      metaTitleHi: metaTitleHi ? metaTitleHi.trim() : null,
      metaDescriptionHi: metaDescriptionHi ? metaDescriptionHi.trim() : null,
      metaKeywords: seo.metaKeywords,
      publishedAt: finalPublishedAt,
    });
  }

  /**
   * Update existing blog post
   */
  async updateBlog(id, data) {
    const blog = await this.getBlogById(id);

    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      titleHi,
      subtitleHi,
      excerptHi,
      contentHi,
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
      metaTitleHi,
      metaDescriptionHi,
      metaKeywords,
      publishedAt,
    } = data;

    let finalSlug = blog.slug;
    if (customSlug && customSlug.trim()) {
      const sanitized = sanitizeSlug(customSlug);
      if (sanitized !== blog.slug) {
        const slugExists = await BlogPost.findOne({
          where: { slug: sanitized, id: { [Op.ne]: id } },
        });
        if (slugExists) {
          const err = new Error("Slug already in use. Please select a unique slug.");
          err.statusCode = 400;
          throw err;
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

    const updatedContent = typeof content !== "undefined" ? content : blog.content;
    const finalExcerpt =
      typeof excerpt !== "undefined"
        ? excerpt?.trim() || null
        : blog.excerpt || extractExcerpt(updatedContent);

    const updatedContentHi = typeof contentHi !== "undefined" ? contentHi : blog.contentHi;
    const finalExcerptHi =
      typeof excerptHi !== "undefined"
        ? excerptHi?.trim() || null
        : blog.excerptHi || (updatedContentHi ? extractExcerpt(updatedContentHi) : null);

    const finalReadTime =
      typeof readTime !== "undefined"
        ? readTime
        : calculateReadTime(updatedContent);

    await blog.update({
      title: typeof title !== "undefined" ? title.trim() : blog.title,
      slug: finalSlug,
      subtitle: typeof subtitle !== "undefined" ? (subtitle ? subtitle.trim() : null) : blog.subtitle,
      excerpt: finalExcerpt,
      content: updatedContent,
      titleHi: typeof titleHi !== "undefined" ? (titleHi ? titleHi.trim() : null) : blog.titleHi,
      subtitleHi: typeof subtitleHi !== "undefined" ? (subtitleHi ? subtitleHi.trim() : null) : blog.subtitleHi,
      excerptHi: finalExcerptHi,
      contentHi: updatedContentHi,
      featuredImage: typeof featuredImage !== "undefined" ? featuredImage : blog.featuredImage,
      author: typeof author !== "undefined" ? author.trim() : blog.author,
      authorAvatar: typeof authorAvatar !== "undefined" ? authorAvatar : blog.authorAvatar,
      category: typeof category !== "undefined" ? category.trim() : blog.category,
      tags: typeof tags !== "undefined" ? normalizeTags(tags) : blog.tags,
      status: status && VALID_STATUSES.includes(status) ? status : blog.status,
      isFeatured: typeof isFeatured !== "undefined" ? Boolean(isFeatured) : blog.isFeatured,
      readTime: finalReadTime,
      metaTitle: typeof metaTitle !== "undefined" ? (metaTitle ? metaTitle.trim() : null) : blog.metaTitle,
      metaDescription: typeof metaDescription !== "undefined" ? (metaDescription ? metaDescription.trim() : null) : blog.metaDescription,
      metaTitleHi: typeof metaTitleHi !== "undefined" ? (metaTitleHi ? metaTitleHi.trim() : null) : blog.metaTitleHi,
      metaDescriptionHi: typeof metaDescriptionHi !== "undefined" ? (metaDescriptionHi ? metaDescriptionHi.trim() : null) : blog.metaDescriptionHi,
      metaKeywords: typeof metaKeywords !== "undefined" ? normalizeTags(metaKeywords) : blog.metaKeywords,
      publishedAt: finalPublishedAt,
    });

    return blog;
  }

  /**
   * Delete blog post
   */
  async deleteBlog(id) {
    const blog = await this.getBlogById(id);
    await blog.destroy();
    return true;
  }

  /**
   * Quick status toggle
   */
  async updateBlogStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
      err.statusCode = 400;
      throw err;
    }

    const blog = await this.getBlogById(id);
    let publishedAt = blog.publishedAt;
    if (status === "Published" && !publishedAt) {
      publishedAt = new Date();
    }

    await blog.update({ status, publishedAt });
    return blog;
  }

  /**
   * Toggle featured post
   */
  async toggleFeatured(id, isFeatured) {
    const blog = await this.getBlogById(id);
    await blog.update({ isFeatured: Boolean(isFeatured) });
    return blog;
  }

  /**
   * Aggregate metrics & stats
   */
  async getBlogStats() {
    const totalBlogs = await BlogPost.count();
    const publishedBlogs = await BlogPost.count({ where: { status: "Published" } });
    const draftBlogs = await BlogPost.count({ where: { status: "Draft" } });
    const archivedBlogs = await BlogPost.count({ where: { status: "Archived" } });
    const totalViewsResult = await BlogPost.sum("views_count");
    const totalViews = totalViewsResult || 0;

    const categories = await BlogPost.findAll({
      attributes: [
        "category",
        [BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "count"],
      ],
      group: ["category"],
      order: [[BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "DESC"]],
      raw: true,
    });

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      archivedBlogs,
      totalViews,
      categories,
    };
  }

  /**
   * Unique categories list with published count
   */
  async getCategoriesWithCount() {
    return await BlogPost.findAll({
      where: { status: "Published" },
      attributes: [
        "category",
        [BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "count"],
      ],
      group: ["category"],
      order: [[BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "DESC"]],
      raw: true,
    });
  }
}

export default new BlogService();
