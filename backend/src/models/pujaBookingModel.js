import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PujaBooking = sequelize.define(
  "PujaBooking",
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
      field: "booking_reference",
      validate: {
        notEmpty: true,
      },
    },
    pujaId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "puja_id",
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "package_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    primaryDevoteeName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "primary_devotee_name",
      validate: {
        notEmpty: true,
      },
    },
    primaryPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "primary_phone",
      validate: {
        notEmpty: true,
      },
    },
    primaryEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "primary_email",
    },
    devotees: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    sankalpPurpose: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "sankalp_purpose",
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: "shipping_address",
    },
    bookingStatus: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Pending",
      field: "booking_status",
      validate: {
        isIn: [["Pending", "Confirmed", "Cancelled", "Completed"]],
      },
    },
    paymentStatus: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Pending",
      field: "payment_status",
      validate: {
        isIn: [["Pending", "Paid", "Failed", "Refunded"]],
      },
    },
    prasadStatus: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Pending",
      field: "prasad_status",
      validate: {
        isIn: [["Pending", "Dispatched", "Delivered"]],
      },
    },
    prasadTrackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "prasad_tracking_number",
    },
  },
  {
    tableName: "puja_bookings",
    timestamps: true,
  },
);

export default PujaBooking;
