const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

recruitmentsPerPage = 20;

class RecruitmentModel {
    static async getRecruitments(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        const offset = recruitmentsPerPage * (page - 1);

        const queryString = `
            SELECT 
                *
            FROM 
                recruitments
            WHERE
                (LOWER(position) LIKE LOWER(?)
                OR LOWER(department) LIKE LOWER(?))
                AND language = ?
            ORDER BY
                recruitment_id DESC
            LIMIT
                ${ recruitmentsPerPage }
            OFFSET
                ${ offset }
            
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, language]);
        return rows;
    }

    static async getRecruitmentById(recruitment_id) {
        const queryString = `
            SELECT 
                r.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name 
            FROM 
                recruitments r
            JOIN
                admins a ON r.created_by = a.admin_id
            LEFT JOIN 
                admins ua ON r.updated_by = ua.admin_id
            WHERE 
                r.recruitment_id = ?
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
            admin_id, data.recruitment_id
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
