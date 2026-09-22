import blogAdminRoutes from "./blog.admin.routes.js";
import blogPublicRoutes from "./blog.public.routes.js";

export { blogAdminRoutes, blogPublicRoutes };
export default {
  admin: blogAdminRoutes,
  public: blogPublicRoutes,
};
