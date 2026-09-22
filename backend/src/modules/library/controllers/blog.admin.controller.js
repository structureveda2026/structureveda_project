import BlogService from "../services/blog.service.js";

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
    console.error("Error in getAdminBlogPosts:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch blog posts",
    });
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
    console.error("Error in getBlogStats:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch blog statistics",
    });
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
    console.error("Error in getAdminBlogPostById:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch blog post",
    });
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
    console.error("Error in createBlogPost:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create blog post",
    });
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
    console.error("Error in updateBlogPost:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update blog post",
    });
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
    console.error("Error in deleteBlogPost:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete blog post",
    });
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
    console.error("Error in toggleBlogStatus:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update blog status",
    });
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
    console.error("Error in toggleBlogFeatured:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to toggle featured status",
    });
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
