import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UpcomingPuja = sequelize.define(
  "UpcomingPuja",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    eyebrow: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "short_description",
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "full_description",
    },
    bannerImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "banner_image",
    },
    galleryImages: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "gallery_images",
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    temple: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    deity: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    occasion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    purposeCategories: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "purpose_categories",
    },
    ceremonyDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "ceremony_date",
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date_time",
    },
    bookingCloseAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "booking_close_at",
    },
    totalCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      field: "total_capacity",
      validate: {
        min: 0,
      },
    },
    bookedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "booked_count",
      validate: {
        min: 0,
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_featured",
    },
    remoteAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "remote_available",
    },
    benefits: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    significance: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    whatsIncluded: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "whats_included",
    },
    procedureSteps: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "procedure_steps",
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Draft",
      validate: {
        isIn: [["Draft", "Published", "Booking Closed", "Completed", "Cancelled"]],
      },
    },
  },
  {
    tableName: "upcoming_pujas",
    timestamps: true,
  },
);

export default UpcomingPuja;
