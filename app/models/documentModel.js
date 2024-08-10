const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const documentsPerPage = 20;

class DocumentModel {
    static async createDocument(data, language, admin_id) {
        const queryString = `
            INSERT INTO documents (document_name, src, created_by, created_at) VALUES
            (?, ?, ?, CURRENT_TIMESTAMP())
        `;
        const [result] = await pool.execute(queryString, [data.document_name, data.src, admin_id]);

        return result.insertId;
    }

    static async getDocuments(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        
        const offset = documentsPerPage * (page - 1);

        const queryString = `
            SELECT 
                d.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name
            FROM 
                documents d
            JOIN
                admins a ON a.admin_id = d.created_by
            LEFT JOIN
                admins ua ON ua.admin_id = d.updated_by
            WHERE
                LOWER(d.document_name) LIKE LOWER(?)
            ORDER BY
                d.document_id DESC
            LIMIT
                ${ documentsPerPage }
            OFFSET
                ${ offset }
        `;
    
        const [rows] = await pool.execute(queryString, [`%${keyword}%`]);
        return rows;
    }

    static async getDocumentById(document_id) {
        const queryString = `
        SELECT 
            d.*,
            a.fullname as admin_name,
            ua.fullname as updated_by_name
        FROM 
            documents d
        JOIN
            admins a ON a.admin_id = d.created_by
        LEFT JOIN
            admins ua ON ua.admin_id = d.updated_by
        WHERE
            d.document_id = ?
    `;

    const [rows] = await pool.execute(queryString, [document_id]);
    return rows[0];
    }

    static async deleteDocument(document_id) {
        const queryString = `
            DELETE FROM
                documents
            WHERE
                document_id = ?
        `;

        await pool.execute(queryString, [document_id]);

        return
    }
}

module.exports = DocumentModel;