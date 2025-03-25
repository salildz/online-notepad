const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Note = require('../models/note');
const { Op } = require('sequelize');

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
        if (!!existingUser) {
            return res.status(400).json({ message: "Email or username already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        await User.create({ username, email, password: hashedPassword });
        // Create note
        await Note.create({ username, email, noteData: { notes: [] } });

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error while registering!" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { username: identifier }] } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Create JWT
        const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();

        // Cookie options
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            secure: process.env.NODE_ENV === "production",
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: "Server Error while logging in!" + error });
    }
};

// Logout User
exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(401).json({ message: "User not authenticated." });

        const user = await User.findOne({ where: { refreshToken: token } });
        if (!user)
            return res.status(404).json({ message: "User not found." });

        user.refreshToken = null;
        await user.save();

        // Clear cookie
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "User logged out." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error while logging out!" });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(401).json({ message: "User not authenticated." });

        const user = await User.findOne({ where: { refreshToken: token } });
        if (!user)
            return res.status(404).json({ message: "Invalid refresh token." });

        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
            if (err)
                return res.status(403).json({ message: "Invalid refresh token." });

            const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
            return res.status(200).json({ accessToken });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error while refreshing token!" });
    }
}; 