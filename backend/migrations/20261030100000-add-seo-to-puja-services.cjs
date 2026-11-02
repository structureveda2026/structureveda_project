"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("puja_services");
    if (!tableInfo.seo) {
      await queryInterface.addColumn("puja_services", "seo", {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable("puja_services");
    if (tableInfo.seo) {
      await queryInterface.removeColumn("puja_services", "seo");
    }
  },
};
