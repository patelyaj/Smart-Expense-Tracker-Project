import rateLimit from "express-rate-limit"

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
    // 50 times in 15 min
  max: 1000,
  message: {
    message: "Too many requests from this IP. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
//   5 times in 5 min
  max: 10, 
  message: {
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});