const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class DisplayModel {
    static async updateDisplayText(data, page, language, admin_id) {
        const queryString = `
            UPDATE
                display_texts
            SET 
                detail = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE 
                element_id = ?
                AND language = ?
                AND page = ?
        `;

        await pool.execute(queryString, [data.detail, admin_id, data.element_id, language, page]);
    }

    static async getOldImageByElementId(element_id, page) {
        const queryString = `
            SELECT
                *
            FROM
                display_images
            WHERE
                element_id = ?
        `;
        const [rows] = await pool.execute(queryString, [element_id]);
        return rows[0];
    }

    static async updateDisplayImage(data, page, admin_id) {
        const queryString = `
            UPDATE
                display_images
            SET 
                src = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE 
                element_id = ?
                AND page = ?
        `;

        await pool.execute(queryString, [data.src, admin_id, data.element_id, page]);
    }
}

module.exports = DisplayModel;