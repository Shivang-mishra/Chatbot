const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
    }
    next();
};
