import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Astrologer = sequelize.define(
  "Astrologer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    eyebrow: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    quote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "experience_years",
    },
    holySeat: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Vedic Tradition",
      field: "holy_seat",
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "India",
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    specializations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    expertise: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 5.0,
    },
    reviewsCount: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0+",
      field: "reviews_count",
    },
    sessionsCount: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0+",
      field: "sessions_count",
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "profile_image",
    },
    portraitImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "portrait_image",
    },
    secondaryImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "secondary_image",
    },
    bioParagraphs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "bio_paragraphs",
    },
    pillars: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    faqs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    availableTimeSlots: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "available_time_slots",
    },
    addOnPricing: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      field: "add_on_pricing",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "display_order",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "astrologers",
    timestamps: true,
  },
);

export default Astrologer;
