const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const recruitmentApplicationsPerPage = 20;

class RecruitmentApplicationModel {
    static async getRecruitmentApplications(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        const offset = recruitmentApplicationsPerPage * (page - 1);

        const queryString = `
            SELECT 
                ra.*,
                r.position as position,
                ua.fullname as updated_by_name 
            FROM 
                recruitment_applications ra
            JOIN
                recruitments r ON ra.recruitment_id = r.recruitment_id
            LEFT JOIN 
                admins ua ON ra.updated_by = ua.admin_id
            WHERE
                (LOWER(ra.fullname) LIKE LOWER(?)
                OR LOWER(ra.email) LIKE LOWER(?)
                OR LOWER(ra.phone_number) LIKE LOWER(?))
                AND ra.language = ?
            ORDER BY
                ra.recruitment_application_id DESC
            LIMIT
                ${ recruitmentApplicationsPerPage }
            OFFSET
                ${ offset }
            
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, language]);
        return rows;
    }

    static async getRecruitmentApplicationById(recruitment_application_id) {
        const queryString = `
            SELECT 
                ra.*,
                r.position as position,
                ua.fullname as updated_by_name 
            FROM 
                recruitment_applications ra
            JOIN
                recruitments r ON ra.recruitment_id = r.recruitment_id
            LEFT JOIN 
                admins ua ON ra.updated_by = ua.admin_id
            WHERE 
                ra.recruitment_application_id = ?
        `;

        const [rows] = await pool.execute(queryString, [recruitment_application_id]);
        return rows[0];
    }

    static async createRecruitmentApplication(data, language) {
        const queryString = `
            INSERT INTO recruitment_applications (
                fullname, email, phone_number, recruitment_id, cv_link, language, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;
        
        const [result] = await pool.execute(queryString, [
            data.fullname, data.email, data.phone_number, data.recruitment_id, data.cv_link, language
        ]);

        return result.insertId;
    }

    static async updateRecruitmentApplication(data, admin_id) {
        const queryString = `
            UPDATE recruitment_applications 
            SET status = ?, note = ?,
                updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE recruitment_application_id = ?
        `;

        await pool.execute(queryString, [
            data.status, data.note,
            admin_id, data.recruitment_application_id
        ]);

        return;
    }

    static async deleteRecruitmentApplication(recruitment_application_id) {
        const queryString = `
            DELETE FROM recruitment_applications 
            WHERE recruitment_application_id = ?
        `;

        await pool.execute(queryString, [recruitment_application_id]);
        return;
    }
}

module.exports = RecruitmentApplicationModel;
