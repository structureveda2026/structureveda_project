import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HomaService = sequelize.define(
  "HomaService",
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
    homaType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Vedic Homa",
      field: "homa_type",
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "short_description",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    purposeCategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "purpose_category",
    },
    purposeCategories: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "purpose_categories",
    },
    availableHavanCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "available_havan_counts",
    },
    availableDays: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "available_days",
    },
    minimumPandits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      field: "minimum_pandits",
    },
    recommendedPandits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: "recommended_pandits",
    },
    maximumPandits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 11,
      field: "maximum_pandits",
    },
    requiredSkills: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "required_skills",
    },
    dailyHours: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "3 – 4 Hours Daily",
      field: "daily_hours",
    },
    havanCapacityPerPandit: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "havan_capacity_per_pandit",
    },
    samagri: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    prasad: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sankalpaFields: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      field: "sankalpa_fields",
    },
    isKashiAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_kashi_available",
    },
    isRemoteAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_remote_available",
    },
    availableLocations: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: ["kashi", "remote"],
      field: "available_locations",
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
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "base_price",
      validate: {
        min: 0,
      },
    },
    perHavanPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "per_havan_price",
      validate: {
        min: 0,
      },
    },
    perDayPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "per_day_price",
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
      allowNull: false,
      defaultValue: [],
      field: "gallery_images",
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    faqs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "homa_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default HomaService;
