const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class QuestionModel {
    static async getQuestions(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                questions q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE
                LOWER(q.title) LIKE LOWER(?)
                AND q.language = ? 
            ORDER BY
                q.question_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getQuestionById(question_id) {
        const queryString = `
            SELECT 
                q.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                questions q
            JOIN
                admins a ON a.admin_id = q.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = q.updated_by
            WHERE 
                q.question_id = ?
        `;

        const [rows] = await pool.execute(queryString, [question_id]);
        return rows[0];
    }

    static async createQuestion(data, language, admin_id) {
        const queryString = `
            INSERT INTO questions (title, detail, language, created_by, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.detail, language, admin_id
        ]);

        return result.insertId;
    }

    static async updateQuestion(data, admin_id) {
        const queryString = `
            UPDATE questions 
            SET title = ?, detail = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE question_id = ?
        `;

        await pool.execute(queryString, [
            data.title, data.detail, admin_id, data.question_id
        ]);

        return;
    }

    static async deleteQuestion(question_id) {
        const queryString = `
            DELETE FROM questions 
            WHERE question_id = ?
        `;

        pool.execute(queryString, [question_id]);
        return;
    }
}

module.exports = QuestionModel;
