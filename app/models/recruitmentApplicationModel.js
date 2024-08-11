const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const recruitmentApplicationsPerPage = 20;

class RecruitmentApplicationModel {
    static async getRecruitmentApplications(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        const offset = recruitmentApplicationsPerPage * (page - 1);

        const queryString = `
            SELECT 
                *
            FROM 
                recruitmentApplications
            WHERE
                (LOWER(position) LIKE LOWER(?)
                OR LOWER(department) LIKE LOWER(?))
                AND language = ?
            ORDER BY
                recruitmentApplication_id DESC
            LIMIT
                ${ recruitmentApplicationsPerPage }
            OFFSET
                ${ offset }
            
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, language]);
        return rows;
    }

    static async getRecruitmentApplicationById(recruitmentApplication_id) {
        const queryString = `
            SELECT 
                r.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name 
            FROM 
                recruitmentApplications r
            JOIN
                admins a ON r.created_by = a.admin_id
            LEFT JOIN 
                admins ua ON r.updated_by = ua.admin_id
            WHERE 
                r.recruitmentApplication_id = ?
        `;

        const [rows] = await pool.execute(queryString, [recruitmentApplication_id]);
        return rows[0];
    }

    static async createRecruitmentApplication(data, language, admin_id) {
        const queryString = `
            INSERT INTO recruitmentApplications (
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

    static async updateRecruitmentApplication(data, admin_id) {
        const queryString = `
            UPDATE recruitmentApplications 
            SET position = ?, department = ?, location = ?, quantity = ?, salary_range = ?, 
                experience_required = ?, application_deadline = ?, detail = ?,
                updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE recruitmentApplication_id = ?
        `;

        await pool.execute(queryString, [
            data.position, data.department, data.location, data.quantity, data.salary_range, 
            data.experience_required, data.application_deadline, data.detail,
            admin_id, data.recruitmentApplication_id
        ]);

        return;
    }

    static async deleteRecruitmentApplication(recruitmentApplication_id) {
        const queryString = `
            DELETE FROM recruitmentApplications 
            WHERE recruitmentApplication_id = ?
        `;

        await pool.execute(queryString, [recruitmentApplication_id]);
        return;
    }
}

module.exports = RecruitmentApplicationModel;
