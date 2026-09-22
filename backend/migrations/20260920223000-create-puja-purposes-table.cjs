"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("puja_purposes", {
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
      icon_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
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

    await queryInterface.addIndex("puja_purposes", ["name"], {
      unique: true,
      name: "puja_purposes_name_unique",
    });

    await queryInterface.addIndex("puja_purposes", ["slug"], {
      unique: true,
      name: "puja_purposes_slug_unique",
    });

    await queryInterface.addIndex("puja_purposes", ["display_order"], {
      name: "puja_purposes_display_order_idx",
    });

    await queryInterface.addIndex("puja_purposes", ["is_active"], {
      name: "puja_purposes_is_active_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("puja_purposes");
  },
};
