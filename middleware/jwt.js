const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

// Hàm mã hóa: Tạo token khi người dùng đăng nhập thành công
const generateToken = (admin_id) => {
    return jwt.sign({ admin_id: admin_id }, config.accessSecret, { expiresIn: '2m' });
};

// Hàm mã hóa: Tạo Refresh Token
const generateRefreshToken = (admin_id) => {
    return jwt.sign({ admin_id: admin_id }, config.refreshSecret, { expiresIn: '1d' });
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

const decodeRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.refreshSecret);
        return decoded;
    } catch (error) {
        console.error('Failed to decode refresh token: ', error);
        return null;
    }
};

module.exports = { generateToken, decodeToken, generateRefreshToken, decodeRefreshToken };
