import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AstrologerPackage = sequelize.define(
  "AstrologerPackage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    astrologerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "astrologer_id",
      validate: {
        notEmpty: true,
      },
    },
    packageKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "package_key",
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "original_price",
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_popular",
    },
    badge: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    knownFor: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "known_for",
    },
    consultationDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: "consultation_details",
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
    tableName: "astrologer_packages",
    timestamps: true,
  },
);

export default AstrologerPackage;
