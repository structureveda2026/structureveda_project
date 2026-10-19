import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const BlogPost = sequelize.define(
  "BlogPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    // English Content
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subtitle: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Hindi Content (Bilingual)
    titleHi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "title_hi",
    },
    subtitleHi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "subtitle_hi",
    },
    excerptHi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "excerpt_hi",
    },
    contentHi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "content_hi",
    },
    titleHinglish: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "title_hinglish",
    },
    subtitleHinglish: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "subtitle_hinglish",
    },
    excerptHinglish: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "excerpt_hinglish",
    },
    contentHinglish: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "content_hinglish",
    },
    featuredImage: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "featured_image",
    },
    author: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Veda Structure Team",
    },
    authorAvatar: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "author_avatar",
    },
    category: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: "Vedic Wisdom",
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Draft",
      validate: {
        isIn: [["Draft", "Published", "Archived"]],
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_featured",
    },
    readTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "5 min read",
      field: "read_time",
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "views_count",
    },
    metaTitle: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "meta_title",
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meta_description",
    },
    metaTitleHi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "meta_title_hi",
    },
    metaDescriptionHi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meta_description_hi",
    },
    metaTitleHinglish: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "meta_title_hinglish",
    },
    metaDescriptionHinglish: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meta_description_hinglish",
    },
    metaKeywords: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "meta_keywords",
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "published_at",
    },
    // Multi-type & Sacred Mantra/Sukti Extensions (Devanagari Sanskrit + 3 Languages)
    postType: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: "article",
      field: "post_type",
    },
    sanskrit: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deity: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    rishi: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    chhandas: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    meaning: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meaningHi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meaning_hi",
    },
    meaningEn: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meaning_en",
    },
    meaningHinglish: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "meaning_hinglish",
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
    vidhi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "blog_posts",
    timestamps: true,
  },
);

export default BlogPost;
