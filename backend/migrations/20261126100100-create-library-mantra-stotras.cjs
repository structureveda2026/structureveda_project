"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const rawTables = await queryInterface.showAllTables();
    const tableNames = rawTables.map((t) => (typeof t === "string" ? t : t.tableName));

    if (!tableNames.includes("library_mantra_stotras")) {
      await queryInterface.createTable("library_mantra_stotras", {
        id: {
          type: Sequelize.STRING(120),
          allowNull: false,
          primaryKey: true,
        },
        slug: {
          type: Sequelize.STRING(160),
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: "mantra",
        },
        category_slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: "mantra",
        },
        branch_id: {
          type: Sequelize.STRING(100),
          allowNull: true,
          references: {
            model: "library_branches",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        branch_slug: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        deity: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        deity_hi: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        title: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        title_hi: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        subtitle: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        subtitle_hi: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        source_ref: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        featured_image: {
          type: Sequelize.STRING(600),
          allowNull: true,
        },
        sanskrit: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        transliteration: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        hindi_translation: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        english_translation: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        hinglish_translation: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        verses: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: [],
        },
        canon_anga: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        vidhi: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
        },
        benefits: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: [],
        },
        count: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        rishi: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        chhandas: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        astrological_remedy: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        tags: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: [],
        },
        audio_url: {
          type: Sequelize.STRING(600),
          allowNull: true,
        },
        read_time: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        views_count: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        is_featured: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    }

    const existingIndexes = await queryInterface.showIndex("library_mantra_stotras");
    const indexNames = new Set(existingIndexes.map((idx) => idx.name));
    const hasIndexOnColumns = (cols) =>
      existingIndexes.some((idx) => {
        const fields = Array.isArray(idx.fields)
          ? idx.fields.map((f) => (typeof f === "string" ? f : f.attribute || f.name))
          : [];
        return fields.join(",") === cols.join(",");
      });

    if (
      !indexNames.has("library_mantra_stotras_category_slug_slug_unique") &&
      !existingIndexes.some((idx) => {
        const fields = Array.isArray(idx.fields)
          ? idx.fields.map((f) => (typeof f === "string" ? f : f.attribute || f.name))
          : [];
        return idx.unique && fields.join(",") === "category_slug,slug";
      })
    ) {
      await queryInterface.addIndex("library_mantra_stotras", ["category_slug", "slug"], {
        unique: true,
        name: "library_mantra_stotras_category_slug_slug_unique",
      });
    }
    if (!indexNames.has("library_mantra_stotras_slug_idx") && !hasIndexOnColumns(["slug"])) {
      await queryInterface.addIndex("library_mantra_stotras", ["slug"], {
        name: "library_mantra_stotras_slug_idx",
      });
    }
    if (!indexNames.has("library_mantra_stotras_type_idx") && !hasIndexOnColumns(["type"])) {
      await queryInterface.addIndex("library_mantra_stotras", ["type"], {
        name: "library_mantra_stotras_type_idx",
      });
    }
    if (
      !indexNames.has("library_mantra_stotras_category_slug_idx") &&
      !hasIndexOnColumns(["category_slug"])
    ) {
      await queryInterface.addIndex("library_mantra_stotras", ["category_slug"], {
        name: "library_mantra_stotras_category_slug_idx",
      });
    }
    if (
      !indexNames.has("library_mantra_stotras_branch_id_idx") &&
      !hasIndexOnColumns(["branch_id"])
    ) {
      await queryInterface.addIndex("library_mantra_stotras", ["branch_id"], {
        name: "library_mantra_stotras_branch_id_idx",
      });
    }
    if (
      !indexNames.has("library_mantra_stotras_branch_slug_idx") &&
      !hasIndexOnColumns(["branch_slug"])
    ) {
      await queryInterface.addIndex("library_mantra_stotras", ["branch_slug"], {
        name: "library_mantra_stotras_branch_slug_idx",
      });
    }
    if (!indexNames.has("library_mantra_stotras_deity_idx") && !hasIndexOnColumns(["deity"])) {
      await queryInterface.addIndex("library_mantra_stotras", ["deity"], {
        name: "library_mantra_stotras_deity_idx",
      });
    }
    if (!indexNames.has("library_mantra_stotras_status_idx") && !hasIndexOnColumns(["status"])) {
      await queryInterface.addIndex("library_mantra_stotras", ["status"], {
        name: "library_mantra_stotras_status_idx",
      });
    }
  },

  async down(queryInterface) {
    const rawTables = await queryInterface.showAllTables();
    const tableNames = rawTables.map((t) => (typeof t === "string" ? t : t.tableName));
    if (tableNames.includes("library_mantra_stotras")) {
      await queryInterface.dropTable("library_mantra_stotras");
    }
  },
};
