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
                                                        technology_id, technology_name, description, image
                                                    FROM
                                                        technologies
                                                    WHERE
                                                        language = ?
                                                    ORDER BY
                                                        technology_id DESC
                                                    `, [language]);

        const [services] = await pool.execute(`
                                                SELECT
                                                    blogs.blog_id,
                                                    blogs.title,
                                                    blogs.main_image
                                                FROM
                                                    blogs
                                                JOIN
                                                    categories ON blogs.category_id = categories.category_id
                                                WHERE
                                                    categories.name = 'services'
                                                    AND blogs.language = ?
                                                ORDER BY
                                                    blogs.created_at DESC
                                            `, [language]);

        

        return {
            product_categories: product_categories,
            products: products,
            technologies: technologies,
            services: services
        }   
    }
}

class MainModel {
    static async getMainData(page, language) {
        const [texts] = await pool.execute(`
                                            SELECT
                                                display_text_id, element_id, detail
                                            FROM
                                                display_texts
                                            WHERE
                                                page = ?
                                                AND language = ?
                                            `, [page, language]);

        const [images] = await pool.execute(`
                                            SELECT
                                                display_image_id, element_id, src
                                            FROM
                                                display_images
                                            WHERE
                                                page = ?
                                            `, [page]);

        return {
            texts: texts,
            images: images
        }
    }
}

class FooterModel {
    static async getFooterData(language) {
        const [policies] = await pool.execute(`
            SELECT
                blogs.blog_id,
                blogs.title
            FROM
                blogs
            JOIN
                categories ON blogs.category_id = categories.category_id
            WHERE
                categories.name = 'policies'
                AND blogs.language = ?
            ORDER BY
                blogs.created_at DESC
        `, [language]);

        const [texts] = await pool.execute(`
            SELECT
                display_text_id, element_id, detail
            FROM
                display_texts
            WHERE
                page = ?
                AND language = ?
            `, ['contact', language]);

        return {
            policies: policies,
            texts: texts
        }
    }
}

module.exports = {
    HeaderModel, MainModel, FooterModel
};