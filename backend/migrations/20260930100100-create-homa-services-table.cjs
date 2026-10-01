"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("homa_services", {
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
      homa_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "Vedic Homa",
      },
      short_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      purpose_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "homa_purposes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      purpose_summary: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      purpose_category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      purpose_categories: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      available_havan_counts: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      available_days: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      minimum_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      recommended_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      maximum_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 11,
      },
      required_skills: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      daily_hours: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "3 – 4 Hours Daily",
      },
      havan_capacity_per_pandit: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      samagri: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      prasad: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sankalpa_fields: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      is_kashi_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_remote_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      available_locations: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: ["kashi", "remote"],
      },
      starting_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      per_havan_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      per_day_price: {
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
        allowNull: false,
        defaultValue: [],
      },
      seo: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      faqs: {
        type: Sequelize.JSONB,
        allowNull: false,
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

    await queryInterface.addIndex("homa_services", ["slug"], {
      unique: true,
      name: "homa_services_slug_unique",
    });

    await queryInterface.addIndex("homa_services", ["purpose_id"], {
      name: "homa_services_purpose_id_idx",
    });

    await queryInterface.addIndex("homa_services", ["purpose_category"], {
      name: "homa_services_purpose_category_idx",
    });

    await queryInterface.addIndex("homa_services", ["is_active"], {
      name: "homa_services_is_active_idx",
    });

    await queryInterface.addIndex("homa_services", ["is_featured"], {
      name: "homa_services_is_featured_idx",
    });

    await queryInterface.addIndex("homa_services", ["starting_price"], {
      name: "homa_services_starting_price_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("homa_services");
  },
};
