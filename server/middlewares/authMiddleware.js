const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("No token provided");
        return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Access Denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid token");
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;