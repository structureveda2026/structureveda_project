"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("homa_services", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "homa_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("homa_services", ["category_id"], {
      name: "homa_services_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("homa_services", "homa_services_category_id_idx");
    await queryInterface.removeColumn("homa_services", "category_id");
  },
};
