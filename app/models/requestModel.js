const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class RequestModel {
    static async getRequests(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                *
            FROM 
                requests
            WHERE
                (LOWER(fullname) LIKE LOWER(?)
                OR LOWER(email) LIKE LOWER(?)
                OR LOWER(phone) LIKE LOWER(?))
                AND language = ?
            ORDER BY
                status, request_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, language]);
        return rows;
    }

    static async getRequestById(request_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                requests
            WHERE 
                request_id = ?
        `;

        const [rows] = await pool.execute(queryString, [request_id]);
        return rows[0];
    }

    static async createRequest(data, language) {
        const queryString = `
            INSERT INTO requests (
                fullname, email, phone, detail, language
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(queryString, [
            data.fullname, data.email, data.phone, data.detail, language
        ]);

        return result.insertId;
    }

    static async updateRequest(request_id, admin_id) {
        const queryString = `
            UPDATE requests 
            SET status = 1, 
                updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE request_id = ?
        `;

        await pool.execute(queryString, [
            admin_id, request_id
        ]);

        return;
    }

    static async deleteRequest(request_id) {
        const queryString = `
            DELETE FROM requests 
            WHERE request_id = ?
        `;

        await pool.execute(queryString, [request_id]);
        return;
    }
}

module.exports = RequestModel;
