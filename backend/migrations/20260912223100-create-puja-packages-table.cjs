"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("puja_packages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      puja_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "upcoming_pujas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      max_devotees: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      features: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex("puja_packages", ["puja_id"], {
      name: "puja_packages_puja_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("puja_packages");
  },
};
