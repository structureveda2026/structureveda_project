"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("puja_services", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      eyebrow: {
        type: Sequelize.STRING(120),
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
      deity: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      purpose_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "puja_purposes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      purpose_summary: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      available_durations: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      duration: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      duration_hours: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        defaultValue: [],
      },
      location_type: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      available_mode: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "hybrid",
      },
      is_kashi_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      starting_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      whats_included: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      why_perform: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      significance: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      procedure_steps: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      faqs: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
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

    await queryInterface.addIndex("puja_services", ["slug"], {
      unique: true,
      name: "puja_services_slug_unique",
    });

    await queryInterface.addIndex("puja_services", ["purpose_id"], {
      name: "puja_services_purpose_id_idx",
    });

    await queryInterface.addIndex("puja_services", ["is_active"], {
      name: "puja_services_is_active_idx",
    });

    await queryInterface.addIndex("puja_services", ["is_featured"], {
      name: "puja_services_is_featured_idx",
    });

    await queryInterface.addIndex("puja_services", ["starting_price"], {
      name: "puja_services_starting_price_idx",
    });

    await queryInterface.addIndex("puja_services", ["deity"], {
      name: "puja_services_deity_idx",
    });

    await queryInterface.addIndex("puja_services", ["available_mode"], {
      name: "puja_services_available_mode_idx",
    });

    await queryInterface.addIndex("puja_services", ["duration_hours"], {
      using: "gin",
      name: "puja_services_duration_hours_gin_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("puja_services");
  },
};
