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
      field: "veda_name",
    },
    shakha: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    textName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "text_name",
    },
    sectionRef: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "section_ref",
    },
    mantraNumber: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: "mantra_number",
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
      field: "hindi_translation",
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
    },
    shastricContext: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "shastric_context",
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
