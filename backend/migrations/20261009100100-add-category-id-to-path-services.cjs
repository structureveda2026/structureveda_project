"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("path_services", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "path_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("path_services", ["category_id"], {
      name: "path_services_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("path_services", "path_services_category_id_idx");
    await queryInterface.removeColumn("path_services", "category_id");
  },
};
