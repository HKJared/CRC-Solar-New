const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class LogModel {
    static async createLog(action, admin_id) {
        const queryString = `
        INSERT INTO logs (action, admin_id)
        VALUES (?, ?)
        `;

        const [result] = await pool.execute(queryString, [action, admin_id]);

        return result.insertId;
    }

    static async getLogs(keyword) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                l.*,
                a.fullname as admin_name,
                a.account as admin_account
            FROM 
                logs l
            JOIN
                admins a ON l.admin_id = a.admin_id
            WHERE
                LOWER(a.fullname) LIKE LOWER(?)
                OR LOWER(a.account) LIKE LOWER(?)
            ORDER BY
                log_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${ keyword }%`, `%${ keyword }%`]);
        return rows;
    }

    static async getOldLogs(created_at) {
        const queryString = `
            SELECT 
                l.*,
                a.fullname as admin_name,
                a.account as admin_account
            FROM 
                logs l
            JOIN
                admins a ON l.admin_id = a.admin_id
            WHERE
                l.create_at < ?
            ORDER BY
                l.create_at DESC
            LIMIT 50
        `;

        const [rows] = await pool.execute(queryString, [created_at]);
        return rows;
    }

    static async getNewLogs(create_at) {
        const queryString = `
            SELECT 
                l.*,
                a.fullname as admin_name,
                a.account as admin_account
            FROM 
                logs l
            JOIN
                admins a ON l.admin_id = a.admin_id
            WHERE
                l.create_at > ?
            ORDER BY
                l.create_at ASC
        `;

        const [rows] = await pool.execute(queryString, [create_at]);
        return rows;
    }

    static async updateDetailLog(detail, log_id) {
        const queryString = `
        UPDATE
            logs
        SET 
            detail = ?
        WHERE
            log_id = ?
        `;

        await pool.execute(queryString, [detail, log_id]);

        return
    }

    static async updateStatusLog(log_id) {
        const queryString = `
        UPDATE
            logs
        SET 
            status = 1
        WHERE
            log_id = ?
        `;

        await pool.execute(queryString, [log_id]);

        return
    }
}

module.exports = LogModel;
