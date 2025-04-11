const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Note = require('../models/Note');
const { Op } = require('sequelize');
const { sendVerificationEmail } = require('../services/emailService');
const crypto = require('crypto');

// Validate Registration - Check if username, email and password are valid
const validateRegistration = (username, email, password) => {
    const errors = {};

    if (!username || username.length < 3 || username.length > 30) {
        errors.username = "Username must be between 3-30 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = "Invalid email format";
    }

    if (!password || password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, language } = req.body;

        // Validate input
        const validation = validateRegistration(username, email, password);
        if (!validation.isValid) {
            return res.status(400).json({ message: "Validation error", errors: validation.errors });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email.toLowerCase().trim() },
                    { username: username.trim() }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                errors: {
                    email: existingUser.email === email.toLowerCase().trim() ? "Email already in use" : undefined,
                    username: existingUser.username === username.trim() ? "Username already in use" : undefined
                }
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Hash password with stronger security
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with sanitized inputs
        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires,
            isVerified: false
        });

        // Create note
        await Note.create({
            username: newUser.username,
            email: newUser.email,
            noteData: { notes: [] }
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(email.toLowerCase().trim(), verificationToken, language);

        if (emailSent) {
            res.status(201).json({
                message: "User registered successfully. Please check your email to verify your account."
            });
        } else {
            // Even if email fails, user is registered
            res.status(201).json({
                message: "User registered successfully, but verification email could not be sent. Please contact support."
            });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "An error occurred during registration." });
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({
            where: {
                verificationToken: token,
                verificationTokenExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        // Update user as verified
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: "An error occurred during email verification" });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier.toLowerCase().trim() },
                    { username: identifier.trim() }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in." });
        }

        // Create JWT tokens
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
        );

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "An error occurred during login." });
    }
};

// Logout User
exports.logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await User.update(
                { refreshToken: null },
                { where: { refreshToken } }
            );
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/'
        });

        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "An error occurred during logout." });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "Refresh token is required." });
        }

        // Check if token exists in database
        const userFromDB = await User.findOne({ where: { refreshToken: token } });
        if (!userFromDB) {
            return res.status(401).json({ message: "Invalid refresh token." });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token." });
            }

            // Create new access token 
            const accessToken = jwt.sign(
                { id: userFromDB.id, username: userFromDB.username, email: userFromDB.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY || "15m" }
            );

            return res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ message: "An error occurred while refreshing token." });
    }
};