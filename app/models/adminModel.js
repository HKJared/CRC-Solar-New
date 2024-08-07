const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class AdminModel {
    static async getAdmins() {
        const queryString = `
            SELECT 
                *
            FROM 
                admins
            ORDER BY
                admin_id DESC
        `;

        const [rows] = await pool.execute(queryString);
        return rows;
    }

    static async getDataAdmins(keyword) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                *
            FROM 
                admins
            WHERE
                LOWER(fullname) like LOWER(?)
                AND role = ?
            ORDER BY
                status DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, 'data_admin']);
        return rows;
    }

    static async getAdminById(admin_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                admins
            WHERE 
                admin_id = ?
        `;

        const [rows] = await pool.execute(queryString, [admin_id]);
        return rows[0];
    }

    static async getAdminByAccount(account) {
        const queryString = `
            SELECT 
                *
            FROM 
                admins
            WHERE
                account = ?
        `;

        const [rows] = await pool.execute(queryString, [account]);
        return rows[0];
    }


    static async getAdminByToken(token) {
        const queryString = `
            SELECT 
                *
            FROM 
                admins
            WHERE 
                token = ?
        `;

        const [rows] = await pool.execute(queryString, [token]);
        return rows[0];
    }

    static async createAdmin(data) {
        const queryString = `
            INSERT INTO admins (
                account, password, fullname, phone_number, email, role
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(queryString, [
            data.account, data.password, data.fullname, data.phone_number, data.email, 'data_admin'
        ]);

        return result.insertId;
    }

    static async updateAdmin(data, admin_id) {
        const queryString = `
            UPDATE admins 
            SET password = ?, fullname = ?, id_active
            WHERE admin_id = ?
        `;

        await pool.execute(queryString, [
            data.password, data.fullname, data.id_active, admin_id
        ]);

        return;
    }

    static async toggleAdminStatus(admin_id) {
        const [row] = await pool.execute('SELECT status FROM admins WHERE admin_id = ?', [admin_id]);

        const newStatus = !row[0].status;

        await pool.execute('UPDATE admins SET status = ? WHERE admin_id = ?', [newStatus, admin_id]);

        return
    }

    static async setRefreshToken(refresh_token, admin_id) {
        const queryString = `
            UPDATE
                admins
            SET 
                refresh_token = ?
            WHERE
                admin_id = ?
        `;

        await pool.execute(queryString, [refresh_token, admin_id]);

        return
    }

    static async removeRefreshToken(admin_id) {
        const queryString = `
            UPDATE
                admins
            SET
                refresh_token = NULL
            WHERE
                admin_id = ?
        `;
        
        await pool.execute(queryString, [admin_id]);

        return
    }

    static async deleteAdmin(admin_id) {
        const queryString = `
            DELETE FROM admins 
            WHERE admin_id = ?
        `;

        await pool.execute(queryString, [admin_id]);
        return;
    }
}

module.exports = AdminModel;
