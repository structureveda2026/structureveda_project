import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PujaPackage = sequelize.define(
  "PujaPackage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pujaId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "puja_id",
    },
    name: {
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
    maxDevotees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "max_devotees",
      validate: {
        min: 1,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_default",
    },
  },
  {
    tableName: "puja_packages",
    timestamps: true,
  },
);

export default PujaPackage;
