"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("japa_services", {
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
      mantra: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      mantra_meaning: {
        type: Sequelize.TEXT,
        allowNull: true,
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
          model: "japa_purposes",
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
      available_counts: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      variants: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      daily_capacity_per_pandit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2000,
      },
      minimum_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      recommended_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 4,
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
        allowNull: true,
        defaultValue: "4 Hours Daily",
      },
      completion_window: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      starting_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
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
      samagri: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      prasad: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      seo: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
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

    await queryInterface.addIndex("japa_services", ["slug"], {
      unique: true,
      name: "japa_services_slug_unique",
    });

    await queryInterface.addIndex("japa_services", ["name"], {
      name: "japa_services_name_idx",
    });

    await queryInterface.addIndex("japa_services", ["purpose_id"], {
      name: "japa_services_purpose_id_idx",
    });

    await queryInterface.addIndex("japa_services", ["is_active"], {
      name: "japa_services_is_active_idx",
    });

    await queryInterface.addIndex("japa_services", ["is_featured"], {
      name: "japa_services_is_featured_idx",
    });

    await queryInterface.addIndex("japa_services", ["starting_price"], {
      name: "japa_services_starting_price_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("japa_services");
  },
};
