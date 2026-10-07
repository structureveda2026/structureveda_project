import sequelize from "../config/database.js";
import User from "./userModel.js";
import Consultation from "./consultationModel.js";
import Booking from "./bookingModel.js";
import UpcomingPuja from "./upcomingPujaModel.js";
import PujaPackage from "./pujaPackageModel.js";
import PujaBooking from "./pujaBookingModel.js";
import PujaPurpose from "./pujaPurposeModel.js";
import PujaService from "./pujaServiceModel.js";
import RitualBooking from "./ritualBookingModel.js";
import YagyaPurpose from "./yagyaPurposeModel.js";
import YagyaService from "./yagyaServiceModel.js";
import JapaPurpose from "./japaPurposeModel.js";
import JapaService from "./japaServiceModel.js";
import HomaPurpose from "./homaPurposeModel.js";
import HomaService from "./homaServiceModel.js";
import PathPurpose from "./pathPurposeModel.js";
import PathService from "./pathServiceModel.js";
import BlogPost from "./blogPostModel.js";
import Veda from "./vedaModel.js";
import VedaNode from "./vedaNodeModel.js";
import VedaMantra from "./vedaMantraModel.js";

// Veda & Hierarchy Associations
Veda.hasMany(VedaNode, {
  foreignKey: "vedaId",
  as: "nodes",
});

VedaNode.belongsTo(Veda, {
  foreignKey: "vedaId",
  as: "veda",
});

VedaNode.hasMany(VedaNode, {
  foreignKey: "parentId",
  as: "children",
});

VedaNode.belongsTo(VedaNode, {
  foreignKey: "parentId",
  as: "parent",
});

Veda.hasMany(VedaMantra, {
  foreignKey: "vedaId",
  as: "mantras",
});

VedaMantra.belongsTo(Veda, {
  foreignKey: "vedaId",
  as: "veda",
});

VedaNode.hasMany(VedaMantra, {
  foreignKey: "nodeId",
  as: "mantras",
});

VedaMantra.belongsTo(VedaNode, {
  foreignKey: "nodeId",
  as: "node",
});

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

// Puja Service Catalogue Associations
PujaPurpose.hasMany(PujaService, {
  foreignKey: "purposeId",
  as: "services",
});

PujaService.belongsTo(PujaPurpose, {
  foreignKey: "purposeId",
  as: "purposeDetails",
});

// Yagya Service Catalogue Associations
YagyaPurpose.hasMany(YagyaService, {
  foreignKey: "purposeId",
  as: "services",
});

YagyaService.belongsTo(YagyaPurpose, {
  foreignKey: "purposeId",
  as: "purposeDetails",
});

// Japa Service Catalogue Associations
JapaPurpose.hasMany(JapaService, {
  foreignKey: "purposeId",
  as: "services",
});

JapaService.belongsTo(JapaPurpose, {
  foreignKey: "purposeId",
  as: "purposeDetails",
});

// Homa Service Catalogue Associations
HomaPurpose.hasMany(HomaService, {
  foreignKey: "purposeId",
  as: "services",
});

HomaService.belongsTo(HomaPurpose, {
  foreignKey: "purposeId",
  as: "purposeDetails",
});

// Path Service Catalogue Associations
PathPurpose.hasMany(PathService, {
  foreignKey: "purposeId",
  as: "services",
});

PathService.belongsTo(PathPurpose, {
  foreignKey: "purposeId",
  as: "purposeDetails",
});

// Generic Ritual Booking Associations
User.hasMany(RitualBooking, {
  foreignKey: "userId",
  as: "ritualBookings",
});

RitualBooking.belongsTo(User, {
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
  PujaPurpose,
  PujaService,
  RitualBooking,
  YagyaPurpose,
  YagyaService,
  JapaPurpose,
  JapaService,
  HomaPurpose,
  HomaService,
  PathPurpose,
  PathService,
  BlogPost,
  Veda,
  VedaNode,
  VedaMantra,
};

export {
  User,
  Consultation,
  Booking,
  UpcomingPuja,
  PujaPackage,
  PujaBooking,
  PujaPurpose,
  PujaService,
  RitualBooking,
  YagyaPurpose,
  YagyaService,
  JapaPurpose,
  JapaService,
  HomaPurpose,
  HomaService,
  PathPurpose,
  PathService,
  BlogPost,
  Veda,
  VedaNode,
  VedaMantra,
};
export default db;
