const pool = require('../config/connectDB');
const { decodeToken } = require('./jwt');
const AdminModel = require('../app/models/adminModel')

const authenticate = async (req, res, next) => {
    try {
        // Lấy token từ header của request
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." });
        }
        // Giải mã token
        const decoded = decodeToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." });
        }

        const admin_id = decoded.admin_id;

        const account = AdminModel.getAdminById(admin_id);

        if (account.token == '') {
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." });
        }

        req.admin_id = admin_id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
};

module.exports = authenticate;