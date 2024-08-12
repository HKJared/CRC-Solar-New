const { HeaderModel, MainModel, FooterModel } = require('../../models/webModel');
const ProductModel = require('../../models/productModel');
const TechnologyModel = require('../../models/technologyModel');
const BlogModel = require('../../models/blogModel');
const CategoryModel = require('../../models/categoryModel');
const RecruitmentModel = require('../../models/recruitmentModel');

const getHomepage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('home', language);

        const blogs = await BlogModel.getBlogsByCategoryName('', 'news', 1, language);

        const filteredBlogs = blogs.slice(0, 4);
        
        return res.status(200).render('client/home', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, blogs: filteredBlogs, page: 'home', err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getIntrodutionPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('introduction', language);
        
        return res.status(200).render('client/introduction', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'introduction', err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getPartnersPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('partners', language);
        
        return res.status(200).render('client/partners', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'partners', err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getProductsPage = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword || '';
        const page = req.query.page || 1;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('products', language);

        const products = await ProductModel.getProducts(keyword, page, language);        
        
        return res.status(200).render('client/products', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'products', products: products, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getDetailProductPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('detailProducts', language);

        const product_name = req.params.product_name;

        const product = await ProductModel.getProductByName(product_name, language);
        
        return res.status(200).render('client/detailProduct', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'detailProducts', product: product, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getTechnologyPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('technology', language);

        const technology_name = req.params.technology_name;

        const technology = await TechnologyModel.getTechnologyByName(technology_name);

        const products = await ProductModel.getProductByTechnologyId(technology.technology_id)
        
        return res.status(200).render('client/technology', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'technology', technology: technology, products: products, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getBlogsPage = async (req, res) => {
    try {
        const language = req.language;
        const page  = req.query.page || 1;
        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('blogs', language);

        const blog_category = req.blog_category;

        const categories = await CategoryModel.getCategoriesByTitle('', language);

        const blogs = await BlogModel.getBlogsByCategoryName('', blog_category, page, language);
        
        return res.status(200).render('client/blogs', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'blogs', blogs: blogs, categories: categories, name: blog_category, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getBlogPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('blog', language);

        const blog_id = req.query.blog_id;

        const blog = await BlogModel.getBlogById(blog_id);

        const blogs = await BlogModel.getBlogsByCategoryId(blog.category_id);
        
        return res.status(200).render('client/blog', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'blog', blogs: blogs, blog });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getRecruitmentsPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('recruitments', language);

        const recruitments = await RecruitmentModel.getRecruitments('', 1, language);
        
        return res.status(200).render('client/recruitments', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'recruitments', recruitments: recruitments, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getContactPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('contact', language);
        
        return res.status(200).render('client/contact', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'contact'});
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getPicturesPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('picture', language);
        
        return res.status(200).render('client/pictures', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'pictures'});
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getDocumentsPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('documents', language);
        
        return res.status(200).render('client/documents', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'documents'});
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}

const getFAQsPage = async (req, res) => {
    try {
        const language = req.language;

        const headerData = await HeaderModel.getHeaderData(language);
        const footerData = await FooterModel.getFooterData(language);
        const mainData = await MainModel.getMainData('FAQs', language);
        
        return res.status(200).render('client/FAQs', { language: language, headerData: headerData, footerData: footerData, mainData: mainData, page: 'FAQs'});
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(500).render('serverError', {language: language});
    }
}


module.exports = {
    getHomepage, getIntrodutionPage, getPartnersPage, getProductsPage,
    getDetailProductPage, getTechnologyPage, getBlogsPage, getRecruitmentsPage, getBlogPage,
    getContactPage, getPicturesPage, getDocumentsPage, getFAQsPage
}