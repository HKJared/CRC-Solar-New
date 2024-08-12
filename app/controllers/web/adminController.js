const ProductModel = require('../../models/productModel');
const { HeaderModel, MainModel, FooterModel } = require('../../models/webModel');
const TechnologyModel = require('../../models/technologyModel');
const BlogModel = require('../../models/blogModel');
const CategoryModel = require('../../models/categoryModel');
const RecruitmentModel = require('../../models/recruitmentModel');
const { render } = require('ejs');
const ProductCategoryModel = require('../../models/productCategoryModel');
const path = require('path');
const ejs = require('ejs');

const getLoginPage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/login');
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getHomepage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/home', { language: language, render: 'dashboard' , active: 'dashboard' })
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getAdminCreateDataAdminPage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/home', { language: language, render: 'create_data_admin' , active: 'create_data_admin' })
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getAdminDataAdminsPage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/home', { language: language, render: 'data_admins' , active: 'data_admins' })
    } catch (error) {
        
    }
}

const getAdminProductsPage = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword || "";
        
        const product_categories = await ProductCategoryModel.getProductCategories(language);
        const technologies = await TechnologyModel.getTechnologies(language);

        return res.status(200).render('admin/home', { product_categories: product_categories, technologies: technologies, keyword: keyword, language: language, render: 'products', active: "products" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminAddProductPage = async (req, res) => {
    try {
        const language = req.language;

        const product_categories = await ProductCategoryModel.getProductCategories(language);
        const technologies = await TechnologyModel.getTechnologies(language);

        return res.status(200).render('admin/home', { product_categories: product_categories, technologies: technologies, language: language, render:'add_product' , active: "add_product" });
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminProductCategoriesPage = async (req, res) => {
    try {
        const language = req.language;

        const categories = await ProductCategoryModel.getProductCategories(language);

        return res.status(200).render('admin/home', { language: language, categories: categories, render: 'product_categories', active: 'product_categories' })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminTechnologiesPage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/home', { language: language, render: 'technologies', active: "technologies" });
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' });
    }
}

const getAdminAddTechnologyPage = async (req, res) => {
    try {
        const language = req.language;

        return res.status(200).render('admin/home', { language: language, render: 'add_technology', active: "add_technology" });
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' });
    }
}

const getAdminCreateBlogPage = async(req, res) => {
    try {
        const language = req.language;

        const categories = await CategoryModel.getCategoriesByTitle('', language);

        return res.status(200).render('admin/home', { language: language, categories: categories, render: 'create_blog', active: 'create_blog' });
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getAdminBlogsPage = async (req, res) => {
    try {
        const language = req.language;

        const categories = await CategoryModel.getCategoriesByTitle('', language);
        
        return res.status(200).render('admin/home', { language: language, categories: categories, render: 'blogs', active: "blogs" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language})
    }
}

const getAdminBlogCategoriesPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language: language, render: 'blog_categories', active: "blog_categories" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminRequestsPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'requests', active: "requests" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminDisplayPage = async (req, res) => {
    try {
        const language = req.language;
        var page_name = req.params.page_name;
        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language)
        const mainData = await MainModel.getMainData(`${ page_name }`, language);
        
        // Tải giao diện client
        const clientViewPath = path.join(__dirname, '../../views/client', `${page_name}.ejs`);
        var clientViewContent, products, technology, blogs, categories, product;

        switch (page_name) {
            case 'home':
                blogs = await BlogModel.getBlogsByCategoryName('', 'news', 1, language);
                const filteredBlogs = blogs.slice(0, 4);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, blogs: filteredBlogs, page: page_name }, { async: true });
                break;
            case 'introduction':
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name }, { async: true });
                break;
            case 'products':
                products = await ProductModel.getProducts('', 1, language);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name, products: products }, { async: true });
                break;
            case 'detailProduct':
                products = await ProductModel.getProducts('', 1, language);
                product = await ProductModel.getProductById(1);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name, product: product }, { async: true });
                break;
            case 'technology':
                technology = await TechnologyModel.getTechnologyById(1);
                products = await ProductModel.getProductByTechnologyId(1);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name, technology: technology, products: products }, { async: true });
                break;
            case 'blogs':
                categories = await CategoryModel.getCategoriesByTitle('', language);
                blogs = await BlogModel.getBlogsByCategoryName('', categories[0].name, 1, language);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name, blogs: blogs, categories: categories, name: categories[0].name }, { async: true });
                break;
            case 'recruitments':
                const recruitments = await RecruitmentModel.getRecruitments('', 1, language);
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name, recruitments: recruitments }, { async: true });
                break;
            case 'contact':
                clientViewContent = await ejs.renderFile(clientViewPath, { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: page_name}, { async: true });
                break;
            default:
                return res.status(200).render('admin/display', { language: language, active: "display", headerData: headerData, mainData: mainData, page: page_name, mainContent: '' });
        }
        
        // Render giao diện admin với nội dung giao diện client được chèn vào
        return res.status(200).render('admin/display', { language: language, active: "display" + page_name, headerData: headerData, mainData: mainData, page: page_name, mainContent: clientViewContent.replace(/\[object Promise\]/g, '') });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getAdminFAQsPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'FAQs', active: "FAQs" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminCreateRecruitmentPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'create_recruitment', active: "create_recruitment" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminRecruitmentsPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'recruitments', active: "recruitments" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminRecruitmentApplicationsPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'recruitment_applications', active: "recruitment_applications" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminPicturesPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'pictures', active: "pictures" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}

const getAdminDocumentsPage = async (req, res) => {
    try {
        const language = req.language;
        
        return res.status(200).render('admin/home', { language, render: 'documents', active: "documents" })
    } catch (error) {
        const language = req.language;
        console.error('ERROR: ', error);
        return res.status(500).render('serverError', {language: language}, { err: 'Server have an error' })
    }
}


module.exports = {
    getLoginPage,
    getHomepage,
    getAdminCreateDataAdminPage, getAdminDataAdminsPage,
    getAdminAddProductPage, getAdminProductsPage, getAdminProductCategoriesPage, getAdminTechnologiesPage, getAdminAddTechnologyPage,
    getAdminDisplayPage,
    getAdminCreateBlogPage, getAdminBlogsPage, getAdminBlogCategoriesPage,
    getAdminRequestsPage,
    getAdminFAQsPage,
    getAdminCreateRecruitmentPage, getAdminRecruitmentsPage, getAdminRecruitmentApplicationsPage,
    getAdminPicturesPage, getAdminDocumentsPage
}