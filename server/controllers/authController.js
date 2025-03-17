const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
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
        const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        //////////////////////////// BURADA KALDIK GARDAŞ ////////////////////////////

    } catch (error) {

    }
};