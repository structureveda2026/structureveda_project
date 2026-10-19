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
import PuranaItihasaService from "./services/puranaItihasa.service.js";
import UpanishadDarshanService from "./services/upanishadDarshan.service.js";
import vedaPublicRoutes from "./routes/veda.public.routes.js";
import vedaAdminRoutes from "./routes/veda.admin.routes.js";
import vedaMantraAdminRoutes from "./routes/vedaMantra.admin.routes.js";
import puranaItihasaAdminRoutes from "./routes/puranaItihasa.admin.routes.js";
import puranaItihasaPublicRoutes from "./routes/puranaItihasa.public.routes.js";
import upanishadDarshanAdminRoutes from "./routes/upanishadDarshan.admin.routes.js";
import upanishadDarshanPublicRoutes from "./routes/upanishadDarshan.public.routes.js";

import LibraryBranch from "./models/libraryBranch.model.js";
import LibraryBranchService from "./services/libraryBranch.service.js";
import libraryBranchAdminRoutes from "./routes/libraryBranch.admin.routes.js";
import libraryBranchPublicRoutes from "./routes/libraryBranch.public.routes.js";

export {
  BlogPost,
  BlogService,
  blogAdminRoutes,
  blogPublicRoutes,
  blogHelpers,
  LibraryBranch,
  LibraryBranchService,
  libraryBranchAdminRoutes,
  libraryBranchPublicRoutes,
  Veda,
  VedaNode,
  VedaMantra,
  VedaService,
  VedaMantraService,
  PuranaItihasaService,
  UpanishadDarshanService,
  vedaPublicRoutes,
  vedaAdminRoutes,
  vedaMantraAdminRoutes,
  puranaItihasaAdminRoutes,
  puranaItihasaPublicRoutes,
  upanishadDarshanAdminRoutes,
  upanishadDarshanPublicRoutes,
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
    PuranaItihasaService,
    UpanishadDarshanService,
  },
  routes: {
    blogAdmin: blogAdminRoutes,
    blogPublic: blogPublicRoutes,
    vedaPublic: vedaPublicRoutes,
    vedaAdmin: vedaAdminRoutes,
    vedaMantraAdmin: vedaMantraAdminRoutes,
    puranaItihasaAdmin: puranaItihasaAdminRoutes,
    puranaItihasaPublic: puranaItihasaPublicRoutes,
    upanishadDarshanAdmin: upanishadDarshanAdminRoutes,
    upanishadDarshanPublic: upanishadDarshanPublicRoutes,
  },
  helpers: blogHelpers,
};

