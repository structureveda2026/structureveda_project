"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("puja_services", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "puja_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("puja_services", ["category_id"], {
      name: "puja_services_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("puja_services", "puja_services_category_id_idx");
    await queryInterface.removeColumn("puja_services", "category_id");
  },
};
