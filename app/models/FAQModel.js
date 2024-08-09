const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class faqModel {
    static async getfaqs(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                faqs q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE
                LOWER(q.title) LIKE LOWER(?)
                AND q.language = ? 
            ORDER BY
                q.faq_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getfaqById(faq_id) {
        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                faqs q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE 
                q.faq_id = ?
        `;

        const [rows] = await pool.execute(queryString, [faq_id]);
        return rows[0];
    }

    static async createfaq(data, language, admin_id) {
        const queryString = `
            INSERT INTO faqs (title, detail, language, created_by, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.detail, language, admin_id
        ]);

        return result.insertId;
    }

    static async updatefaq(data, admin_id) {
        const queryString = `
            UPDATE faqs 
            SET title = ?, detail = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE faq_id = ?
        `;

        await pool.execute(queryString, [
            data.title, data.detail, admin_id, data.faq_id
        ]);

        return;
    }

    static async deletefaq(faq_id) {
        const queryString = `
            DELETE FROM faqs 
            WHERE faq_id = ?
        `;

        pool.execute(queryString, [faq_id]);
        return;
    }
}

module.exports = faqModel;
