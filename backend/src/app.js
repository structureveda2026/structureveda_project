import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import upcomingPujaAdminRoutes from "./routes/upcomingPujaAdmin.routes.js";
import upcomingPujaRoutes from "./routes/upcomingPuja.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

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

export default app;
