const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

// Hàm mã hóa: Tạo token khi người dùng đăng nhập thành công
const generateToken = (admin_id) => {
    return jwt.sign(admin_id, config.accessSecret, { expiresIn: '24h' });
};

// Hàm mã hóa: Tạo Refresh Token
const generateRefreshToken = (admin_id) => {
    return jwt.sign(admin_id, config.refreshSecret, { expiresIn: '7d' });
};

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.accessSecret);
        
        return decoded;
    } catch (error) {
        console.error('Failed to decode token: ', error);
        return null;
    }
};

module.exports = { generateToken, decodeToken, generateRefreshToken };
