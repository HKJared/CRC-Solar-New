const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class FAQModel {
    static async getFAQs(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                f.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                faqs f
            JOIN
                admins a ON a.admin_id = f.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = f.updated_by
            WHERE
                LOWER(f.title) LIKE LOWER(?)
                AND f.language = ? 
            ORDER BY
                f.faq_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getFAQById(faq_id) {
        const queryString = `
            SELECT 
                f.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                faqs f
            JOIN
                admins a ON a.admin_id = f.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = f.updated_by
            WHERE 
                f.faq_id = ?
        `;

        const [rows] = await pool.execute(queryString, [faq_id]);
        return rows[0];
    }

    static async createFAQ(data, language, admin_id) {
        const queryString = `
            INSERT INTO faqs (title, detail, language, created_by, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.detail, language, admin_id
        ]);

        return result.insertId;
    }

    static async updateFAQ(data, admin_id) {
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

    static async deleteFAQ(faq_id) {
        const queryString = `
            DELETE FROM faqs 
            WHERE faq_id = ?
        `;

        pool.execute(queryString, [faq_id]);
        return;
    }
}

module.exports = FAQModel;
