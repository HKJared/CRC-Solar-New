const pool = require('../../config/connectDB');
const diacritics = require('diacritics');

function sortCategories(categories) {
    const order = ['news', 'events', 'technologies', 'other-news'];
  
    return categories.sort((a, b) => {
      const indexA = order.indexOf(a.name);
      const indexB = order.indexOf(b.name);
  
      if (indexA === -1 && indexB === -1) {
        return 0;
      }
  
      if (indexA === -1) {
        return 1;
      }
  
      if (indexB === -1) {
        return -1;
      }
  
      return indexA - indexB;
    });
  }

class CategoryModel {
    static async getCategoriesByTitle(keyword, language) {
        keyword = diacritics.remove(keyword);

        const queryString = `
            SELECT 
                *
            FROM 
                categories
            WHERE 
                ( LOWER(title) LIKE LOWER(?)
                OR LOWER(name) LIKE LOWER(?) )
                AND language = ?
            ORDER BY
                category_id DESC
        `;

        const [rows] = await pool.execute(queryString, [`%${keyword}%`, `%${keyword}%`, language]);

        return sortCategories(rows);
    }

    static async getCategoryByName(name, language) {
        const queryString = `
            SELECT 
                title
            FROM 
                categories 
            WHERE 
                name = ?
                AND language = ?
            ORDER BY
                category_id DESC
        `;
    
        const [rows] = await pool.execute(queryString, [name, language]);
        return rows[0];
    }
}

module.exports = CategoryModel;