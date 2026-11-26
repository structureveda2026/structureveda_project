"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let tableExists = false;
    try {
      await queryInterface.describeTable("library_branches");
      tableExists = true;
    } catch (e) {
      tableExists = false;
    }

    if (!tableExists) {
      await queryInterface.createTable("library_branches", {
        id: {
          type: Sequelize.STRING(100),
          allowNull: false,
          primaryKey: true,
        },
        category_slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "mantra-stotra",
        },
        slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        en_name: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        desc: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        stats: {
          type: Sequelize.STRING(150),
          allowNull: true,
          defaultValue: "10+ Mantras & Stotras",
        },
        badge: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        deity: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        image_key: {
          type: Sequelize.STRING(600),
          allowNull: true,
        },
        order_index: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: "ACTIVE",
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

      await queryInterface.addIndex("library_branches", ["category_slug", "slug"], {
        unique: true,
        name: "library_branches_category_slug_slug_unique",
      });
      await queryInterface.addIndex("library_branches", ["category_slug"]);
      await queryInterface.addIndex("library_branches", ["deity"]);
      await queryInterface.addIndex("library_branches", ["status"]);
      await queryInterface.addIndex("library_branches", ["order_index"]);
    } else {
      // If table exists (from sync), ensure image_key is STRING(600)
      const tableInfo = await queryInterface.describeTable("library_branches");
      if (tableInfo.image_key && tableInfo.image_key.type !== "CHARACTER VARYING(600)") {
        await queryInterface.changeColumn("library_branches", "image_key", {
          type: Sequelize.STRING(600),
          allowNull: true,
        });
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("library_branches");
  },
};
