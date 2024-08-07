const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const requestPerPage = 20;

class RequestModel {
    static async getRequests(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        const offset = (page - 1) * requestPerPage;
        
        const queryString = `
            SELECT 
                *
            FROM 
                requests
            WHERE
                (LOWER(fullname) LIKE LOWER(?)
                OR LOWER(email) LIKE LOWER(?)
                OR LOWER(phone_number) LIKE LOWER(?)
                OR request_id = ?)
                AND language = ?
            ORDER BY
                request_id DESC
            LIMIT
                ${ requestPerPage }
            OFFSET
                ${ offset }
        `;
    
        try {
            const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, keyword, language]);
            return rows;
        } catch (error) {
            console.error('Error executing getRequests query:', error);
            throw error;
        }
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
                fullname, email, phone_number, message, language
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(queryString, [
            data.fullname, data.email, data.phone_number, data.message, language
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
