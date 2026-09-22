import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PujaService = sequelize.define(
  "PujaService",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(150),
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
      type: DataTypes.STRING(120),
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
    deity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    purposeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "purpose_id",
    },
    purposeSummary: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "purpose_summary",
    },
    availableDurations: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "available_durations",
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    durationHours: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
      field: "duration_hours",
    },
    locationType: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "location_type",
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    availableMode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "hybrid",
      field: "available_mode",
      validate: {
        isIn: [["in_person", "remote", "hybrid"]],
      },
    },
    isKashiAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_kashi_available",
    },
    startingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "starting_price",
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
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
    whatsIncluded: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "whats_included",
    },
    whyPerform: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "why_perform",
    },
    significance: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    procedureSteps: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "procedure_steps",
    },
    faqs: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "puja_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PujaService;
