import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PathService = sequelize.define(
  "PathService",
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
    pathType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Vedic Path",
      field: "path_type",
    },
    scripture: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
    availableFormats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "available_formats",
    },
    availableDurations: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "available_durations",
    },
    chapterStructure: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "chapter_structure",
    },
    totalChapters: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "total_chapters",
    },
    totalSections: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "total_sections",
    },
    totalVerses: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "total_verses",
    },
    estimatedRecitationHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: "estimated_recitation_hours",
    },
    dailyRecitationTarget: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "daily_recitation_target",
    },
    minimumDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "minimum_days",
    },
    recommendedDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "recommended_days",
    },
    maximumDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "maximum_days",
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
      defaultValue: 2,
      field: "recommended_pandits",
    },
    maximumPandits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
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
    dailyRecitationCapacity: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "daily_recitation_capacity",
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
    tableName: "path_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PathService;
