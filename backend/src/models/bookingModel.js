import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingReference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    astrologerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    astrologerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    packageId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    packageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    addOns: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    fullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    timeOfBirth: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    placeOfBirth: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    reportLanguage: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    consultationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    consultationTime: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    consultationMode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    selectedTopics: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    bookingStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Online",
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  },
);

export default Booking;
