"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("ritual_bookings");
    if (!tableInfo.notes) {
      await queryInterface.addColumn("ritual_bookings", "notes", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable("ritual_bookings");
    if (tableInfo.notes) {
      await queryInterface.removeColumn("ritual_bookings", "notes");
    }
  },
};

