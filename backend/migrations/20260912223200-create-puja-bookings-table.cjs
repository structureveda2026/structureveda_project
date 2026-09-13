"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("puja_bookings", {
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
      puja_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "upcoming_pujas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      package_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "puja_packages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      primary_devotee_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      primary_phone: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      primary_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      devotees: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      sankalp_purpose: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      shipping_address: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      booking_status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "Pending",
      },
      payment_status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "Pending",
      },
      prasad_status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "Pending",
      },
      prasad_tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("puja_bookings", ["booking_reference"], {
      unique: true,
      name: "puja_bookings_booking_reference_unique",
    });
    await queryInterface.addIndex("puja_bookings", ["puja_id"], {
      name: "puja_bookings_puja_id_idx",
    });
    await queryInterface.addIndex("puja_bookings", ["package_id"], {
      name: "puja_bookings_package_id_idx",
    });
    await queryInterface.addIndex("puja_bookings", ["user_id"], {
      name: "puja_bookings_user_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("puja_bookings");
  },
};
