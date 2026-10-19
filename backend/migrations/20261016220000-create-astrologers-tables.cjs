"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create astrologers table
    await queryInterface.createTable("astrologers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      eyebrow: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      quote: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      experience_years: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      holy_seat: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: "Vedic Tradition",
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: "India",
      },
      languages: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      specializations: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      expertise: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 5.0,
      },
      reviews_count: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "0+",
      },
      sessions_count: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "0+",
      },
      profile_image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      portrait_image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      secondary_image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      bio_paragraphs: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      pillars: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      faqs: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      available_time_slots: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      add_on_pricing: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    // 2. Indexes for astrologers
    await queryInterface.addIndex("astrologers", ["slug"], {
      name: "astrologers_slug_idx",
      unique: true,
    });
    await queryInterface.addIndex("astrologers", ["code"], {
      name: "astrologers_code_idx",
      unique: true,
    });
    await queryInterface.addIndex("astrologers", ["is_active", "display_order"], {
      name: "astrologers_active_order_idx",
    });

    // 3. Create astrologer_packages table
    await queryInterface.createTable("astrologer_packages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      astrologer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "astrologers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      package_key: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      is_popular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      badge: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      known_for: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      consultation_details: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // 4. Indexes for astrologer_packages
    await queryInterface.addIndex("astrologer_packages", ["astrologer_id"], {
      name: "astrologer_packages_astrologer_id_idx",
    });
    await queryInterface.addIndex("astrologer_packages", ["astrologer_id", "package_key"], {
      name: "astrologer_packages_key_idx",
      unique: true,
    });
    await queryInterface.addIndex("astrologer_packages", ["is_active", "display_order"], {
      name: "astrologer_packages_active_order_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("astrologer_packages");
    await queryInterface.dropTable("astrologers");
  },
};
