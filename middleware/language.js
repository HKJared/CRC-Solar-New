const languageMiddleware = (language) => {
    return (req, res, next) => {
      // Đặt ngôn ngữ vào đối tượng request
      req.language = language;
  
      // Tiếp tục đến middleware tiếp theo
      next();
    };
  };
  
  module.exports = languageMiddleware;