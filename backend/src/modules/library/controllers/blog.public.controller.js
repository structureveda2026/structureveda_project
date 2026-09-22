import BlogService from "../services/blog.service.js";

/**
 * GET /api/library/blogs or /api/blogs
 * Public listing of published blogs
 */
export const getPublicBlogPosts = async (req, res) => {
  try {
    const result = await BlogService.getAllBlogs({
      ...req.query,
      isAdmin: false,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getPublicBlogPosts:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve blog posts",
    });
  }
};

/**
 * GET /api/library/blogs/:slug or /api/blogs/:slug
 * Public single blog by slug with view increment
 */
export const getPublicBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await BlogService.getBlogBySlug(slug, true);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getPublicBlogPostBySlug:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve blog post",
    });
  }
};

/**
 * GET /api/library/blogs/categories/list
 */
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogService.getCategoriesWithCount();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error in getBlogCategories:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve categories",
    });
  }
};

export default {
  getPublicBlogPosts,
  getPublicBlogPostBySlug,
  getBlogCategories,
};
