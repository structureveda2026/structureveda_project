"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog_posts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(160),
        allowNull: false,
        unique: true,
      },
      // English Content Fields
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      // Hindi Content Fields (Bilingual support)
      title_hi: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      subtitle_hi: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      excerpt_hi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_hi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      featured_image: {
        type: Sequelize.STRING(600),
        allowNull: true,
      },
      author: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: "Veda Structure Team",
      },
      author_avatar: {
        type: Sequelize.STRING(600),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(120),
        allowNull: false,
        defaultValue: "Vedic Wisdom",
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "Draft",
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      read_time: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "5 min read",
      },
      views_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      meta_title: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meta_title_hi: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      meta_description_hi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meta_keywords: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      published_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("blog_posts", ["slug"], {
      unique: true,
      name: "blog_posts_slug_unique",
    });
    await queryInterface.addIndex("blog_posts", ["status"], {
      name: "blog_posts_status_idx",
    });
    await queryInterface.addIndex("blog_posts", ["category"], {
      name: "blog_posts_category_idx",
    });
    await queryInterface.addIndex("blog_posts", ["published_at"], {
      name: "blog_posts_published_at_idx",
    });
    await queryInterface.addIndex("blog_posts", ["is_featured"], {
      name: "blog_posts_is_featured_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("blog_posts");
  },
};
