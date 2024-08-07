const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const configViewEngine = require('./config/viewEngine');

const languageMiddleware = require('./middleware/language');

const webRouter = require('./routes/webRouter');
const apiRouter = require('./routes/apiRouter');

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cn', languageMiddleware('cn'), webRouter);
app.use('/en', languageMiddleware('en'), webRouter);
app.use('/', languageMiddleware('vn'), webRouter);

app.use('/api/cn', languageMiddleware('cn'), apiRouter);
app.use('/api/en', languageMiddleware('en'), apiRouter);
app.use('/api/vn', languageMiddleware('vn'), apiRouter);

configViewEngine(app);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});