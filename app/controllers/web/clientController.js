const { HeaderModel, FooterModel } = require('../../models/webModel');

const getHomepage = async (req, res) => {
    try {
        const language = req.language;

        headerData = await HeaderModel.getHeaderData(language);
        
        return res.status(200).render('client/home', { language: language, headerData: headerData, err: null });
    } catch (error) {
        const language = req.language;
        console.error(error);
        return res.status(404).render('client/home', { language: language, err: 'error' });
    }
}

module.exports = {
    getHomepage
}