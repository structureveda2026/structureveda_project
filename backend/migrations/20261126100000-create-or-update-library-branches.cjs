"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const rawTables = await queryInterface.showAllTables();
    const tableNames = rawTables.map((t) => (typeof t === "string" ? t : t.tableName));

    if (!tableNames.includes("library_branches")) {
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
    } else {
      const tableInfo = await queryInterface.describeTable("library_branches");

      if (!tableInfo.category_slug) {
        await queryInterface.addColumn("library_branches", "category_slug", {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "mantra-stotra",
        });
      }
      if (!tableInfo.en_name) {
        await queryInterface.addColumn("library_branches", "en_name", {
          type: Sequelize.STRING(300),
          allowNull: true,
        });
      }
      if (!tableInfo.desc) {
        await queryInterface.addColumn("library_branches", "desc", {
          type: Sequelize.TEXT,
          allowNull: true,
        });
      }
      if (!tableInfo.stats) {
        await queryInterface.addColumn("library_branches", "stats", {
          type: Sequelize.STRING(150),
          allowNull: true,
          defaultValue: "10+ Mantras & Stotras",
        });
      }
      if (!tableInfo.badge) {
        await queryInterface.addColumn("library_branches", "badge", {
          type: Sequelize.STRING(100),
          allowNull: true,
        });
      }
      if (!tableInfo.deity) {
        await queryInterface.addColumn("library_branches", "deity", {
          type: Sequelize.STRING(100),
          allowNull: true,
        });
      }
      if (!tableInfo.image_key) {
        await queryInterface.addColumn("library_branches", "image_key", {
          type: Sequelize.STRING(600),
          allowNull: true,
        });
      } else {
        await queryInterface.changeColumn("library_branches", "image_key", {
          type: Sequelize.STRING(600),
          allowNull: true,
        });
      }
      if (!tableInfo.order_index) {
        await queryInterface.addColumn("library_branches", "order_index", {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        });
      }
      if (!tableInfo.status) {
        await queryInterface.addColumn("library_branches", "status", {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: "ACTIVE",
        });
      }
    }

    const existingIndexes = await queryInterface.showIndex("library_branches");
    const indexNames = new Set(existingIndexes.map((idx) => idx.name));
    const remainingIndexes = [];

    // Drop any legacy single-column unique index/constraint on slug only
    for (const idx of existingIndexes) {
      const fields = Array.isArray(idx.fields)
        ? idx.fields.map((f) => (typeof f === "string" ? f : f.attribute || f.name))
        : [];
      if (idx.unique && fields.length === 1 && fields[0] === "slug") {
        try {
          await queryInterface.removeIndex("library_branches", idx.name);
        } catch {
          await queryInterface.sequelize.query(
            `ALTER TABLE "library_branches" DROP CONSTRAINT IF EXISTS "${idx.name}";`
          );
        }
        indexNames.delete(idx.name);
      } else {
        remainingIndexes.push(idx);
      }
    }

    const hasIndexOnColumns = (cols) =>
      remainingIndexes.some((idx) => {
        const fields = Array.isArray(idx.fields)
          ? idx.fields.map((f) => (typeof f === "string" ? f : f.attribute || f.name))
          : [];
        return fields.join(",") === cols.join(",");
      });

    if (
      !indexNames.has("library_branches_category_slug_slug_unique") &&
      !remainingIndexes.some((idx) => {
        const fields = Array.isArray(idx.fields)
          ? idx.fields.map((f) => (typeof f === "string" ? f : f.attribute || f.name))
          : [];
        return idx.unique && fields.join(",") === "category_slug,slug";
      })
    ) {
      await queryInterface.addIndex("library_branches", ["category_slug", "slug"], {
        unique: true,
        name: "library_branches_category_slug_slug_unique",
      });
    }
    if (
      !indexNames.has("library_branches_category_slug_idx") &&
      !hasIndexOnColumns(["category_slug"])
    ) {
      await queryInterface.addIndex("library_branches", ["category_slug"], {
        name: "library_branches_category_slug_idx",
      });
    }
    if (!indexNames.has("library_branches_status_idx") && !hasIndexOnColumns(["status"])) {
      await queryInterface.addIndex("library_branches", ["status"], {
        name: "library_branches_status_idx",
      });
    }
    if (
      !indexNames.has("library_branches_order_index_idx") &&
      !hasIndexOnColumns(["order_index"])
    ) {
      await queryInterface.addIndex("library_branches", ["order_index"], {
        name: "library_branches_order_index_idx",
      });
    }
  },

  async down(queryInterface) {
    const rawTables = await queryInterface.showAllTables();
    const tableNames = rawTables.map((t) => (typeof t === "string" ? t : t.tableName));
    if (tableNames.includes("library_branches")) {
      await queryInterface.dropTable("library_branches");
    }
  },
};
