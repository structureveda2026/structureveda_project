import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import upcomingPujaAdminRoutes from "./routes/upcomingPujaAdmin.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

// Health check
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
app.use("/admin/upcoming-pujas", upcomingPujaAdminRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();
