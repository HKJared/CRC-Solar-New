const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

class HeaderModel {
    static async getHeaderData(language) {
        const [product_categories] = await pool.execute(`
                                                        SELECT
                                                            product_category_id, title
                                                        FROM
                                                            product_categories
                                                        WHERE
                                                            language = ?
                                                        ORDER BY
                                                            product_category_id DESC
                                                        `, [language]);
        
        const [products] = await pool.execute(`
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
                                                    p.language = ?
                                                ORDER BY
                                                    p.product_id DESC
                                                LIMIT
                                                    5
                                                `, [language]);
                                                        

        const [technologies] = await pool.execute(`
                                                    SELECT
                                                        technology_id, technology_name, image
                                                    FROM
                                                        technologies
                                                    WHERE
                                                        language = ?
                                                    ORDER BY
                                                        technology_id DESC
                                                    `, [language]);

        return {
            product_categories: product_categories,
            products: products,
            technologies: technologies
        }   
    }
}

class FooterModel {
}

module.exports = {
    HeaderModel, FooterModel
};