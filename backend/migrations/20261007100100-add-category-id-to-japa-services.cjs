"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("japa_services", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "japa_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("japa_services", ["category_id"], {
      name: "japa_services_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("japa_services", "japa_services_category_id_idx");
    await queryInterface.removeColumn("japa_services", "category_id");
  },
};
