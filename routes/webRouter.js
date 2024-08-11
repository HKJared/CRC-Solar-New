const express = require('express');
const webRouter = express.Router();
const clientController = require('../app/controllers/web/clientController');
const adminController = require('../app/controllers/web/adminController');

const blogCategoryMiddleware = require('../middleware/blog');
const { write } = require('fs');
const { webcrypto } = require('crypto');

webRouter.get('/', clientController.getHomepage);
webRouter.get('/introduction', clientController.getIntrodutionPage);
webRouter.get('/products', clientController.getProductsPage);
webRouter.get('/product/:product_name', clientController.getDetailProductPage);
webRouter.get('/technology/:technology_name', clientController.getTechnologyPage);
webRouter.get('/recruitments', clientController.getRecruitmentsPage);

webRouter.get('/news', blogCategoryMiddleware('news'), clientController.getBlogsPage);
webRouter.get('/events', blogCategoryMiddleware('events'), clientController.getBlogsPage);
webRouter.get('/other-news', blogCategoryMiddleware('other-news'), clientController.getBlogsPage);
webRouter.get('/technologies', blogCategoryMiddleware('technologies'), clientController.getBlogsPage);
webRouter.get('/services', blogCategoryMiddleware('services'), clientController.getBlogsPage);
webRouter.get('/partners', blogCategoryMiddleware('partners'), clientController.getBlogsPage);
webRouter.get('/social-responsibility', blogCategoryMiddleware('social-responsibility'), clientController.getBlogsPage);

webRouter.get('/blog', clientController.getBlogPage);

webRouter.get('/contact', clientController.getContactPage);

webRouter.get('/pictures', clientController.getPicturesPage);


webRouter.get('/admin/login', adminController.getLoginPage);

webRouter.get('/admin', adminController.getHomepage);

webRouter.get('/admin/create-data-admin', adminController.getAdminCreateDataAdminPage);
webRouter.get('/admin/data-admins', adminController.getAdminDataAdminsPage);

webRouter.get('/admin/products', adminController.getAdminProductsPage);
webRouter.get('/admin/add-product', adminController.getAdminAddProductPage);
webRouter.get('/admin/product-categories', adminController.getAdminProductCategoriesPage);
webRouter.get('/admin/product-technologies', adminController.getAdminTechnologiesPage);
webRouter.get('/admin/add-technology', adminController.getAdminAddTechnologyPage);

webRouter.get('/admin/display/:page_name', adminController.getAdminDisplayPage);

webRouter.get('/admin/create-blog', adminController.getAdminCreateBlogPage);
webRouter.get('/admin/blogs', adminController.getAdminBlogsPage);
webRouter.get('/admin/blog-categories', adminController.getAdminBlogCategoriesPage);

webRouter.get('/admin/requests', adminController.getAdminRequestsPage);

webRouter.get('/admin/FAQs', adminController.getAdminFAQsPage);

webRouter.get('/admin/create-recruitment', adminController.getAdminCreateRecruitmentPage);
webRouter.get('/admin/recruitments', adminController.getAdminRecruitmentsPage);
webRouter.get('/admin/recruitment-applications', adminController.getAdminRecruitmentApplicationsPage);


webRouter.get('/admin/pictures', adminController.getAdminPicturesPage);
webRouter.get('/admin/documents', adminController.getAdminDocumentsPage);

module.exports = webRouter;