const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class BlogModel {
    static async getBlogsByTitle(keyword, category_id, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                *
            FROM 
                blogs
            WHERE 
                LOWER(title) LIKE LOWER(?)
                AND category_id = ?
                AND language = ?
            ORDER BY
                blog_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, category_id, language]);
        return rows;
    }

    static async getBlogById(blog_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                blogs
            WHERE 
                blog_id = ?
                AND language = ?
        `;

        const [rows] = await pool.execute(queryString, [blog_id]);
        return rows[0];
    }

    static async getBlogByLink(link, language) {
        const queryString = `
            SELECT
                *
            FROM 
                blogs
            WHERE 
                link = ?
                AND language = ?
        `;

        const [rows] = await pool.execute(queryString, [link, language]);
        return rows[0];
    }

    static async createBlog(data, language, admin_id) {
        const queryString = `
            INSERT INTO blogs (title, link, detail, keyword, tag, seo_title, main_image, is_outstanding, category_id, language, status, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.link, data.detail, data.keyword, data.tag, data.seo_title, data.main_image, 
            data.is_outstanding, data.category_id, language, data.status, admin_id
        ]);

        return result.insertId;
    }

    static async updateBlog(data, admin_id) {
        const queryString = `
            UPDATE blogs 
            SET title = ?, link = ?, detail = ?, keyword = ?, tag = ?, seo_title = ?, main_image = ?, 
                is_outstanding = ?, category_id = ?, status = ?, updated_by = ?
            WHERE blog_id = ?
        `;

        await pool.execute(queryString, [
            data.title, data.link, data.detail, data.keyword, data.tag, data.seo_title, data.main_image, 
            data.is_outstanding, data.category_id, data.status, admin_id, data.blog_id
        ]);

        return;
    }

    static async deleteBlog(blog_id) {
        const queryString = `
            DELETE FROM blogs 
            WHERE blog_id = ?
        `;

        await pool.execute(queryString, [blog_id]);
        return;
    }
}

module.exports = BlogModel;