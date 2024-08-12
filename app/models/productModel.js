const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

const productsPerPage = 20;

class ProductModel {
    static async getProducts(keyword, page, language) {
        keyword = diacritics.remove(keyword);

        const offset = productsPerPage * (page - 1);
        
        const queryString = `
            SELECT 
                p.*,
                pi.src
            FROM 
                products p
            LEFT JOIN (
                SELECT
                    product_id,
                    MIN(product_image_id) AS min_image_id
                FROM
                    product_images
                GROUP BY
                    product_id
            ) pim ON p.product_id = pim.product_id
            LEFT JOIN product_images pi ON pim.min_image_id = pi.product_image_id
            WHERE
                LOWER(p.product_name) LIKE LOWER(?)
                AND p.language = ?
            ORDER BY
                p.product_id DESC
            LIMIT
                ${ productsPerPage }
            OFFSET
                ${ offset }
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getProductsByCategoryId(product_category_id, keyword, page, language) {
        const offset = productsPerPage * (page - 1);
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                p.*,
                pi.src
            FROM 
                products p
            LEFT JOIN (
                SELECT
                    product_id,
                    MIN(product_image_id) AS min_image_id
                FROM
                    product_images
                GROUP BY
                    product_id
            ) pim ON p.product_id = pim.product_id
            LEFT JOIN product_images pi ON pim.min_image_id = pi.product_image_id
            WHERE
                p.product_category_id = ?
                AND LOWER(p.product_name) LIKE LOWER(?)
                AND p.language = ?
            ORDER BY
                p.product_id DESC
            LIMIT
                ${ productsPerPage }
            OFFSET
                ${ offset }
        `;

        const [rows] = await pool.execute(queryString, [product_category_id, `%${keyword}%`, language]);
        return rows;
    }

    static async getProductById(product_id) {
        const queryString = `
            SELECT 
                p.*,
                pi.src AS image_src,
                pi.content AS image_content,
                pi.product_image_id as image_id,
                pc.title AS category_title,
                t.technology_id,
                t.technology_name,
                a.fullname as admin_name,
                ua.fullname as updated_by_name 
            FROM 
                products p
            LEFT JOIN 
                product_images pi ON p.product_id = pi.product_id
            LEFT JOIN
                product_categories pc ON p.product_category_id = pc.product_category_id
            LEFT JOIN
                product_technology pt ON p.product_id = pt.product_id
            LEFT JOIN
                technologies t ON pt.technology_id = t.technology_id
            JOIN 
                admins a ON p.created_by = a.admin_id
            LEFT JOIN 
                admins ua ON p.updated_by = ua.admin_id
            WHERE 
                p.product_id = ?
        `;
    
        const [rows] = await pool.execute(queryString, [product_id]);
    
        if (rows.length === 0) {
            return null;
        }
    
        const product = { ...rows[0] };
    
        if (product.max_efficiency !== undefined) {
            product.max_efficiency = parseFloat(product.max_efficiency).toFixed(2);
        }
    
        product.images = [];
        product.technologies = [];
    
        const seenImages = new Set();
        const seenTechnologies = new Set();
    
        rows.forEach(row => {
            if (row.image_src && !seenImages.has(row.image_src)) {
                product.images.push({ id: row.image_id, src: row.image_src, content: row.image_content });
                seenImages.add(row.image_src);
            }
            if (row.technology_id && !seenTechnologies.has(row.technology_id)) {
                product.technologies.push({ id: row.technology_id, name: row.technology_name });
                seenTechnologies.add(row.technology_id);
            }
        });
    
        return product;
    }

    static async getProductByName(product_name, language) {
        const queryString = `
            SELECT 
                p.*,
                pi.src AS image_src,
                pi.content AS image_content,
                pi.product_image_id as image_id,
                pc.title AS category_title,
                t.technology_id,
                t.technology_name
            FROM 
                products p
            LEFT JOIN 
                product_images pi ON p.product_id = pi.product_id
            LEFT JOIN
                product_categories pc ON p.product_category_id = pc.product_category_id
            LEFT JOIN
                product_technology pt ON p.product_id = pt.product_id
            LEFT JOIN
                technologies t ON pt.technology_id = t.technology_id
            WHERE 
                p.product_name = ?
                AND p.language = ?
        `;
    
        const [rows] = await pool.execute(queryString, [product_name, language]);
    
        if (rows.length === 0) {
            return null;
        }
    
        const product = { ...rows[0] };
    
        if (product.max_efficiency !== undefined) {
            product.max_efficiency = parseFloat(product.max_efficiency).toFixed(2);
        }
    
        product.images = [];
        product.technologies = [];
    
        const seenImages = new Set();
        const seenTechnologies = new Set();
    
        rows.forEach(row => {
            if (row.image_src && !seenImages.has(row.image_src)) {
                product.images.push({ id: row.image_id, src: row.image_src, content: row.image_content });
                seenImages.add(row.image_src);
            }
            if (row.technology_id && !seenTechnologies.has(row.technology_id)) {
                product.technologies.push({ id: row.technology_id, name: row.technology_name });
                seenTechnologies.add(row.technology_id);
            }
        });
    
        return product;
    }
    
    static async getProductByTechnologyId(technology_id, page = 1) {
        const offset = productsPerPage * (page - 1);

        const queryString = `
            SELECT 
                p.*,
                pi.src
            FROM 
                products p
            LEFT JOIN (
                SELECT
                    product_id,
                    MIN(product_image_id) AS min_image_id
                FROM
                    product_images
                GROUP BY
                    product_id
            ) pim ON p.product_id = pim.product_id
            LEFT JOIN product_images pi ON pim.min_image_id = pi.product_image_id
            JOIN 
                product_technology pt ON p.product_id = pt.product_id
            JOIN 
                technologies t ON pt.technology_id = t.technology_id
            WHERE 
                pt.technology_id = ?
            ORDER BY
                p.product_id DESC
            LIMIT
                ${ productsPerPage }
            OFFSET
                ${ offset }
        `;
    
        const [rows] = await pool.execute(queryString, [technology_id]);
    
        return rows;
    }

    static async getTechnologies(keyword, language) {
        keyword = diacritics.remove(keyword);
        
        const queryString = `
            SELECT 
                technology_id, technology_name, image, description
            FROM 
                technologies
            WHERE
                LOWER(technology_name) LIKE LOWER(?)
                AND language = ?
            ORDER BY
                technology_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getTechnologyById(technology_id) {
        const queryString = `
            SELECT 
                t.*,
                a.fullname as admin_name,
                ua.fullname as updated_by_name 
            FROM 
                technologies t
            JOIN 
                admins a ON t.created_by = a.admin_id
            LEFT JOIN 
                admins ua ON t.updated_by = ua.admin_id
            WHERE
                t.technology_id = ?
        `;

        const [row] = await pool.execute(queryString, [technology_id]);
        return row[0];
    }

    static async createProduct(data, language, admin_id) {
        const queryString = `
            INSERT INTO products (
                product_name, product_code, product_category_id, quantity_cell, power_output_range, 
                language, max_system_vol, max_efficiency, dimension, detail, created_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.product_name, data.product_code, data.product_category_id, data.quantity_cell, data.power_output_range,
            language, data.max_system_vol, data.max_efficiency, data.dimension, data.product_detail, admin_id
        ]);

        return result.insertId;
    }

    static async createTechnology(data, language, admin_id) {
        const queryString = `
            INSERT INTO technologies (
                technology_name, image, description, detail, language,
                created_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;
        console.log(data)
        const [result] = await pool.execute(queryString, [
            data.technology_name, data.image, data.description, data.detail, language,
            admin_id
        ]);

        return result.insertId;
    }

    static async createProductTechnology(product_id, technology_id) {
        const queryString = `
            INSERT INTO product_technology (
                product_id, technology_id
            ) VALUES (?, ?)
        `;

        await pool.execute(queryString, [product_id, technology_id]);

        return
    }

    static async deleteProductTechnology(product_id, technology_id) {
        const queryString = `
            DELETE FROM
                product_technology 
            WHERE
                product_id = ? 
                AND technology_id = ?
            `;

        await pool.execute(queryString, [product_id, technology_id]);

        return
    }

    static async updateProduct(data, admin_id) {
        const queryString = `
            UPDATE
                products 
            SET
                product_name = ?, product_code = ?, product_category_id = ?, quantity_cell = ?, 
                power_output_range = ?, max_system_vol = ?, max_efficiency = ?, 
                dimension = ?, detail = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE
                product_id = ?
        `;
        
        await pool.execute(queryString, [
            data.product_name, data.product_code, data.product_category_id, data.quantity_cell, 
            data.power_output_range, data.max_system_vol, data.max_efficiency, 
            data.dimension, data.detail, admin_id, data.product_id
        ]);

        return;
    }

    static async updateTechnology(data, admin_id) {
        const queryString = `
            UPDATE
                technologies 
            SET
                technology_name = ?, image = ?, description = ?, detail = ?,
                updated_by = ?, updated_at = CURRENT_TIMESTAMP()
            WHERE
                technology_id = ?
        `;
        
        await pool.execute(queryString, [
            data.technology_name, data.image, data.description, data.detail,
            admin_id, data.technology_id
        ]);

        return;
    }

    static async deleteProduct(product_id) {
        const queryString = `
            DELETE FROM products 
            WHERE product_id = ?
        `;

        await pool.execute(queryString, [product_id]);
        return;
    }

    static async deleteTechnology(technology_id) {
        const queryString = `
            DELETE FROM technologies 
            WHERE technology_id = ?
        `;

        await pool.execute(queryString, [technology_id]);
        return;
    }

    static async createProductImage(src, product_id) {
        const query = `
        INSERT INTO product_images (product_id, src)
        VALUES (?, ?)
        `;

        const result = await pool.execute(query, [product_id, src]);

        return result.insertId;
    }

    static async getProductImages(product_id) {
        const queryString = `
        SELECT
            *
        FROM
            product_images
        WHERE
            product_id = ?
        `;

        const [rows] = await pool.execute(queryString, [product_id]);

        return rows;
    }

    static async getProductImageById(product_image_id) {
        const queryString = `
        SELECT
            *
        FROM
            product_images
        WHERE
            product_image_id = ?
        `;

        const [row] = await pool.execute(queryString, [product_image_id]);

        return row[0];
    }

    static async deleteProductImageById(product_image_id) {
        const queryString = `
        DELETE
        FROM
            product_images
        WHERE
            product_image_id = ?
        `;

        await pool.execute(queryString, [product_image_id]);
    }
}

module.exports = ProductModel;
