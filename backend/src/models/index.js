import sequelize from "../config/database.js";
import User from "./userModel.js";
import Consultation from "./consultationModel.js";
import Booking from "./bookingModel.js";
import UpcomingPuja from "./upcomingPujaModel.js";
import PujaPackage from "./pujaPackageModel.js";
import PujaBooking from "./pujaBookingModel.js";

// Existing Associations (Astrologer Consultations)
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Phase 1 Associations (Upcoming Pujas)
UpcomingPuja.hasMany(PujaPackage, {
  foreignKey: "pujaId",
  as: "packages",
});

PujaPackage.belongsTo(UpcomingPuja, {
  foreignKey: "pujaId",
  as: "puja",
});

UpcomingPuja.hasMany(PujaBooking, {
  foreignKey: "pujaId",
  as: "bookings",
});

PujaBooking.belongsTo(UpcomingPuja, {
  foreignKey: "pujaId",
  as: "puja",
});

PujaPackage.hasMany(PujaBooking, {
  foreignKey: "packageId",
  as: "bookings",
});

PujaBooking.belongsTo(PujaPackage, {
  foreignKey: "packageId",
  as: "package",
});

User.hasMany(PujaBooking, {
  foreignKey: "userId",
  as: "pujaBookings",
});

PujaBooking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const db = {
  sequelize,
  User,
  Consultation,
  Booking,
  UpcomingPuja,
  PujaPackage,
  PujaBooking,
};

export { User, Consultation, Booking, UpcomingPuja, PujaPackage, PujaBooking };
export default db;
