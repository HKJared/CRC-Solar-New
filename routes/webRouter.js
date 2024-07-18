const express = require('express');
const webRouter = express.Router();
const clientController = require('../app/controllers/web/clientController');
const adminController = require('../app/controllers/web/adminController');

webRouter.get('/', clientController.getHomepage);

module.exports = webRouter;