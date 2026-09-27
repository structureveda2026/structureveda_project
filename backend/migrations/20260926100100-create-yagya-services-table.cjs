"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("yagya_services", {
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
          model: "yagya_purposes",
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
        allowNull: false,
        defaultValue: [],
      },
      duration_display: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      daily_ritual_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      daily_hours_display: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "5 Hours / Day",
      },
      pandit_requirement: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      location_type: {
        type: Sequelize.STRING(150),
        allowNull: true,
        defaultValue: "Kashi Kshetras & Sacred Mandaps",
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "Kashi (Varanasi)",
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
      is_remote_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      starting_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      pricing_tiers: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
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
      daily_schedule: {
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

    await queryInterface.addIndex("yagya_services", ["slug"], {
      unique: true,
      name: "yagya_services_slug_unique",
    });

    await queryInterface.addIndex("yagya_services", ["purpose_id"], {
      name: "yagya_services_purpose_id_idx",
    });

    await queryInterface.addIndex("yagya_services", ["is_active"], {
      name: "yagya_services_is_active_idx",
    });

    await queryInterface.addIndex("yagya_services", ["is_featured"], {
      name: "yagya_services_is_featured_idx",
    });

    await queryInterface.addIndex("yagya_services", ["starting_price"], {
      name: "yagya_services_starting_price_idx",
    });

    await queryInterface.addIndex("yagya_services", ["deity"], {
      name: "yagya_services_deity_idx",
    });

    await queryInterface.addIndex("yagya_services", ["available_mode"], {
      name: "yagya_services_available_mode_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("yagya_services");
  },
};
