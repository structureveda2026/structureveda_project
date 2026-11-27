"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const blogTable = await queryInterface.describeTable("blog_posts");
      const columnsToAdd = [
        { name: "title_hinglish", type: Sequelize.STRING(300) },
        { name: "subtitle_hinglish", type: Sequelize.STRING(300) },
        { name: "excerpt_hinglish", type: Sequelize.TEXT },
        { name: "content_hinglish", type: Sequelize.TEXT },
        { name: "meta_title_hinglish", type: Sequelize.STRING(300) },
        { name: "meta_description_hinglish", type: Sequelize.TEXT },
        { name: "post_type", type: Sequelize.STRING(60), defaultValue: "article" },
        { name: "sanskrit", type: Sequelize.TEXT },
        { name: "deity", type: Sequelize.STRING(150) },
        { name: "rishi", type: Sequelize.STRING(150) },
        { name: "chhandas", type: Sequelize.STRING(150) },
        { name: "meaning", type: Sequelize.TEXT },
        { name: "meaning_hi", type: Sequelize.TEXT },
        { name: "meaning_en", type: Sequelize.TEXT },
        { name: "meaning_hinglish", type: Sequelize.TEXT },
        { name: "hindi_translation", type: Sequelize.TEXT },
        { name: "english_translation", type: Sequelize.TEXT },
        { name: "hinglish_translation", type: Sequelize.TEXT },
        { name: "vidhi", type: Sequelize.TEXT },
        { name: "benefits", type: Sequelize.TEXT },
      ];

      for (const col of columnsToAdd) {
        if (!blogTable[col.name]) {
          await queryInterface.addColumn("blog_posts", col.name, {
            type: col.type,
            allowNull: true,
            defaultValue: col.defaultValue,
          });
        }
      }
    } catch (e) {
      // blog_posts table not yet migrated or offline
    }

    try {
      const vedaMantraTable = await queryInterface.describeTable("veda_mantras");
      if (!vedaMantraTable.purport) {
        await queryInterface.addColumn("veda_mantras", "purport", {
          type: Sequelize.TEXT,
          allowNull: true,
        });
      }
    } catch (e) {
      // veda_mantras not present
    }
  },

  async down(queryInterface) {
    // down migrations
  },
};
