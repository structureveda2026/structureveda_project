import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { BlogPost } from "../models/index.js";

/**
 * GET /api/blogs
 * Public list of published blog posts
 */
export const getPublicBlogPosts = async (req, res) => {
  try {
    const {
      category,
      tag,
      search,
      isFeatured,
      page = 1,
      limit = 9,
      sort = "publishedAt",
      order = "DESC",
    } = req.query;

    const where = {
      status: "Published",
    };

    if (category && category !== "All") {
      where.category = category;
    }

    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (tag && tag.trim()) {
      where.tags = {
        [Op.contains]: [tag.trim()],
      };
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: searchTerm } },
        { excerpt: { [Op.iLike]: searchTerm } },
        { author: { [Op.iLike]: searchTerm } },
        { category: { [Op.iLike]: searchTerm } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));
    const offset = (pageNum - 1) * limitNum;

    const validSort = ["publishedAt", "createdAt", "viewsCount", "title"];
    const sortField = validSort.includes(sort) ? sort : "publishedAt";
    const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count, rows: blogs } = await BlogPost.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset,
      attributes: [
        "id",
        "slug",
        "title",
        "subtitle",
        "excerpt",
        "featuredImage",
        "author",
        "authorAvatar",
        "category",
        "tags",
        "isFeatured",
        "readTime",
        "viewsCount",
        "publishedAt",
        "createdAt",
      ],
    });

    return res.status(200).json({
      success: true,
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
    console.error("Error in getPublicBlogPosts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve blog posts",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/:slug
 * Get single blog post by slug and increment view count
 */
export const getPublicBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await BlogPost.findOne({
      where: {
        slug,
        status: "Published",
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Atomically increment views count
    try {
      await blog.increment("viewsCount", { by: 1 });
    } catch (incErr) {
      console.warn("Could not increment blog views:", incErr.message);
    }

    // Also find related blogs in same category
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
        "excerpt",
        "featuredImage",
        "author",
        "category",
        "readTime",
        "publishedAt",
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        blog,
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error("Error in getPublicBlogPostBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve blog post details",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/categories/list
 * Get categories with blog counts
 */
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogPost.findAll({
      where: { status: "Published" },
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["category"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error in getBlogCategories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};
