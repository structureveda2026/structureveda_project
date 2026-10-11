import sequelize from "../config/database.js";
import User from "./userModel.js";
import Consultation from "./consultationModel.js";
import Booking from "./bookingModel.js";
import UpcomingPuja from "./upcomingPujaModel.js";
import PujaPackage from "./pujaPackageModel.js";
import PujaBooking from "./pujaBookingModel.js";
import PujaPurpose from "./pujaPurposeModel.js";
import PujaCategory from "./pujaCategoryModel.js";
import PujaService from "./pujaServiceModel.js";
import RitualBooking from "./ritualBookingModel.js";
import YagyaPurpose from "./yagyaPurposeModel.js";
import YagyaCategory from "./yagyaCategoryModel.js";
import YagyaService from "./yagyaServiceModel.js";
import JapaPurpose from "./japaPurposeModel.js";
import JapaCategory from "./japaCategoryModel.js";
import JapaService from "./japaServiceModel.js";
import HomaPurpose from "./homaPurposeModel.js";
import HomaCategory from "./homaCategoryModel.js";
import HomaService from "./homaServiceModel.js";
import PathPurpose from "./pathPurposeModel.js";
import PathCategory from "./pathCategoryModel.js";
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

PujaCategory.hasMany(PujaService, {
  foreignKey: "categoryId",
  as: "services",
});

PujaService.belongsTo(PujaCategory, {
  foreignKey: "categoryId",
  as: "categoryDetails",
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

YagyaCategory.hasMany(YagyaService, {
  foreignKey: "categoryId",
  as: "services",
});

YagyaService.belongsTo(YagyaCategory, {
  foreignKey: "categoryId",
  as: "categoryDetails",
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

JapaCategory.hasMany(JapaService, {
  foreignKey: "categoryId",
  as: "services",
});

JapaService.belongsTo(JapaCategory, {
  foreignKey: "categoryId",
  as: "categoryDetails",
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

HomaCategory.hasMany(HomaService, {
  foreignKey: "categoryId",
  as: "services",
});

HomaService.belongsTo(HomaCategory, {
  foreignKey: "categoryId",
  as: "categoryDetails",
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

PathCategory.hasMany(PathService, {
  foreignKey: "categoryId",
  as: "services",
});

PathService.belongsTo(PathCategory, {
  foreignKey: "categoryId",
  as: "categoryDetails",
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
  PujaCategory,
  PujaService,
  RitualBooking,
  YagyaPurpose,
  YagyaCategory,
  YagyaService,
  JapaPurpose,
  JapaCategory,
  JapaService,
  HomaPurpose,
  HomaCategory,
  HomaService,
  PathPurpose,
  PathCategory,
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
  PujaCategory,
  PujaService,
  RitualBooking,
  YagyaPurpose,
  YagyaCategory,
  YagyaService,
  JapaPurpose,
  JapaCategory,
  JapaService,
  HomaPurpose,
  HomaCategory,
  HomaService,
  PathPurpose,
  PathCategory,
  PathService,
  BlogPost,
  Veda,
  VedaNode,
  VedaMantra,
};
export default db;
