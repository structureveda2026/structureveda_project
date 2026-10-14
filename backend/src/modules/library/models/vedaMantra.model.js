import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const VedaMantra = sequelize.define(
  "VedaMantra",
  {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    vedaId: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: "veda_id",
    },
    nodeId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "node_id",
    },
    vedaName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "Vedic & Shastric Heritage",
      field: "veda_name",
      set(val) {
        this.setDataValue("vedaName", (val && typeof val === "string" && val.trim()) ? val.trim() : "Vedic & Shastric Heritage");
      },
    },
    shakha: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    textName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "Sacred Text",
      field: "text_name",
      set(val) {
        this.setDataValue("textName", (val && typeof val === "string" && val.trim()) ? val.trim() : "Sacred Text");
      },
    },
    sectionRef: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "Section 1",
      field: "section_ref",
      set(val) {
        this.setDataValue("sectionRef", (val && typeof val === "string" && val.trim()) ? val.trim() : "Section 1");
      },
    },
    mantraNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: "1",
      field: "mantra_number",
      set(val) {
        this.setDataValue("mantraNumber", (val && (typeof val === "string" || typeof val === "number")) ? String(val).trim() : "1");
      },
    },
    rishi: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    devata: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    chhanda: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    svara: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    sanskrit: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "ॐ",
      set(val) {
        this.setDataValue("sanskrit", (val && typeof val === "string" && val.trim()) ? val.trim() : "ॐ");
      },
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
      allowNull: false,
      defaultValue: "हिन्दी अनुवाद शीघ्र उपलब्ध कराया जाएगा।",
      field: "hindi_translation",
      set(val) {
        this.setDataValue("hindiTranslation", (val && typeof val === "string" && val.trim()) ? val.trim() : "हिन्दी अनुवाद शीघ्र उपलब्ध कराया जाएगा।");
      },
      validate: {
        notEmpty: true,
      },
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
    padapatha: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("padapatha", JSON.parse(val));
          } catch {
            this.setDataValue("padapatha", []);
          }
        } else {
          this.setDataValue("padapatha", Array.isArray(val) ? val : []);
        }
      },
    },
    shastricContext: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "shastric_context",
    },
    purport: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "purport",
    },
    audioUrl: {
      type: DataTypes.STRING(600),
      allowNull: true,
      field: "audio_url",
    },
    previousId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "previous_id",
    },
    nextId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "next_id",
    },
    chapterMantraIds: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: "chapter_mantra_ids",
      set(val) {
        if (typeof val === "string") {
          try {
            this.setDataValue("chapterMantraIds", JSON.parse(val));
          } catch {
            this.setDataValue("chapterMantraIds", []);
          }
        } else {
          this.setDataValue("chapterMantraIds", Array.isArray(val) ? val : []);
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
    tableName: "veda_mantras",
    timestamps: true,
  }
);

export default VedaMantra;
