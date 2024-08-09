const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const picturesPerPage = 20;

class PictureModel {
    static async createPicture(data, admin_id) {
        const queryString = `
            INSERT INTO pictures (src, tag, size, created_by, created_at) VALUES
            (?, ?, ?, ? , CURRENT_TIMESTAMP())
        `;
        const [result] = await pool.execute(queryString, [data.src, data.tag, data.size, admin_id]);

        return result.insertId;
    }

    static async getPictures(keyword, page) {
        keyword = diacritics.remove(keyword);
        
        const offset = picturesPerPage * (page - 1);

        const queryString = `
            SELECT 
                p.*,
                a.fullname as admin_name
            FROM 
                pictures p
            JOIN
                admins a ON a.admin_id = p.created_by
            WHERE
                LOWER(p.tag) LIKE LOWER(?)
            ORDER BY
                p.picture_id DESC
            LIMIT
                ${ picturesPerPage }
            OFFSET
                ${ offset }
        `;
    
        const [rows] = await pool.execute(queryString, [`%${keyword}%`]);
        return rows;
    }

    static async getPictureById(picture_id) {
        const queryString = `
        SELECT 
            p.*,
            a.fullname as admin_name
        FROM 
            pictures p
        JOIN
            admins a ON a.admin_id = p.created_by
        WHERE
            p.picture_id = ?
    `;

    const [rows] = await pool.execute(queryString, [picture_id]);
    return rows[0];
    }

    static async deletePicture(picture_id) {
        const queryString = `
            DELETE FROM
                pictures
            WHERE
                picture_id = ?
        `;

        await pool.execute(queryString, [picture_id]);

        return
    }
}

module.exports = PictureModel;