import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const JapaService = sequelize.define(
  "JapaService",
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
    mantra: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    mantraMeaning: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "mantra_meaning",
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
    availableCounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "available_counts",
    },
    variants: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    dailyCapacityPerPandit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2000,
      field: "daily_capacity_per_pandit",
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
      defaultValue: 4,
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
      allowNull: true,
      defaultValue: "4 Hours Daily",
      field: "daily_hours",
    },
    completionWindow: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "completion_window",
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
    samagri: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    prasad: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    faqs: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "japa_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default JapaService;
