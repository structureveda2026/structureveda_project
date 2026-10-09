"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("yagya_services", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "yagya_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("yagya_services", ["category_id"], {
      name: "yagya_services_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("yagya_services", "yagya_services_category_id_idx");
    await queryInterface.removeColumn("yagya_services", "category_id");
  },
};
