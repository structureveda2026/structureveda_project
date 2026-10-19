"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * DB-REL-01: Backward-compatible Astrologer foreign-key migration.
     *
     * Architectural Rationale:
     * - Adds `astrologer_uuid` referencing `astrologers(id)` with ON UPDATE CASCADE / ON DELETE SET NULL.
     * - Backfills existing booking rows by mapping `bookings.astrologerId` (code string) to `astrologers.code`.
     * - Preserves the legacy `astrologerId` column untouched for full backward compatibility
     *   with existing slot indexes, controllers, and queries.
     *
     * Note: Execution left pending until staging/test database is approved.
     */
    await queryInterface.addColumn("bookings", "astrologer_uuid", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "astrologers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Backfill astrologer_uuid from astrologers table matching on code
    await queryInterface.sequelize.query(`
      UPDATE bookings b
      SET "astrologer_uuid" = a.id
      FROM astrologers a
      WHERE b."astrologerId" = a.code;
    `);

    // Add index on the new foreign key column
    await queryInterface.addIndex("bookings", ["astrologer_uuid"], {
      name: "idx_bookings_astrologer_uuid",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("bookings", "idx_bookings_astrologer_uuid");
    await queryInterface.removeColumn("bookings", "astrologer_uuid");
  },
};
