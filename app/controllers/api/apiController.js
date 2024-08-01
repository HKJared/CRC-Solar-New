const pool = require('../../../config/connectDB');
const { generateToken, generateRefreshToken, decodeToken, decodeRefreshToken } = require('../../../middleware/jwt');
const hashPassword = require('../../../utils/hassPassword');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AdminModel = require('../../models/adminModel');
const BlogModel = require('../../models/blogModel');
const CategoryModel = require('../../models/categoryModel');
const ProductModel = require('../../models/productModel');
const DisplayModel = require('../../models/displayModel');
const LogModel = require('../../models/logModel');
const { log } = require('console');
const { resourceLimits } = require('worker_threads');
const { get } = require('http');
const RequestModel = require('../../models/requestModel');
const QuestionModel = require('../../models/questionModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/') // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('images', 10);

const login = async (req, res) => {
    try {
        const accountLogin = req.body.account;

        const passwordLogin = hashPassword(accountLogin.password);

        if (!accountLogin) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại.' })
        }

        const account = await AdminModel.getAdminByAccount(accountLogin.account);

        if (!account) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại.' })
        }

        const log_id = await LogModel.createLog('login', account.admin_id);

        if (!account.status) {
            await LogModel.updateDetailLog('Tài khoản đã bị vô hiệu hóa.', log_id);
            return res.status(400).json({ message: 'Tài khoản đã bị vô hiệu hóa.' })
        }

        if(passwordLogin != account.password) {
            await LogModel.updateDetailLog('Mật khẩu không chính xác.', log_id);
            return res.status(400).json({ message: 'Mật khẩu không chính xác.' })
        }
        
        const access_token = generateToken(account.admin_id);
        const refresh_token = generateRefreshToken(account.admin_id);
        await LogModel.updateDetailLog('Đăng nhập thành công.', log_id)
        await LogModel.updateStatusLog(log_id);
        await AdminModel.setRefreshToken(refresh_token, account.admin_id);

        return res.status(200).json({ access_token: access_token, refresh_token: refresh_token, message: "Đăng nhập thành công." })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const logout = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const log_id = await LogModel.createLog('logout', admin_id);

        await AdminModel.removeRefreshToken(admin_id);

        await LogModel.updateDetailLog('Đăng xuất thành công', log_id);
        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: "Đăng xuất thành công." })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const refreshToken = async (req, res) => {
    try {
        const refresh_token = req.headers.authentication;

        if (!refresh_token) {
            return res.status(400).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." })
        }

        const decode = decodeRefreshToken(refresh_token);
        
        const admin_id = decode.admin_id;

        const account = await AdminModel.getAdminById(admin_id);

        if (!account) {
            return res.status(400).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." })
        }

        if (refresh_token != account.refresh_token) {
            return res.status(400).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." })
        }

        if (!account.status) {
            return res.status(400).json({ message: 'Tài khoản này đã bị vô hiệu hóa. Hãy liên hệ với quản trị viên.' })
        }

        const access_token = generateToken(admin_id);

        return res.status(200).json({ access_token: access_token })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createDataAdmin = async (req, res) => {
    try {
        const account = req.body.account;
        const log_id = req.log_id;

        if (!account.fullname || !account.account || !account.password || !account.phone_number || !account.email) {
            await LogModel.updateDetailLog('Thiếu thông tin tài khoản', log_id);
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin tài khoản.' })
        }

        const oldAccount = await AdminModel.getAdminByAccount(account.account);

        if (oldAccount) {
            await LogModel.updateDetailLog(`Tài khoản ${account.account} đã tồn tại`, log_id);
            return res.status(400).json({ message: 'Tài khoản đã tồn tại.' });
        }

        await LogModel.updateDetailLog(`Tạo tài khoản admin: ${account.account}`, log_id);

        account.password = hashPassword(account.password);

        const newAccount = await AdminModel.createAdmin(account);
        
        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Tạo tài khoản thành công.', newAccount: newAccount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getDataAdmins = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const dataAdmins = await AdminModel.getDataAdmins(keyword);

        return res.status(200).json({ data: dataAdmins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const toggleAdminStatus = async (req, res) => {
    try {
        const admin_id = req.body.admin_id;
        const log_id = req.log_id;

        const account = await AdminModel.getAdminById(admin_id);

        await LogModel.updateDetailLog(`Vô hiệu hóa tài khoản ${account.account}`, log_id);

        await AdminModel.toggleAdminStatus(admin_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Thay đổi thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const product_category_id = req.query.product_category_id;
        const language = req.language;

        var products = [];

        if (product_category_id) {
            products = await ProductModel.getProductsByCategoryId(product_category_id, language);
        } else {
            products = await ProductModel.getProducts(keyword, language);
        }

        return res.status(200).json({ data: products })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getProductById = async (req, res) => {
    try {
        const product_id = req.query.product_id;

        const product = await ProductModel.getProductById(product_id);

        if (!product) {
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm.' })
        }

        return res.status(200).json({ data: product })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp ảnh' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const product = JSON.parse(req.body.product);
            const files = req.files;
            const log_id = req.log_id;

            if (!files || files.length === 0) {
                await LogModel.updateDetailLog('Sản phẩm thiếu hình ảnh', log_id);
                return res.status(400).json({ message: 'Không có tệp hình ảnh được tải lên' });
            }

            await LogModel.updateDetailLog(`Tạo sản phẩm: ${product.name}`, log_id);

            const product_id = await ProductModel.createProduct(product, language, 1);

            const image_src = files.map(file => `/image/${file.originalname}`);

            for (let i = 0; i < image_src.length; i++) {
                await ProductModel.createProductImage(image_src[i], product_id)
            }

            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: 'Sản phẩm đã được tạo thành công' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const updateProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp ảnh' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const newDataProduct = JSON.parse(req.body.newDataProduct);
            const imagesToDelete = JSON.parse(req.body.imagesToDelete);
            const technologiesToDelete = JSON.parse(req.body.technologiesToDelete);
            const technologiesToUpdate = JSON.parse(req.body.technologiesToUpdate);
            const files = req.files;
            const log_id = req.log_id;
            const admin_id = req.admin_id
            
            const product_id = newDataProduct.product_id;

            const product = await ProductModel.getProductById(product_id);

            if (!product) {
                await LogModel.updateDetailLog('Không tìm thấy sản phẩm', log_id);
                return res.status(400).json({ message: "Khôm tìm thấy sản phẩm." });
            }

            await LogModel.updateDetailLog(`Chỉnh sửa sản phẩm '${product.product_name}' thành '${newDataProduct.product_name}'`, log_id);

            // Xóa ảnh cũ trong thư mục rồi xóa src ảnh trong db
            for (const image of imagesToDelete) {
                const product_image = await ProductModel.getProductImageById(image.image_id);
                const oldPath = path.join(__dirname, '../../../public', product_image.src);

                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error('Lỗi khi xóa ảnh cũ:', err);
                    } else {
                        console.log('Đã xóa ảnh cũ:', oldPath);
                    }
                });
                await ProductModel.deleteProductImageById(image.image_id);
            }

            // Xóa các công nghệ cần xóa
            for (const technology of technologiesToDelete) {
                await ProductModel.deleteProductTechnology(product_id, technology.technology_id);
            }

            // Thêm các công nghệ cần thêm
            for (const technology of technologiesToUpdate) {
                await ProductModel.createProductTechnology(product_id, technology.technology_id);
            }

            // Thêm các ảnh mới
            const image_src = files.map(file => `/image/${file.originalname}`);
            for (let i = 0; i < image_src.length; i++) {
                await ProductModel.createProductImage(image_src[i], product_id)
            }

            await ProductModel.updateProduct(newDataProduct, admin_id);
            
            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: 'Sản phẩm đã được cập nhật.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const deleteProduct = async (req, res) => {
    try {
        const product_id = req.body.product_id;
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        const product = await ProductModel.getProductById(product_id);

        if (!product) {
            await LogModel.updateDetailLog('Không tìm thấy sản phẩm.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm, vui lòng tải lại trang.' })
        }

        await LogModel.updateDetailLog(`Xóa sản phẩm ${product.product_name}`, log_id);

        const product_images = await ProductModel.getProductImages(product_id);

        for (const image of product_images) {
            const oldPath = path.join(__dirname, '../../../public', image.src);

            fs.unlink(oldPath, (err) => {
                if (err) {
                    console.error('Lỗi khi xóa ảnh cũ:', err);
                } else {
                    console.log('Đã xóa ảnh cũ:', oldPath);
                }
            });
        }

        await ProductModel.deleteProduct(product_id);
        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateDisplayText = async (req, res) => {
    try {
        const language = req.language;
        const admin_id = req.admin_id;
        const page = req.query.page;
        const data = req.body.data;
        const log_id = req.log_id;

        await LogModel.updateDetailLog(`Chỉnh sửa nội dung hiển thị trang ${page + '.' + language}`, log_id);

        for (let i = 0; i < data.length; i++) {
            await DisplayModel.updateDisplayText(data[i], page, language, admin_id);
        }

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Cập nhật thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateDisplayImage = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp ảnh' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const page = req.query.page
            const elementIds = req.body.element_ids.split(',');
            const files = req.files;
            const log_id = req.log_id;

            await LogModel.updateDetailLog(`Chỉnh sửa hình ảnh hiển thị trang ${page}`, log_id);

            const admin_id = req.admin_id || 1;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'Không có tệp hình ảnh được tải lên' });
            }

            let oldImagePaths = [];

            for (let i = 0; i < elementIds.length; i++) {
                const element_id = elementIds[i];
                const file = files[i];

                if (file) {
                    const image_src = `/image/${file.originalname}`;
                    const oldImagePath = await DisplayModel.getOldImageByElementId(element_id, page);
                    
                    if (oldImagePath) {
                        oldImagePaths.push(path.join(__dirname, '../../../public', oldImagePath));
                    }

                    await DisplayModel.updateDisplayImage({ src: image_src, element_id: element_id }, page, admin_id);
                }
            }

            // Xóa ảnh cũ
            oldImagePaths.forEach(oldPath => {
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error('Lỗi khi xóa ảnh cũ:', err);
                    } else {
                        console.log('Đã xóa ảnh cũ:', oldPath);
                    }
                });
            });

            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: 'Hình ảnh đã được cập nhật thành công' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
};

const createBlog = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp ảnh' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const admin_id = req.admin_id;
            const files = req.files;
            const blog = JSON.parse(req.body.data);
            const log_id = req.log_id;

            await LogModel.updateDetailLog(`Tạo vài viết: ${ blog.title }`, log_id);

            const file = files[0]

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'Không có tệp hình ảnh được tải lên' });
            }

            const image_src = `/image/${file.originalname}`;
            await BlogModel.createBlog(blog, image_src, language, admin_id);

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: 'Tạo bài viết thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const getBlogsByTitle = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const page = req.query.keyword || 1;
        const language = req.language;

        const blogs = await BlogModel.getBlogsByTitle(keyword, page, language);
;
        return res.status(200).json({ data: blogs })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getBlog = async (req, res) => {
    try {
        const blog_id = req.query.blog_id;

        const blog = await BlogModel.getBlogById(blog_id);

        return res.status(200).json({ data: blog })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateBlog = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp ảnh' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const admin_id = req.admin_id;
            const files = req.files;
            const newDataBlog = JSON.parse(req.body.newDataBlog);
            const log_id = req.log_id;

            const blog = await BlogModel.getBlogById(newDataBlog.blog_id);

            if (!blog) {
                await LogModel.updateDetailLog(`Không tìm thấy bài viết muốn chỉnh sửa`, log_id);
                return res.status(400).json({ message: 'Không tìm thấy bài viết muốn chỉnh sửa, vui lòng tải lại trang.' });
            }

            await LogModel.updateDetailLog(`Cập nhật bài viết: ${ blog.title } thành bài viết: ${ newDataBlog.title }`, log_id);

            if (files.length != 0) {
                const file = files[0];
                const new_image_src = `/image/${file.originalname}`;
                newDataBlog.main_image = new_image_src;
            }
            
            await BlogModel.updateBlog(newDataBlog, admin_id);

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: 'Cập nhật viết thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const deleteBlog = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        const blog_id = req.body.blog_id;

        const blog = await BlogModel.getBlogById(blog_id);

        if (!blog) {
            await LogModel.updateDetailLog('Không tìm thấy bài viết', log_id);
        }

        await LogModel.updateDetailLog(`Xóa bài viết: ${blog.title}`, log_id);

        await BlogModel.deleteBlog(blog_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Xóa bài viết thành công' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const creatRequest = async (req, res) => {
    try {
        const request = req.body.request;
        const language = req.language;

        await RequestModel.createRequest(request, language);

        return res.status(200).json({ message: `Chúng tôi đã nhận được tin nhắn từ bạn và sẽ có phản hồi sớm nhất tới email ${request.email} hoặc số điện thoại ${request.phone_number}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getRequests = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const language = req.language;
        const page = req.query.page || 1;

        const requests = await RequestModel.getRequests(keyword, page, language);

        return res.status(200).json({ data: requests })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateRequest = async (req, res) => {
    try {
        const language = req.language;
        const admin_id = req.admin_id;
        const request_id = req.body.request_id;
        const log_id = req.log_id;

        await LogModel.updateDetailLog(`Cập nhật yêu cầu liên hệ số ${request_id}`, log_id);

        await RequestModel.updateRequest(request_id, admin_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Cập nhật thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createQuestion = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const language = req.language;
        const log_id = req.log_id;
        const question = req.body.question;

        if (!question) {
            await LogModel.updateDetailLog('Không nhận được thông tin câu hỏi.', log_id);
            return res.status(400).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại.' });
        }

        await LogModel.updateDetailLog(`Tạo câu hỏi "${question.title}"`, log_id);

        const idNewQuestion = await QuestionModel.createQuestion(question, language, admin_id);
        const newQuestion = await QuestionModel.getQuestionById(idNewQuestion);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Tạo câu hỏi mới thành công.', question: newQuestion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getQuestions = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const language = req.language;

        const questions = await QuestionModel.getQuestions(keyword, language);

        return res.status(200).json({ data: questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getOldLogs = async (req, res) => {
    try {
        const time = req.query.time;

        const logs = await LogModel.getOldLogs(time);

        return res.status(200).json({ data: logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getNewLogs = async (req, res) => {
    try {
        const time = req.query.time;

        const logs = await LogModel.getNewLogs(time);

        return res.status(200).json({ data: logs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

module.exports = {
    login, logout, refreshToken, createDataAdmin, getDataAdmins,
    toggleAdminStatus,
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
    updateDisplayText, updateDisplayImage,
    createBlog, getBlogsByTitle, getBlog, updateBlog, deleteBlog,
    creatRequest, getRequests, updateRequest,
    createQuestion, getQuestions,
    getOldLogs, getNewLogs
}