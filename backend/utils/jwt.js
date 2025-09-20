const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(401).json({ error: 'Token not found' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const generateToken = (userData) => {
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h'
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn });
};

module.exports = { jwtAuthMiddleware, generateToken };
