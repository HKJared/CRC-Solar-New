const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const blogsPerPage = 20;

class BlogModel {
    static async getBlogsByTitle(keyword, page, language) {
        keyword = diacritics.remove(keyword);
        const offset = (page - 1) * blogsPerPage;
        
        const queryString = `
            SELECT 
                b.*,
                c.title as category_title,
                a.fullname as admin_name
            FROM 
                blogs b
            JOIN 
                categories c ON b.category_id = c.category_id
            JOIN 
                admins a ON b.created_by = a.admin_id
            WHERE 
                LOWER(b.title) LIKE LOWER(?)
                AND b.language = ?
            ORDER BY
                b.blog_id DESC
            LIMIT
                ?
            OFFSET
                ?
        `;
    
        try {
            const [rows] = await pool.execute(queryString, [`%${keyword}%`, language, blogsPerPage, offset]);
            return rows;
        } catch (error) {
            console.error('Error executing getBlogsByTitle query:', error);
            throw error;
        }
    }

    static async getBlogsByCategoryName(keyword, name, page, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                b.*,
                c.title as category_title,
                a.fullname as admin_name
            FROM 
                blogs b
            JOIN 
                categories c ON b.category_id = c.category_id
            JOIN 
                admins a ON b.created_by = a.admin_id
            WHERE
                LOWER(b.title) LIKE LOWER(?)
                AND c.name = ?
                AND b.language = ?
            ORDER BY
                b.blog_id DESC
            LIMIT
                ?
            OFFSET
                ?
        `;

        const offset = (page - 1) * blogsPerPage;
    
        const [rows] = await pool.execute(queryString, [`%${keyword}%`, name, language, blogsPerPage, offset]);
        return rows;
    }

    static async getBlogsByCategoryId(category_id) {
        const queryString = `
            SELECT 
                b.*,
                c.title as category_title,
                a.fullname as admin_name
            FROM 
                blogs b
            JOIN 
                categories c ON b.category_id = c.category_id
            JOIN 
                admins a ON b.created_by = a.admin_id
            WHERE 
                b.category_id = ?
            ORDER BY
                b.blog_id DESC
        `;
    
        const [rows] = await pool.execute(queryString, [category_id]);
        return rows;
    }

    static async getBlogById(blog_id) {
        const queryString = `
            SELECT 
                b.*,
                c.title as category_title,
                a.fullname as admin_name,
                ua.fullname as updated_by_name 
            FROM 
                blogs b
            JOIN 
                categories c ON b.category_id = c.category_id
            JOIN 
                admins a ON b.created_by = a.admin_id
            LEFT JOIN 
                admins ua ON b.updated_by = ua.admin_id
            WHERE 
                b.blog_id = ?
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

    static async createBlog(data, main_image, language, admin_id) {
        const queryString = `
            INSERT INTO blogs (title, detail, tag, seo_title, main_image, is_outstanding, category_id, language, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(queryString, [
            data.title, data.detail, data.tag, data.seo_title, main_image, 
            data.is_outstanding, data.category_id, language, admin_id
        ]);

        return result.insertId;
    }

    static async updateBlog(data, admin_id) {
        const queryString = `
            UPDATE
                blogs 
            SET
                title = ?, detail = ?, tag = ?, seo_title = ?, main_image = ?, 
                is_outstanding = ?, category_id = ?, status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE
                blog_id = ?
        `;

        await pool.execute(queryString, [
            data.title, data.detail, data.tag, data.seo_title, data.main_image, 
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