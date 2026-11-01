"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("yagya_services");
    if (!tableInfo.seo) {
      await queryInterface.addColumn("yagya_services", "seo", {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable("yagya_services");
    if (tableInfo.seo) {
      await queryInterface.removeColumn("yagya_services", "seo");
    }
  },
};
