"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Vedas Table (Rigveda, Yajurveda, Samaveda, Atharvaveda)
    await queryInterface.createTable("vedas", {
      id: {
        type: Sequelize.STRING(60),
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      en_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      eyebrow: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      intro: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      overview_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      stats: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      priest: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      badge: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image_key: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      banner_image: {
        type: Sequelize.STRING(600),
        allowNull: true,
      },
      quick_info: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      rishis: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      deities: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      available_texts: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      related_granthas: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
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

    await queryInterface.addIndex("vedas", ["slug"], {
      unique: true,
      name: "vedas_slug_unique",
    });
    await queryInterface.addIndex("vedas", ["status"], {
      name: "vedas_status_idx",
    });
    await queryInterface.addIndex("vedas", ["order_index"], {
      name: "vedas_order_index_idx",
    });

    // 2. Veda Nodes Table (Hierarchical Branches: Shakhas, Samhitas, Brahmanas, Aranyakas, Upanishads, Mandalas, Kandas, Adhyayas, Suktas)
    await queryInterface.createTable("veda_nodes", {
      id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      veda_id: {
        type: Sequelize.STRING(60),
        allowNull: false,
        references: {
          model: "vedas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      parent_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        references: {
          model: "veda_nodes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      node_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "SUKTA",
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
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      priest: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      badge: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image_key: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      mantra_id: {
        type: Sequelize.STRING(100),
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

    await queryInterface.addIndex("veda_nodes", ["veda_id"], {
      name: "veda_nodes_veda_id_idx",
    });
    await queryInterface.addIndex("veda_nodes", ["parent_id"], {
      name: "veda_nodes_parent_id_idx",
    });
    await queryInterface.addIndex("veda_nodes", ["node_type"], {
      name: "veda_nodes_node_type_idx",
    });
    await queryInterface.addIndex("veda_nodes", ["status"], {
      name: "veda_nodes_status_idx",
    });

    // 3. Veda Mantras Table (Sanskrit, IAST, Hindi, English, Hinglish, Padapatha, Shastric Context)
    await queryInterface.createTable("veda_mantras", {
      id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      veda_id: {
        type: Sequelize.STRING(60),
        allowNull: false,
        references: {
          model: "vedas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      node_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        references: {
          model: "veda_nodes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      veda_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      shakha: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      text_name: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      section_ref: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      mantra_number: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      rishi: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      devata: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      chhanda: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      svara: {
        type: Sequelize.STRING(200),
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
        allowNull: false,
      },
      english_translation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hinglish_translation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      padapatha: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      shastric_context: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      audio_url: {
        type: Sequelize.STRING(600),
        allowNull: true,
      },
      previous_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      next_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      chapter_mantra_ids: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
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

    await queryInterface.addIndex("veda_mantras", ["veda_id"], {
      name: "veda_mantras_veda_id_idx",
    });
    await queryInterface.addIndex("veda_mantras", ["node_id"], {
      name: "veda_mantras_node_id_idx",
    });
    await queryInterface.addIndex("veda_mantras", ["mantra_number"], {
      name: "veda_mantras_mantra_number_idx",
    });
    await queryInterface.addIndex("veda_mantras", ["status"], {
      name: "veda_mantras_status_idx",
    });
    await queryInterface.addIndex("veda_mantras", ["rishi"], {
      name: "veda_mantras_rishi_idx",
    });
    await queryInterface.addIndex("veda_mantras", ["devata"], {
      name: "veda_mantras_devata_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("veda_mantras");
    await queryInterface.dropTable("veda_nodes");
    await queryInterface.dropTable("vedas");
  },
};
