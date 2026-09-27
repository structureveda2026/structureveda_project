import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RitualBooking = sequelize.define(
  "RitualBooking",
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
    serviceType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "PUJA",
      field: "service_type",
      validate: {
        isIn: [["PUJA", "YAGYA", "HOMA", "JAPA", "PATH"]],
      },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "service_id",
      validate: {
        notNull: { msg: "serviceId is required" },
      },
    },
    serviceSlug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "service_slug",
      validate: {
        notEmpty: true,
      },
    },
    serviceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "service_name",
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "booking_date",
    },
    bookingTime: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "booking_time",
      validate: {
        notEmpty: true,
      },
    },
    durationSelected: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "duration_selected",
      validate: {
        notEmpty: true,
      },
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duration_hours",
      validate: {
        min: 1,
      },
    },
    panditCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "pandit_count",
      validate: {
        min: 1,
      },
    },
    arrangementMode: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "arrangement_mode",
      validate: {
        isIn: [["remote", "customer_home", "veda_structure", "temple", "kashi", "other"]],
      },
    },
    locationType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "location_type",
      validate: {
        isIn: [["remote", "customer_home", "veda_structure", "temple", "kashi", "other"]],
      },
    },
    venueDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      field: "venue_details",
    },
    yajmanDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "yajman_details",
    },
    sankalpDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "sankalp_details",
    },
    familyMembers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: "family_members",
    },
    addons: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "base_price",
      validate: {
        min: 0,
      },
    },
    panditAddonPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: "pandit_addon_price",
      validate: {
        min: 0,
      },
    },
    addonsTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: "addons_total",
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "INR",
    },
    bookingStatus: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "Pending",
      field: "booking_status",
      validate: {
        isIn: [["Pending", "Confirmed", "Completed", "Cancelled"]],
      },
    },
    paymentStatus: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "Pending",
      field: "payment_status",
      validate: {
        isIn: [["Pending", "Paid", "Failed", "Refunded"]],
      },
    },
    paymentGateway: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "Cashfree",
      field: "payment_gateway",
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "transaction_id",
    },
    paymentSessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "payment_session_id",
    },
    prasadStatus: {
      type: DataTypes.STRING(40),
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
    tableName: "ritual_bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RitualBooking;
