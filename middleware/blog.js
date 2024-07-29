const blogCategoryMiddleware = (blog_category) => {
    return (req, res, next) => {
    // Đặt ngôn ngữ vào đối tượng request
    req.blog_category = blog_category;
    
    // Tiếp tục đến middleware tiếp theo
    next();
    };
};
  
module.exports = blogCategoryMiddleware;