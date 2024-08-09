const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class FAQModel {
    static async getFAQs(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                FAQs q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE
                LOWER(q.title) LIKE LOWER(?)
                AND q.language = ? 
            ORDER BY
                q.FAQ_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getFAQById(FAQ_id) {
        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                FAQs q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE 
                q.FAQ_id = ?
        `;

        const [rows] = await pool.execute(queryString, [FAQ_id]);
        return rows[0];
    }

    static async createFAQ(data, language, admin_id) {
        const queryString = `
            INSERT INTO FAQs (title, detail, language, created_by, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.detail, language, admin_id
        ]);

        return result.insertId;
    }

    static async updateFAQ(data, admin_id) {
        const queryString = `
            UPDATE FAQs 
            SET title = ?, detail = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE FAQ_id = ?
        `;

        await pool.execute(queryString, [
            data.title, data.detail, admin_id, data.FAQ_id
        ]);

        return;
    }

    static async deleteFAQ(FAQ_id) {
        const queryString = `
            DELETE FROM FAQs 
            WHERE FAQ_id = ?
        `;

        pool.execute(queryString, [FAQ_id]);
        return;
    }
}

module.exports = FAQModel;
