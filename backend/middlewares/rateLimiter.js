const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Limit each IP to 1000 requests per `window` (
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Rate limit exceeded for this client',
});

module.exports = rateLimiter;
