const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class RecruitmentModel {
    static async getRecruitments(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                *
            FROM 
                recruitments
            WHERE
                LOWER(position) LIKE LOWER(?)
                AND language = ?
            ORDER BY
                recruitment_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getRecruitmentById(recruitment_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                recruitments
            WHERE 
                recruitment_id = ?
        `;

        const [rows] = await pool.execute(queryString, [recruitment_id]);
        return rows[0];
    }

    static async createRecruitment(data, language, admin_id) {
        const queryString = `
            INSERT INTO recruitments (
                position, department, location, quantity, salary_range, 
                experience_required, application_deadline, detail, language, 
                created_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.position, data.department, data.location, data.quantity, data.salary_range, 
            data.experience_required, data.application_deadline, data.detail, language, 
            admin_id
        ]);

        return result.insertId;
    }

    static async updateRecruitment(data, admin_id) {
        const queryString = `
            UPDATE recruitments 
            SET position = ?, department = ?, location = ?, quantity = ?, salary_range = ?, 
                experience_required = ?, application_deadline = ?, detail = ?,
                updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE recruitment_id = ?
        `;

        await pool.execute(queryString, [
            data.position, data.department, data.location, data.quantity, data.salary_range, 
            data.experience_required, data.application_deadline, data.detail,
            admin_id, recruitment_id
        ]);

        return;
    }

    static async deleteRecruitment(recruitment_id) {
        const queryString = `
            DELETE FROM recruitments 
            WHERE recruitment_id = ?
        `;

        await pool.execute(queryString, [recruitment_id]);
        return;
    }
}

module.exports = RecruitmentModel;
