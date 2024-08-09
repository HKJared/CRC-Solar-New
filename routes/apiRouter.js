const express = require('express');
const apiController = require('../app/controllers/api/apiController');
const apiRouter = express.Router();
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');


//admin account
apiRouter.post('/login', apiController.login);
apiRouter.post('/logout', authentication, apiController.logout);
apiRouter.get('/refresh-token', apiController.refreshToken);
apiRouter.post('/create-data-admin', (req, res, next) => {
    authorization(req, res, 'create account data admin', next);
}, apiController.createDataAdmin);
apiRouter.get('/data-admins', apiController.getDataAdmins);
apiRouter.put('/toggle-admin-status', (req, res, next) => {
    authorization(req, res, 'update account data admin', next);
}, apiController.toggleAdminStatus);

//products
apiRouter.post('/product', (req, res, next) => {
    authorization(req, res, 'create', next);
}, apiController.createProduct);
apiRouter.get('/products', apiController.getProducts);
apiRouter.get('/product', apiController.getProductById);
apiRouter.put('/product', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateProduct);
apiRouter.delete('/product', (req, res, next) => {
    authorization(req, res, 'delete', next);
}, apiController.deleteProduct);

//technologies
apiRouter.post('/technology', (req, res, next) => {
    authorization(req, res, 'create', next);
}, apiController.createTechnology);
apiRouter.get('/technologies', apiController.getTechnologies);
apiRouter.get('/technology', apiController.getTechnologyById);
apiRouter.put('/technology', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateTechnology);
apiRouter.delete('/technology', (req, res, next) => {
    authorization(req, res, 'delete', next);
}, apiController.deleteTechnology);

// blogs
apiRouter.get('/blog', apiController.getBlog);
apiRouter.get('/blogs', apiController.getBlogsByTitle);
apiRouter.post('/blog', (req, res, next) => {
    authorization(req, res, 'create', next);
}, apiController.createBlog);
apiRouter.put('/blog', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateBlog);
apiRouter.delete('/blog', (req, res, next) => {
    authorization(req, res, 'delete', next);
}, apiController.deleteBlog);

//request
apiRouter.post('/request', apiController.creatRequest);
apiRouter.get('/requests', apiController.getRequests);
apiRouter.put('/request', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateRequest);

//FAQ
apiRouter.post('/FAQ', (req, res, next) => {
    authorization(req, res, 'create', next);
}, apiController.createFAQ);
apiRouter.get('/FAQs', apiController.getFAQs);
apiRouter.put('/FAQ', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateFAQ);
apiRouter.delete('/FAQ', (req, res, next) => {
    authorization(req, res, 'delete', next);
}, apiController.deleteFAQ);

// //banners
// apiRouter.get('/banners', apiController.getBanners);
// apiRouter.put('/banner', apiController.updateBanner);

apiRouter.put('/display-texts', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateDisplayText);
apiRouter.put('/display-images', (req, res, next) => {
    authorization(req, res, 'update', next);
}, apiController.updateDisplayImage);

apiRouter.get('/old-logs', apiController.getOldLogs);
apiRouter.get('/new-logs', apiController.getNewLogs);

apiRouter.post('/picture', (req, res, next) => {
    authorization(req, res, 'create', next);
}, apiController.createPicture);
apiRouter.get('/pictures', apiController.getPictures);
apiRouter.delete('/picture', (req, res, next) => {
    authorization(req, res, 'delete', next);
}, apiController.deletePicture);

module.exports = apiRouter;