"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ritual_bookings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      booking_reference: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      service_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "PUJA",
      },
      service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // Application-level polymorphic reference; intentionally NO database foreign key
      },
      service_slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      booking_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      booking_time: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      duration_selected: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      duration_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pandit_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      arrangement_mode: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      location_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      venue_details: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      yajman_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      sankalp_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      family_members: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      addons: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      pandit_addon_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      addons_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "INR",
      },
      booking_status: {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: "Pending",
      },
      payment_status: {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: "Pending",
      },
      payment_gateway: {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: "Cashfree",
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      payment_session_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      prasad_status: {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: "Pending",
      },
      prasad_tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("ritual_bookings", ["booking_reference"], {
      unique: true,
      name: "ritual_bookings_booking_reference_unique",
    });

    await queryInterface.addIndex("ritual_bookings", ["service_type", "service_id"], {
      name: "ritual_bookings_service_type_service_id_idx",
    });

    await queryInterface.addIndex("ritual_bookings", ["user_id"], {
      name: "ritual_bookings_user_id_idx",
    });

    await queryInterface.addIndex("ritual_bookings", ["booking_status", "payment_status"], {
      name: "ritual_bookings_booking_payment_status_idx",
    });

    await queryInterface.addIndex("ritual_bookings", ["booking_date"], {
      name: "ritual_bookings_booking_date_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ritual_bookings");
  },
};
