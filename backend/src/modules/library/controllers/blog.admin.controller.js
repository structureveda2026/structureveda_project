import BlogService from "../services/blog.service.js";

/**
 * Formats errors for consistent API responses
 */
const handleControllerError = (res, error, defaultMessage) => {
  console.error(defaultMessage, error);

  if (error.name === "SequelizeUniqueConstraintError") {
    const field = error.errors?.[0]?.path || "field";
    return res.status(409).json({
      success: false,
      message: `A blog post with this ${field} already exists. Please choose a different ${field}.`,
      error: error.message,
    });
  }

  if (error.name === "SequelizeValidationError") {
    const details = error.errors?.map((e) => e.message).join(", ") || error.message;
    return res.status(400).json({
      success: false,
      message: `Validation failed: ${details}`,
      error: error.message,
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || defaultMessage,
    error: error.message,
  });
};

/**
 * GET /api/admin/library/blogs or /api/admin/blogs
 */
export const getAdminBlogPosts = async (req, res) => {
  try {
    const result = await BlogService.getAllBlogs({
      ...req.query,
      isAdmin: true,
    });

    return res.status(200).json({
      success: true,
      message: "Blog posts retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch blog posts");
  }
};

/**
 * GET /api/admin/library/blogs/stats
 */
export const getBlogStats = async (req, res) => {
  try {
    const stats = await BlogService.getBlogStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch blog statistics");
  }
};

/**
 * GET /api/admin/library/blogs/:id
 */
export const getAdminBlogPostById = async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch blog post");
  }
};

/**
 * POST /api/admin/library/blogs
 */
export const createBlogPost = async (req, res) => {
  try {
    const blog = await BlogService.createBlog(req.body);
    return res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to create blog post");
  }
};

/**
 * PUT /api/admin/library/blogs/:id
 */
export const updateBlogPost = async (req, res) => {
  try {
    const blog = await BlogService.updateBlog(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to update blog post");
  }
};

/**
 * DELETE /api/admin/library/blogs/:id
 */
export const deleteBlogPost = async (req, res) => {
  try {
    await BlogService.deleteBlog(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to delete blog post");
  }
};

/**
 * PATCH /api/admin/library/blogs/:id/status
 */
export const toggleBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const blog = await BlogService.updateBlogStatus(req.params.id, status);
    return res.status(200).json({
      success: true,
      message: `Blog status updated to ${status}`,
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to update blog status");
  }
};

/**
 * PATCH /api/admin/library/blogs/:id/featured
 */
export const toggleBlogFeatured = async (req, res) => {
  try {
    const { isFeatured } = req.body;
    const blog = await BlogService.toggleFeatured(req.params.id, isFeatured);
    return res.status(200).json({
      success: true,
      message: `Blog featured status updated`,
      data: blog,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to toggle featured status");
  }
};

export default {
  getAdminBlogPosts,
  getBlogStats,
  getAdminBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogStatus,
  toggleBlogFeatured,
};
