import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Veda = sequelize.define(
  "Veda",
  {
    id: {
      type: DataTypes.STRING(60),
      allowNull: false,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(80),
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
    enName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "en_name",
      validate: {
        notEmpty: true,
      },
    },
    eyebrow: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overviewText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "overview_text",
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stats: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    priest: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    badge: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    imageKey: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "image_key",
    },
    bannerImage: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "banner_image",
    },
    quickInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "quick_info",
    },
    rishis: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    deities: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    availableTexts: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "available_texts",
    },
    relatedGranthas: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "related_granthas",
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
    tableName: "vedas",
    timestamps: true,
  }
);

export default Veda;
