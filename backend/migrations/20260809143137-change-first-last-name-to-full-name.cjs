"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add fullName first
    await queryInterface.addColumn("users", "fullName", {
      type: Sequelize.STRING(200),
      allowNull: true,
    });

    // Remove old columns
    await queryInterface.removeColumn("users", "firstName");
    await queryInterface.removeColumn("users", "lastName");

    // Make fullName required after removing old columns
    await queryInterface.changeColumn("users", "fullName", {
      type: Sequelize.STRING(200),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Re-create firstName
    await queryInterface.addColumn("users", "firstName", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // Re-create lastName
    await queryInterface.addColumn("users", "lastName", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // Remove fullName
    await queryInterface.removeColumn("users", "fullName");
  },
};
