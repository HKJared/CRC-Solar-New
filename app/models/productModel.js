const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class ProductModel {
    static async getProducts(keyword, language) {
        keyword = diacritics.remove(keyword);
        
        const queryString = `
            SELECT 
                *
            FROM 
                products
            WHERE
                LOWER(keyword) LIKE LOWER(?)
                AND language = ?
            ORDER BY
                product_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, language]);
        return rows;
    }

    static async getProductById(product_id) {
        const queryString = `
            SELECT 
                *
            FROM 
                products
            WHERE 
                product_id = ?
        `;

        const [rows] = await pool.execute(queryString, [product_id]);
        return rows;
    }

    static async createProduct(data, language, admin_id) {
        const queryString = `
            INSERT INTO products (
                product_name, product_code, technology, quantity_cell, power_output_range, 
                language, max_system_vol, max_efficiency, dimension, created_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
        `;

        const [result] = await pool.execute(queryString, [
            data.product_name, data.product_code, data.technology, data.quantity_cell, 
            data.power_output_range, language, data.max_system_vol, data.max_efficiency, 
            data.dimension, admin_id
        ]);

        return result.insertId;
    }

    static async updateProduct(data, admin_id) {
        const queryString = `
            UPDATE products 
            SET product_name = ?, product_code = ?, technology = ?, quantity_cell = ?, 
                power_output_range = ?, max_system_vol = ?, max_efficiency = ?, 
                dimension = ?, updated_by = ?, update_at = CURRENT_TIMESTAMP()
            WHERE product_id = ?
        `;

        await pool.execute(queryString, [
            data.product_name, data.product_code, data.technology, data.quantity_cell, 
            data.power_output_range, data.max_system_vol, data.max_efficiency, 
            data.dimension, admin_id, product_id
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
}

module.exports = ProductModel;
