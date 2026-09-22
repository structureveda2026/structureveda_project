import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PujaPurpose = sequelize.define(
  "PujaPurpose",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Sparkles",
      field: "icon_name",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "display_order",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "puja_purposes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PujaPurpose;
