const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controllers/authController.js");
const authenticateToken = require("../middlewares/authMiddleware.js");


const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 login attempts per 5 minutes
    message: "Too many login attempts. Please try again after 5 minutes."
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registration attempts per hour
    message: "Too many registration attempts. Please try again later."
});

const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 refresh attempts per minute
    message: "Too many refresh attempts. Please try again later."
});

router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh-token", refreshLimiter, refreshToken);
router.post("/logout", logoutUser);

module.exports = router;