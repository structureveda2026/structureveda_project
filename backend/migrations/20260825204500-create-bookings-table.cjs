"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      bookingReference: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      astrologerId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      astrologerName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      packageId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      packageName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      addOns: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      timeOfBirth: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      placeOfBirth: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      reportLanguage: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      consultationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      consultationTime: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      consultationMode: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      selectedTopics: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      bookingStatus: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Pending",
      },
      paymentStatus: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Pending",
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Online",
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  },
};
