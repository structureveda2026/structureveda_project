/**
 * In-Memory Sliding-Window Rate Limiter Middleware (SEC-REF-01)
 *
 * Provides IP-based rate limiting for public endpoints without external dependencies.
 * Protects against brute-force enumeration of 6-digit booking references and
 * denial-of-service / excessive payment initiation attempts.
 */

const clientStore = new Map();

/**
 * Cleanup expired entries every 5 minutes to prevent memory leak
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of clientStore.entries()) {
    if (now - record.resetTime > 60000) {
      clientStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Creates a rate limiter middleware
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 60,000 = 1 minute)
 * @param {number} options.max - Maximum requests allowed within windowMs (default: 30)
 * @param {string} options.message - Error message when rate limit exceeded
 * @returns {Function} Express middleware
 */
export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 30,
  message = "Too many requests. Please try again later.",
} = {}) => {
  return (req, res, next) => {
    // In test environment, skip rate limiting to avoid test interference
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const key = `${req.baseUrl || ""}${req.path}_${ip}`;
    const now = Date.now();

    let record = clientStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      clientStore.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSec,
      });
    }

    next();
  };
};

/**
 * Preset: Public booking lookup limiter
 * 60 requests per minute per IP (protects enumeration of 6-digit booking references)
 */
export const bookingLookupLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many booking lookup requests. Please slow down and try again.",
});

/**
 * Preset: Payment initiation limiter
 * 15 payment order creations per minute per IP (prevents payment session flood)
 */
export const paymentInitiationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: "Too many payment initiation attempts. Please wait a moment before trying again.",
});

export default {
  createRateLimiter,
  bookingLookupLimiter,
  paymentInitiationLimiter,
};
