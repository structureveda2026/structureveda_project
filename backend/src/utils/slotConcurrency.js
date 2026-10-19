import { Op } from "sequelize";

/**
 * Normalizes an astrologer code, consultation date, and consultation time slot
 * into a single deterministic canonical string for PostgreSQL advisory locks.
 *
 * @param {string} astrologerId - Astrologer code or identifier
 * @param {string} consultationDate - Date string (YYYY-MM-DD)
 * @param {string} consultationTime - Time slot string (e.g. "10:00 AM - 10:30 AM")
 * @returns {string} Canonical slot lock key
 */
export const getCanonicalSlotLockKey = (astrologerId, consultationDate, consultationTime) => {
  const code = String(astrologerId || "").trim().toLowerCase();
  const date = String(consultationDate || "").trim().split("T")[0];
  const time = String(consultationTime || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

  return `astrologer_slot:${code}:${date}:${time}`;
};

/**
 * Returns today's date formatted as YYYY-MM-DD in the Asia/Kolkata timezone (IST, UTC+05:30).
 * Eliminates the 5.5 hour UTC midnight skew where customers in India cross into
 * the next calendar day ahead of UTC.
 *
 * @returns {string} Current date string in YYYY-MM-DD
 */
export const getTodayDateInKolkata = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

/**
 * Acquires a transaction-scoped PostgreSQL advisory lock on a canonical slot key.
 * Automatically releases when the transaction commits or rolls back.
 *
 * @param {Object} sequelize - Sequelize instance
 * @param {string} lockKey - Canonical slot lock key
 * @param {Object} transaction - Active Sequelize transaction
 */
export const acquireSlotAdvisoryLock = async (sequelize, lockKey, transaction) => {
  if (!transaction) {
    throw new Error("Cannot acquire transaction-scoped advisory lock without an active transaction.");
  }
  await sequelize.query("SELECT pg_advisory_xact_lock(hashtext(:lockKey))", {
    replacements: { lockKey },
    transaction,
  });
};

/**
 * Checks whether a given consultation slot is currently occupied by:
 * 1. A Confirmed, Rescheduled, or Completed booking.
 * 2. An active Pending/Pending reservation within the 15-minute checkout window.
 *
 * @param {Object} params
 * @param {Object} params.Booking - Sequelize Booking model
 * @param {string} params.astrologerId - Astrologer code
 * @param {string} params.consultationDate - Date string (YYYY-MM-DD)
 * @param {string} params.consultationTime - Canonical time slot
 * @param {string|null} [params.excludeBookingId=null] - Booking ID to exclude (e.g. self during reschedule/payment)
 * @param {Object} params.transaction - Active Sequelize transaction
 * @returns {Promise<Object|null>} Conflicting booking instance or null
 */
export const checkSlotConflict = async ({
  Booking,
  astrologerId,
  consultationDate,
  consultationTime,
  excludeBookingId = null,
  transaction,
}) => {
  const code = String(astrologerId || "").trim();
  const date = String(consultationDate || "").trim().split("T")[0];
  const time = String(consultationTime || "").trim().replace(/\s+/g, " ").toUpperCase();

  const whereClause = {
    astrologerId: code,
    consultationDate: date,
    consultationTime: time,
    [Op.or]: [
      { bookingStatus: { [Op.in]: ["Confirmed", "Rescheduled", "Completed"] } },
      {
        bookingStatus: "Pending",
        paymentStatus: "Pending",
        createdAt: {
          [Op.gte]: new Date(Date.now() - 15 * 60 * 1000), // Active 15-minute checkout window
        },
      },
    ],
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const conflict = await Booking.findOne({
    where: whereClause,
    transaction,
  });

  return conflict;
};
