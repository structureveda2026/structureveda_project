"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("path_services", {
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
      path_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "Vedic Path",
      },
      scripture: {
        type: Sequelize.STRING(200),
        allowNull: false,
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
          model: "path_purposes",
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
      available_formats: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      available_durations: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      chapter_structure: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_chapters: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_sections: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_verses: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      estimated_recitation_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      daily_recitation_target: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      minimum_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      recommended_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      maximum_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      minimum_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      recommended_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      maximum_pandits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
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
      daily_recitation_capacity: {
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

    await queryInterface.addIndex("path_services", ["slug"], {
      unique: true,
      name: "path_services_slug_unique",
    });

    await queryInterface.addIndex("path_services", ["name"], {
      name: "path_services_name_idx",
    });

    await queryInterface.addIndex("path_services", ["path_type"], {
      name: "path_services_path_type_idx",
    });

    await queryInterface.addIndex("path_services", ["purpose_id"], {
      name: "path_services_purpose_id_idx",
    });

    await queryInterface.addIndex("path_services", ["purpose_category"], {
      name: "path_services_purpose_category_idx",
    });

    await queryInterface.addIndex("path_services", ["is_active"], {
      name: "path_services_is_active_idx",
    });

    await queryInterface.addIndex("path_services", ["is_featured"], {
      name: "path_services_is_featured_idx",
    });

    await queryInterface.addIndex("path_services", ["starting_price"], {
      name: "path_services_starting_price_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("path_services");
  },
};
