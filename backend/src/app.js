import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import upcomingPujaAdminRoutes from "./routes/upcomingPujaAdmin.routes.js";
import upcomingPujaRoutes from "./routes/upcomingPuja.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import pujaServiceRoutes from './routes/pujaService.routes.js';
import pujaServiceAdminRoutes from './routes/pujaServiceAdmin.routes.js';
import pujaCategoryRoutes from './routes/pujaCategory.routes.js';
import pujaCategoryAdminRoutes from './routes/pujaCategoryAdmin.routes.js';
import ritualBookingRoutes from './routes/ritualBooking.routes.js';
import yagyaServiceRoutes from "./routes/yagyaService.routes.js";
import yagyaServiceAdminRoutes from "./routes/yagyaServiceAdmin.routes.js";
import yagyaCategoryRoutes from "./routes/yagyaCategory.routes.js";
import yagyaCategoryAdminRoutes from "./routes/yagyaCategoryAdmin.routes.js";
import japaServiceRoutes from "./routes/japaService.routes.js";
import japaServiceAdminRoutes from "./routes/japaServiceAdmin.routes.js";
import japaCategoryRoutes from "./routes/japaCategory.routes.js";
import japaCategoryAdminRoutes from "./routes/japaCategoryAdmin.routes.js";
import homaServiceRoutes from "./routes/homaService.routes.js";
import homaServiceAdminRoutes from "./routes/homaServiceAdmin.routes.js";
import homaCategoryRoutes from "./routes/homaCategory.routes.js";
import homaCategoryAdminRoutes from "./routes/homaCategoryAdmin.routes.js";
import pathServiceRoutes from "./routes/pathService.routes.js";
import pathServiceAdminRoutes from "./routes/pathServiceAdmin.routes.js";
import pathCategoryRoutes from "./routes/pathCategory.routes.js";
import pathCategoryAdminRoutes from "./routes/pathCategoryAdmin.routes.js";

// Library Module routes (Blogs, Vedas, Mantras & Suktas)
import {
  blogAdminRoutes,
  blogPublicRoutes,
  vedaPublicRoutes,
  vedaAdminRoutes,
  vedaMantraAdminRoutes,
  puranaItihasaAdminRoutes,
  puranaItihasaPublicRoutes,
  upanishadDarshanAdminRoutes,
  upanishadDarshanPublicRoutes,
} from "./modules/library/index.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Veda Structure API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/upcoming-pujas", upcomingPujaAdminRoutes);
app.use("/api/upcoming-pujas", upcomingPujaRoutes);
app.use("/api/admin/uploads", uploadRoutes);
app.use("/api/puja-services", pujaServiceRoutes);
app.use("/api/admin/puja-services", pujaServiceAdminRoutes);
app.use("/api/puja-categories", pujaCategoryRoutes);
app.use("/api/admin/puja-categories", pujaCategoryAdminRoutes);
app.use("/api/ritual-bookings", ritualBookingRoutes);
app.use("/api/yagya-services", yagyaServiceRoutes);
app.use("/api/admin/yagya-services", yagyaServiceAdminRoutes);
app.use("/api/yagya-categories", yagyaCategoryRoutes);
app.use("/api/admin/yagya-categories", yagyaCategoryAdminRoutes);
app.use("/api/japa-services", japaServiceRoutes);
app.use("/api/admin/japa-services", japaServiceAdminRoutes);
app.use("/api/japa-categories", japaCategoryRoutes);
app.use("/api/admin/japa-categories", japaCategoryAdminRoutes);
app.use("/api/homa-services", homaServiceRoutes);
app.use("/api/admin/homa-services", homaServiceAdminRoutes);
app.use("/api/homa-categories", homaCategoryRoutes);
app.use("/api/admin/homa-categories", homaCategoryAdminRoutes);
app.use("/api/path-services", pathServiceRoutes);
app.use("/api/admin/path-services", pathServiceAdminRoutes);
app.use("/api/path-categories", pathCategoryRoutes);
app.use("/api/admin/path-categories", pathCategoryAdminRoutes);

// Library Module Endpoints (Standard & Aliases)
app.use("/api/admin/library/blogs", blogAdminRoutes);
app.use("/api/admin/blogs", blogAdminRoutes);
app.use("/api/library/blogs", blogPublicRoutes);
app.use("/api/blogs", blogPublicRoutes);

// Veda, Mantra & Grantha Library Endpoints
app.use("/api/admin/library/vedas", vedaAdminRoutes);
app.use("/api/admin/vedas", vedaAdminRoutes);
app.use("/api/admin/library/mantras", vedaMantraAdminRoutes);
app.use("/api/admin/mantras", vedaMantraAdminRoutes);
app.use("/api/admin/library", vedaAdminRoutes);

app.use("/api/library", vedaPublicRoutes);
app.use("/api/vedas", vedaPublicRoutes);
app.use("/api/mantras", vedaPublicRoutes);
// Grantha & Shastra aliases
app.use("/api/granthas", vedaPublicRoutes);
app.use("/api/upanishads", vedaPublicRoutes);
app.use("/api/darshanas", vedaPublicRoutes);

// Purana & Itihasa Endpoints
app.use("/api/admin/library/purana-itihasa", puranaItihasaAdminRoutes);
app.use("/api/admin/library/puranas", puranaItihasaAdminRoutes);
app.use("/api/admin/library/itihasas", puranaItihasaAdminRoutes);
app.use("/api/admin/purana-itihasa", puranaItihasaAdminRoutes);
app.use("/api/admin/puranas", puranaItihasaAdminRoutes);
app.use("/api/admin/itihasas", puranaItihasaAdminRoutes);

app.use("/api/library/purana-itihasa", puranaItihasaPublicRoutes);
app.use("/api/library/puranas", puranaItihasaPublicRoutes);
app.use("/api/library/itihasas", puranaItihasaPublicRoutes);
app.use("/api/purana-itihasa", puranaItihasaPublicRoutes);
app.use("/api/puranas", puranaItihasaPublicRoutes);
app.use("/api/itihasas", puranaItihasaPublicRoutes);

// Upanishad & Darshan Philosophy Endpoints
app.use("/api/admin/library/upanishad-darshan", upanishadDarshanAdminRoutes);
app.use("/api/admin/upanishad-darshan", upanishadDarshanAdminRoutes);
app.use("/api/admin/library/upanishads", upanishadDarshanAdminRoutes);
app.use("/api/admin/upanishads", upanishadDarshanAdminRoutes);
app.use("/api/admin/library/darshanas", upanishadDarshanAdminRoutes);
app.use("/api/admin/library/darshan", upanishadDarshanAdminRoutes);
app.use("/api/admin/darshanas", upanishadDarshanAdminRoutes);
app.use("/api/admin/darshan", upanishadDarshanAdminRoutes);

app.use("/api/library/upanishad-darshan", upanishadDarshanPublicRoutes);
app.use("/api/upanishad-darshan", upanishadDarshanPublicRoutes);
app.use("/api/upanishads", upanishadDarshanPublicRoutes);
app.use("/api/darshanas", upanishadDarshanPublicRoutes);
app.use("/api/darshan", upanishadDarshanPublicRoutes);

export default app;
