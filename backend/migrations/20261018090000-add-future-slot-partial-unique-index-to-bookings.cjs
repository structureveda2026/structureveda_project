"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Phase 4A: Partial unique index covering Confirmed, Rescheduled, and Completed bookings.
     *
     * Architectural Rationale:
     * - Protects astrologer consultation slots from concurrent duplicate bookings.
     * - Includes 'Confirmed', 'Rescheduled', and 'Completed' per Phase 4A Option A decision.
     * - Date cutoff '2026-10-01' safely accommodates the two historical duplicate booking pairs
     *   created in August and September 2026 (VB-577951/VB-498761 and VB-202053/VB-704897)
     *   without mutating, modifying, or arbitrarily deleting historical data.
     * - Past-date booking and rescheduling are strictly prohibited in application controllers.
     *
     * Limitation:
     * Historical duplicate pairs prior to 2026-10-01 remain unindexed and unresolved in the database.
     */
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_active_astrologer_slot
      ON bookings ("astrologerId", "consultationDate", "consultationTime")
      WHERE "bookingStatus" IN ('Confirmed', 'Rescheduled', 'Completed')
        AND "consultationDate" >= '2026-10-01';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS unique_active_astrologer_slot;
    `);
  },
};
