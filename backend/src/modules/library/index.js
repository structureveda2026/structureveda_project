import BlogPost from "./models/blog.model.js";
import BlogService from "./services/blog.service.js";
import blogAdminRoutes from "./routes/blog.admin.routes.js";
import blogPublicRoutes from "./routes/blog.public.routes.js";
import blogHelpers from "./helpers/blog.helper.js";

import Veda from "./models/veda.model.js";
import VedaNode from "./models/vedaNode.model.js";
import VedaMantra from "./models/vedaMantra.model.js";
import VedaService from "./services/veda.service.js";
import VedaMantraService from "./services/vedaMantra.service.js";
import vedaPublicRoutes from "./routes/veda.public.routes.js";
import vedaAdminRoutes from "./routes/veda.admin.routes.js";
import vedaMantraAdminRoutes from "./routes/vedaMantra.admin.routes.js";

export {
  BlogPost,
  BlogService,
  blogAdminRoutes,
  blogPublicRoutes,
  blogHelpers,
  Veda,
  VedaNode,
  VedaMantra,
  VedaService,
  VedaMantraService,
  vedaPublicRoutes,
  vedaAdminRoutes,
  vedaMantraAdminRoutes,
};

export default {
  models: {
    BlogPost,
    Veda,
    VedaNode,
    VedaMantra,
  },
  services: {
    BlogService,
    VedaService,
    VedaMantraService,
  },
  routes: {
    blogAdmin: blogAdminRoutes,
    blogPublic: blogPublicRoutes,
    vedaPublic: vedaPublicRoutes,
    vedaAdmin: vedaAdminRoutes,
    vedaMantraAdmin: vedaMantraAdminRoutes,
  },
  helpers: blogHelpers,
};
