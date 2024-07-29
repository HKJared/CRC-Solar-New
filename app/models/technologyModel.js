const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class TechnologyModel {
    static async getTechnologies(language) {
        const queryString = `
            SELECT
                technology_id, technology_name, description, image
            FROM
                technologies
            WHERE
                language = ?
            ORDER BY
                technology_id DESC
        `;

        const [rows] = await pool.execute(queryString, [language]);

        return rows;
    }

    static async getTechnologyById(technology_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                technologies
            WHERE 
                technology_id = ?
        `;

        const [rows] = await pool.execute(queryString, [technology_id]);
        return rows[0];
    }

    static async getTechnologyByName(technology_name) {
        const queryString = `
            SELECT 
                *
            FROM 
                technologies
            WHERE 
                technology_name = ?
        `;

        const [rows] = await pool.execute(queryString, [technology_name]);
        return rows[0];
    }
}

module.exports = TechnologyModel;
