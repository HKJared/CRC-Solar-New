const pool = require('../config/connectDB');
const { decodeToken } = require('./jwt');
const AdminModel = require('../app/models/adminModel');
const LogModel = require('../app/models/logModel');

// Phân quyền
const roles = {
    Adminstrator: ['create account data admin', 'update account data admin', 'create', 'read', 'update', 'delete', 'delete product image'],
    data_admin: ['create', 'read', 'update', 'delete product image'],
    user: ['read']
};
  
// Middleware xác thực quyền
const authorize = async (req, res, permission, next) => {
    try {
        // Lấy token từ header của request
        const token = req.headers.authentication;

        let log_id;

        if (!token) {
            log_id = await LogModel.createLog(permission, 0);
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
        }
        // Giải mã token
        const decoded = decodeToken(token);

        if (!decoded) {
            log_id = await LogModel.createLog(permission, 0);
            return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
        }

        const admin_id = decoded.admin_id;
        log_id = await LogModel.createLog(permission, admin_id);
        let admin_role = ``;
        
        const account = await AdminModel.getAdminById(admin_id);
        
        if (!account.status) {
            await LogModel.updateDetailLog('Tài khoản bị vô hiệu hóa.', log_id);
            return res.status(401).json({ message: "Tài khoản đã bị vô hiệu hóa, hãy liên hệ với quản trị viên." });
        }

        admin_role = account.role;
        req.log_id = log_id;
        
        if (roles[admin_role] && roles[admin_role].includes(permission)) {
            req.role = admin_role;
            req.admin_id = admin_id;
            next(); // Người dùng có quyền
        } else {
            await LogModel.updateDetailLog('Tài khoản không được cấp quyền.', log_id);
            res.status(403).json({ message: 'Từ chối truy cập' }); // Người dùng không có quyền
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
};

module.exports = authorize;