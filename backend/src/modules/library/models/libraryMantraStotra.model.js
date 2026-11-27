import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const LibraryMantraStotra = sequelize.define(
  "LibraryMantraStotra",
  {
    id: {
      type: DataTypes.STRING(120),
      allowNull: false,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "mantra",
      validate: {
        isIn: [["mantra", "stotra"]],
      },
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "mantra",
      field: "category_slug",
    },
    branchId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "branch_id",
    },
    branchSlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "branch_slug",
    },
    deity: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    deityHi: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "deity_hi",
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    titleHi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "title_hi",
    },
    subtitle: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    subtitleHi: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "subtitle_hi",
    },
    sourceRef: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "source_ref",
    },
    featuredImage: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "featured_image",
    },
    sanskrit: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    transliteration: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hindiTranslation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "hindi_translation",
    },
    englishTranslation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "english_translation",
    },
    hinglishTranslation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "hinglish_translation",
    },
    verses: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    canonAnga: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "canon_anga",
    },
    vidhi: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    benefits: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    count: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    rishi: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    chhandas: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    astrologicalRemedy: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "astrological_remedy",
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    audioUrl: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "audio_url",
    },
    readTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "read_time",
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "views_count",
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_featured",
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "order_index",
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "ACTIVE",
      validate: {
        isIn: [["ACTIVE", "INACTIVE", "DRAFT"]],
      },
    },
  },
  {
    tableName: "library_mantra_stotras",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["category_slug", "slug"],
        name: "library_mantra_stotras_category_slug_slug_unique",
      },
      {
        fields: ["slug"],
        name: "library_mantra_stotras_slug_idx",
      },
      {
        fields: ["type"],
        name: "library_mantra_stotras_type_idx",
      },
      {
        fields: ["category_slug"],
        name: "library_mantra_stotras_category_slug_idx",
      },
      {
        fields: ["branch_id"],
        name: "library_mantra_stotras_branch_id_idx",
      },
      {
        fields: ["branch_slug"],
        name: "library_mantra_stotras_branch_slug_idx",
      },
      {
        fields: ["deity"],
        name: "library_mantra_stotras_deity_idx",
      },
      {
        fields: ["status"],
        name: "library_mantra_stotras_status_idx",
      },
    ],
  }
);

export default LibraryMantraStotra;
