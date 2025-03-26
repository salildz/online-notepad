const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("No token provided");
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateToken;