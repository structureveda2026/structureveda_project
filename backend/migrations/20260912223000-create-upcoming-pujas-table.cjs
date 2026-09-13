"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("upcoming_pujas", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      eyebrow: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      tagline: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      full_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      banner_image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      gallery_images: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      temple: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      deity: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      occasion: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      purpose_categories: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      ceremony_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_date_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      booking_close_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      booked_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      remote_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      benefits: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      significance: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      whats_included: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      procedure_steps: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "Draft",
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

    await queryInterface.addIndex("upcoming_pujas", ["slug"], {
      unique: true,
      name: "upcoming_pujas_slug_unique",
    });
    await queryInterface.addIndex("upcoming_pujas", ["ceremony_date"], {
      name: "upcoming_pujas_ceremony_date_idx",
    });
    await queryInterface.addIndex("upcoming_pujas", ["start_date_time"], {
      name: "upcoming_pujas_start_date_time_idx",
    });
    await queryInterface.addIndex("upcoming_pujas", ["status"], {
      name: "upcoming_pujas_status_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("upcoming_pujas");
  },
};
