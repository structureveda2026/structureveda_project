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
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "veda",
      set(val) {
        if (typeof val === "string") {
          let normalized = val.trim().toLowerCase();
          if (normalized === "darshan" || normalized === "darshans") normalized = "darshana";
          if (normalized === "upanishads") normalized = "upanishad";
          if (normalized === "puranas") normalized = "purana";
          if (normalized === "itihasas") normalized = "itihasa";
          this.setDataValue("category", normalized);
        } else {
          this.setDataValue("category", val);
        }
      },
      validate: {
        isIn: [["veda", "purana", "itihasa", "upanishad", "darshana", "darshan", "upanishads", "darshans", "puranas", "itihasas"]],
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
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("quickInfo", JSON.parse(val));
          } catch {
            this.setDataValue("quickInfo", {});
          }
        } else {
          this.setDataValue("quickInfo", val || {});
        }
      },
    },
    rishis: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("rishis", JSON.parse(val));
          } catch {
            this.setDataValue("rishis", []);
          }
        } else {
          this.setDataValue("rishis", Array.isArray(val) ? val : []);
        }
      },
    },
    deities: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("deities", JSON.parse(val));
          } catch {
            this.setDataValue("deities", []);
          }
        } else {
          this.setDataValue("deities", Array.isArray(val) ? val : []);
        }
      },
    },
    availableTexts: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "available_texts",
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("availableTexts", JSON.parse(val));
          } catch {
            this.setDataValue("availableTexts", []);
          }
        } else {
          this.setDataValue("availableTexts", Array.isArray(val) ? val : []);
        }
      },
    },
    relatedGranthas: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "related_granthas",
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("relatedGranthas", JSON.parse(val));
          } catch {
            this.setDataValue("relatedGranthas", []);
          }
        } else {
          this.setDataValue("relatedGranthas", Array.isArray(val) ? val : []);
        }
      },
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
