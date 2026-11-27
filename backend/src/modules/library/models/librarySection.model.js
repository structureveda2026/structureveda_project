import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const LibrarySection = sequelize.define(
  "LibrarySection",
  {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: { notEmpty: true },
    },
    enName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "en_name",
    },
    label: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    labelHi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "label_hi",
    },
    path: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    adminPath: {
      type: DataTypes.STRING(300),
      allowNull: false,
      field: "admin_path",
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "mantra-stotra",
      field: "category_slug",
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "order_index",
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    isPreset: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_preset",
    },
  },
  {
    tableName: "library_sections",
    timestamps: true,
    underscored: true,
  }
);

export default LibrarySection;
