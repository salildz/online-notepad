const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controllers/authController.js");


const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    messsage: "Too many login attempts. Please try again after 5 minutes."
});

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

module.exports = router;