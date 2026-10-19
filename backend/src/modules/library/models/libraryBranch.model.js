import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const LibraryBranch = sequelize.define(
  "LibraryBranch",
  {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    categorySlug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "mantra-stotra",
      field: "category_slug",
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    enName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "en_name",
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stats: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "१०+ स्तोत्र व मंत्र",
    },
    badge: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    deity: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    imageKey: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "image_key",
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
    tableName: "library_branches",
    timestamps: true,
  }
);

export default LibraryBranch;
