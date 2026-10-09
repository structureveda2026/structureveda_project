"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("yagya_categories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      icon_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "Sparkles",
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

    await queryInterface.addIndex("yagya_categories", ["name"], {
      unique: true,
      name: "yagya_categories_name_unique",
    });

    await queryInterface.addIndex("yagya_categories", ["slug"], {
      unique: true,
      name: "yagya_categories_slug_unique",
    });

    await queryInterface.addIndex("yagya_categories", ["display_order"], {
      name: "yagya_categories_display_order_idx",
    });

    await queryInterface.addIndex("yagya_categories", ["is_active"], {
      name: "yagya_categories_is_active_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("yagya_categories");
  },
};
