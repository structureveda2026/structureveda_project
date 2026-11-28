"use strict";

module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.describeTable("library_sections");
    } catch {
      // The table is created by LibrarySection.sync in environments where the
      // earlier migrations did not create it. The removed default will not be
      // seeded after this release, so there is nothing to clean up yet.
      return;
    }

    await queryInterface.bulkDelete("library_sections", { slug: "sukti" });
    await queryInterface.bulkDelete("library_sections", { id: "section-sukti" });
  },

  async down(queryInterface) {
    try {
      await queryInterface.describeTable("library_sections");
    } catch {
      return;
    }

    const now = new Date();
    await queryInterface.sequelize.query(
      `INSERT INTO "library_sections" (
        "id", "slug", "name", "en_name", "label", "label_hi", "path",
        "admin_path", "category_slug", "order_index", "status", "is_preset",
        "created_at", "updated_at"
      ) VALUES (
        :id, :slug, :name, :enName, :label, :labelHi, :path, :adminPath,
        :categorySlug, :orderIndex, :status, :isPreset, :createdAt, :updatedAt
      ) ON CONFLICT DO NOTHING`,
      {
        replacements: {
          id: "section-sukti",
          slug: "sukti",
          name: "\u0938\u0942\u0915\u094d\u0924",
          enName: "Suktis",
          label: "Suktis",
          labelHi: "\u0938\u0942\u0915\u094d\u0924",
          path: "/suktis",
          adminPath: "/admin/library/sukti-branches",
          categorySlug: "mantra-stotra",
          orderIndex: 3,
          status: "ACTIVE",
          isPreset: true,
          createdAt: now,
          updatedAt: now,
        },
      }
    );
  },
};
