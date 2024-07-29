const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class ProductCategoryModel {
    static async getProductCategoryByTitle(title, language) {
        title = diacritics.remove(title)
        const queryString = `
            SELECT
                * 
            FROM
                product_categories 
            WHERE
                LOWER(title) LIKE LOWER(?)
                AND language = ?
        `;
        const [rows] = await pool.execute(queryString, [`%${title}%`, language]);
        return rows[0];
    }

    static async getProductCategories(language) {
        const queryString = `
            SELECT
                * 
            FROM
                product_categories
            WHERE
                language = ?        
        `;
        const [rows] = await pool.execute(queryString, [language]);
        return rows;
    }
}

module.exports = ProductCategoryModel;