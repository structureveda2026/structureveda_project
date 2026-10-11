import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const VedaNode = sequelize.define(
  "VedaNode",
  {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    vedaId: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: "veda_id",
    },
    parentId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "parent_id",
    },
    nodeType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "SUKTA",
      field: "node_type",
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
    mantraId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "mantra_id",
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
    tableName: "veda_nodes",
    timestamps: true,
  }
);

export default VedaNode;
