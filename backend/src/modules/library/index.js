import BlogPost from "./models/blog.model.js";
import BlogService from "./services/blog.service.js";
import blogAdminRoutes from "./routes/blog.admin.routes.js";
import blogPublicRoutes from "./routes/blog.public.routes.js";
import blogHelpers from "./helpers/blog.helper.js";

export {
  BlogPost,
  BlogService,
  blogAdminRoutes,
  blogPublicRoutes,
  blogHelpers,
};

export default {
  model: BlogPost,
  service: BlogService,
  routes: {
    admin: blogAdminRoutes,
    public: blogPublicRoutes,
  },
  helpers: blogHelpers,
};
