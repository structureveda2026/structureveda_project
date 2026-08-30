import sequelize from "../config/database.js";
import User from "./userModel.js";
import Consultation from "./consultationModel.js";
import Booking from "./bookingModel.js";

// Define Associations
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

const db = {
  sequelize,
  User,
  Consultation,
  Booking,
};

export { User, Consultation, Booking };
export default db;
