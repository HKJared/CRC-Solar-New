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
const FAQModel = require('../../models/FAQModel');
const PictureModel = require('../../models/pictureModel');
const DocumentModel = require('../../models/documentModel');
const RecruitmentModel = require('../../models/recruitmentModel');
const RecruitmentApplicationModel = require('../../models/recruitmentApplicationModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/') // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const uniqueName = `${timestamp}-${originalName}`;
        cb(null, uniqueName); // Tên file bao gồm thời gian
    }
});

const upload = multer({ storage: storage }).array('images', 10);

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/document/'); // Thư mục lưu trữ tài liệu
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const uniqueName = `${timestamp}-${originalName}`;
        cb(null, uniqueName); // Tên file bao gồm thời gian
    }
});

const documentUpload = multer({ storage: documentStorage }).array('documents', 10);

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

        console.log(account)

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
        const page = req.query.page || 1;
        const product_category_id = req.query.product_category_id;
        const language = req.language;

        var products = [];

        if (product_category_id) {
            products = await ProductModel.getProductsByCategoryId(product_category_id, keyword, page, language);
        } else {
            products = await ProductModel.getProducts(keyword, page, language);
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

            const image_src = files.map(file => `/image/${file.filename}`);

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
            const image_src = files.map(file => `/image/${file.filename}`);
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

const createTechnology = async (req, res) => {
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
            const technology = JSON.parse(req.body.technology);
            const log_id = req.log_id;

            await LogModel.updateDetailLog(`Tạo công nghệ mới: ${ technology.technology_name }`, log_id);

            if (files.length != 0) {
                const file = files[0];
                const new_image_src = `/image/${file.filename}`;
                technology.image = new_image_src;
            } else {
                return res.status(400).json({ message: "Không có tệp ảnh nào được tải lên." })
            }
            
            await ProductModel.createTechnology(technology, language, admin_id);

            await LogModel.updateStatusLog(log_id);

            return res.status(200).json({ message: 'Tạo công nghệ mới thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const getTechnologies = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword;

        const technologies = await ProductModel.getTechnologies(keyword, language);

        return res.status(200).json({ data: technologies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getTechnologyById = async (req, res) => {
    try {
        const technology_id = req.query.technology_id;

        const technology = await ProductModel.getTechnologyById(technology_id);

        return res.status(200).json({ data: technology });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateTechnology = async (req, res) => {
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
            const newDataTechnology = JSON.parse(req.body.newDataTechnology);
            const log_id = req.log_id;

            const technology = await ProductModel.getTechnologyById(newDataTechnology.technology_id);

            if (!technology) {
                await LogModel.updateDetailLog(`Không tìm thấy công nghệ muốn chỉnh sửa`, log_id);
                return res.status(400).json({ message: 'Không tìm thấy công nghệ muốn chỉnh sửa, vui lòng tải lại trang.' });
            }

            await LogModel.updateDetailLog(`Cập nhật nội dung công nghệ: ${ technology.technology_name } thành công nghệ: ${ newDataTechnology.technology_name }`, log_id);

            if (files.length != 0) {
                const file = files[0];
                const new_image_src = `/image/${file.filename}`;
                newDataTechnology.image = new_image_src;
            }
            
            await ProductModel.updateTechnology(newDataTechnology, admin_id);

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: 'Cập nhật nội dung công nghệ thành công.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const deleteTechnology = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        const technology_id = req.body.technology_id;

        const technology = await ProductModel.getTechnologyById(technology_id);

        if (!technology) {
            await LogModel.updateDetailLog('Không tìm thấy công nghệ cần xóa', log_id);

            return res.status(400).json({ message: 'Không tìm thấy công nghệ cần xóa' })
        }

        await LogModel.updateDetailLog(`Xóa công nghệ: ${technology.technology_name}`, log_id);

        const oldPath = path.join(__dirname, '../../../public', technology.image);

        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error('Lỗi khi xóa ảnh cũ:', err);
            } else {
                console.log('Đã xóa ảnh cũ:', oldPath);
            }
        });

        await ProductModel.deleteTechnology(technology_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Xóa công nghệ thành công.' })
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
            const element_ids = req.body.element_ids.split(',');
            const files = req.files;
            const log_id = req.log_id;
            await LogModel.updateDetailLog(`Chỉnh sửa hình ảnh hiển thị trang ${page}`, log_id);

            const admin_id = req.admin_id || 1;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'Không có tệp hình ảnh được tải lên' });
            }

            let oldImagePaths = [];

            for (let i = 0; i < element_ids.length; i++) {
                const element_id = element_ids[i];
                const file = files[i];

                if (file) {
                    const image_src = `/image/${file.filename}`;
                    const oldImagePath = await DisplayModel.getOldImageByElementId(element_id, page);
                    
                    if (oldImagePath) {
                        oldImagePaths.push(path.join(__dirname, '../../../public', oldImagePath.src));
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

            const image_src = `/image/${file.filename}`;
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
        const page = req.query.page || 1;
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
                const new_image_src = `/image/${file.filename}`;
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

        const blog_id = req.query.blog_id;

        const blog = await BlogModel.getBlogById(blog_id);

        if (!blog) {
            await LogModel.updateDetailLog('Không tìm thấy bài viết', log_id);
        }

        await LogModel.updateDetailLog(`Xóa bài viết: ${blog.title}`, log_id);

        const oldPath = path.join(__dirname, '../../../public', blog.main_image);

        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error('Lỗi khi xóa ảnh cũ:', err);
            } else {
                console.log('Đã xóa ảnh cũ:', oldPath);
            }
        });

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

const createFAQ = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const language = req.language;
        const log_id = req.log_id;
        const FAQ = req.body.FAQ;

        if (!FAQ) {
            await LogModel.updateDetailLog('Không nhận được thông tin câu hỏi.', log_id);
            return res.status(400).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại.' });
        }

        await LogModel.updateDetailLog(`Tạo câu hỏi "${FAQ.title}"`, log_id);

        const idNewFAQ = await FAQModel.createFAQ(FAQ, language, admin_id);
        const newFAQ = await FAQModel.getFAQById(idNewFAQ);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Tạo câu hỏi mới thành công.', FAQ: newFAQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getFAQs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const language = req.language;

        const FAQs = await FAQModel.getFAQs(keyword, language);

        return res.status(200).json({ data: FAQs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateFAQ = async (req, res) => {
    try {
        const admin_id = req.admin_id;
        const language = req.language;
        const log_id = req.log_id;
        const newDataFAQ = req.body.newDataFAQ;

        if (!newDataFAQ) {
            await LogModel.updateDetailLog('Không nhận được thông tin câu hỏi.', log_id);
            return res.status(400).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại.' });
        }

        const FAQ = await FAQModel.getFAQById(newDataFAQ.FAQ_id);

        if (!FAQ) {
            await LogModel.updateDetailLog('Không tìm thấy câu hỏi câu hỏi.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy câu hỏi muốn cập nhật, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Cập nhật câu hỏi: ${FAQ.title} thành câu hỏi: ${newDataFAQ.title}`, log_id);

        await FAQModel.updateFAQ(newDataFAQ, admin_id);
        const newFAQ = await FAQModel.getFAQById(newDataFAQ.FAQ_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Cập nhật câu hỏi thành công.', FAQ: newFAQ });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deleteFAQ = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const language = req.language;
        const log_id = req.log_id;
        const FAQ_id = req.body.FAQ_id;

        const FAQ = await FAQModel.getFAQById(FAQ_id);

        if (!FAQ) {
            await LogModel.updateDetailLog('Không tìm thấy câu hỏi câu hỏi.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy câu hỏi muốn xóa, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Xóa câu hỏi: ${FAQ.title}`, log_id);
        await FAQModel.deleteFAQ(FAQ_id);
        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: "Xóa câu hỏi thành công." });
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

const createPicture = async (req, res) => {
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
            const picture = JSON.parse(req.body.data);
            const log_id = req.log_id;

            await LogModel.updateDetailLog(`Thêm ảnh mới`, log_id);

            const file = files[0]

            if (!files || files.length === 0) {
                await LogModel.updateDetailLog(`Không có tệp hình ảnh được tải lên`, log_id);
                return res.status(400).json({ message: 'Không có tệp hình ảnh được tải lên' });
            }

            const image_src = `/image/${file.filename}`;
            picture.src = image_src;
            const newPictureId = await PictureModel.createPicture(picture, admin_id);

            const newPicture = await PictureModel.getPictureById(newPictureId);

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: 'Thêm ảnh mới thành công.', newPicture: newPicture });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const getPictures = async (req, res) => {
    try {
        const language = req.language;
        const admin_id = req.admin_id;
        const keyword = req.query.keyword;
        const page = req.query.page;
        
        const pictures = await PictureModel.getPictures(keyword, page);

        return res.status(200).json({ data: pictures });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deletePicture = async (req, res) => {
    try {
        const language = req.language;
        const admin_id = req.admin_id;
        const picture_id = req.body.picture_id;
        const log_id = req.log_id;
        console.log(picture_id)
        await LogModel.updateDetailLog(`Xóa ảnh`, log_id); 
        
        const picture = await PictureModel.getPictureById(picture_id);

        if (!picture) {
            await LogModel.updateDetailLog(`Không tìm thấy ảnh cần xóa`, log_id);
            return res.status(400).json({ message: 'Không tìm thấy ảnh cần xóa' });
        }

        const oldPath = path.join(__dirname, '../../../public', picture.src);

        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error('Lỗi khi xóa ảnh cũ:', err);
            } else {
                console.log('Đã xóa ảnh cũ:', oldPath);
            }
        });

        await PictureModel.deletePicture(picture_id);

        await LogModel.updateStatusLog(log_id)

        return res.status(200).json({ message: 'xóa ảnh thành công.'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createDocument = async (req, res) => {
    documentUpload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi khi tải lên tệp tài liệu' });
        } else if (err) {
            console.error("ERROR: ", err);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }

        try {
            const language = req.language;
            const admin_id = req.admin_id;
            const files = req.files;
            var document = JSON.parse(req.body.data);
            const log_id = req.log_id;

            await LogModel.updateDetailLog(`Thêm tài liệu mới`, log_id);

            const file = files[0]

            if (!files || files.length === 0) {
                await LogModel.updateDetailLog(`Không có tệp tài liệu được tải lên`, log_id);
                return res.status(400).json({ message: 'Không có tệp tài liệu được tải lên' });
            }

            const document_src = `/document/${file.filename}`;
            document.src = document_src;

            const newDocumentId = await DocumentModel.createDocument(document, language, admin_id);

            const newDocument = await DocumentModel.getDocumentById(newDocumentId);

            await LogModel.updateStatusLog(log_id)

            return res.status(200).json({ message: 'Thêm tài liệu mới thành công.', newDocument: newDocument });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi từ phía server.' });
        }
    });
}

const getDocuments = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword || '';
        const page = req.query.page || 1;
        
        const documents = await DocumentModel.getDocuments(keyword, page, language);

        return res.status(200).json({ data: documents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deleteDocument = async (req, res) => {
    try {
        const document_id = req.body.document_id;
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        if (!document_id) {
            await LogModel.updateDetailLog('Không tìm thấy tài liệu cần xóa', log_id);
            return res.status(400).json({ message: 'Không tìm thấy tài liệu cần xóa, vui lòng tải lại trang.' });
        }

        const document = await DocumentModel.getDocumentById(document_id);

        if (!document) {
            await LogModel.updateDetailLog('Không tìm thấy tài liệu cần xóa.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy tài liệu cần xóa, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Xóa tài liệu: ${ document.document_name }`, log_id);

        await DocumentModel.deleteDocument(document_id);

        const oldPath = path.join(__dirname, '../../../public', document.src);

        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error('Lỗi khi xóa tài liệu cũ:', err);
            } else {
                console.log('Đã xóa tài liệu cũ:', oldPath);
            }
        });

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Xóa tài liệu thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createRecruitment = async (req, res) => {
    try {
        const language = req.language;
        const recruitment = req.body.recruitment;
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        if (!recruitment) {
            await LogModel.updateDetailLog('Không nhận được dữ liệu bài tuyển dụng', log_id);
            return res.status(400).json({ message: 'Không nhận được dữ liệu, vui lòng thử lại.' });
        }

        
        await LogModel.updateDetailLog(`Tạo bài tuyển dụng: ${ recruitment.position }`, log_id);

        const newRecruitmentId = await RecruitmentModel.createRecruitment(recruitment, language, admin_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Tạo bài tuyển dụng thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getRecruitments = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword;
        const page = req.query.page;
        
        const recruitments = await RecruitmentModel.getRecruitments(keyword, page, language);

        return res.status(200).json({ data: recruitments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getRecruitment = async (req, res) => {
    try {
        const language = req.language;

        const recruitment_id = req.query.recruitment_id;
        
        const recruitment = await RecruitmentModel.getRecruitmentById(recruitment_id);

        if (!recruitment) {
            return res.status(400).json({ message: 'Không tìm thấy bài tuyển dụng cần chỉnh sửa, vui lòng tải lại trang.' });
        }

        return res.status(200).json({ data: recruitment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateRecruitment = async (req, res) => {
    try {
        const language = req.language;
        const newDataRecruitment = req.body.newDataRecruitment;
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        if (!newDataRecruitment) {
            await LogModel.updateDetailLog('Không nhận được dữ liệu chỉnh sửa bài tuyển dụng', log_id);
            return res.status(400).json({ message: 'Không nhận được dữ liệu chỉnh sửa, vui lòng thử lại.' });
        }

        const recruitment = await RecruitmentModel.getRecruitmentById(newDataRecruitment.recruitment_id);
        
        if (!recruitment) {
            await LogModel.updateDetailLog('Không tìm thấy bài tuyển dụng cần chỉnh sửa.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy bài tuyển dụng cần chỉnh sửa, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Chỉnh sửa bài tuyển dụng: ${ recruitment.position } thành ${ newDataRecruitment.position }`, log_id);

        await RecruitmentModel.updateRecruitment(newDataRecruitment, admin_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Chỉnh sửa bài tuyển dụng thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const deleteRecruitment = async (req, res) => {
    try {
        const recruitment_id = req.body.recruitment_id;
        const admin_id = req.admin_id;
        const log_id = req.log_id;

        if (!recruitment_id) {
            await LogModel.updateDetailLog('Không tìm thấy bài tuyển dụng cần xóa', log_id);
            return res.status(400).json({ message: 'Không tìm thấy bài tuyển dụng cần xóa, vui lòng tải lại trang.' });
        }

        const recruitment = await RecruitmentModel.getRecruitmentById(recruitment_id);

        if (!recruitment) {
            await LogModel.updateDetailLog('Không tìm thấy bài tuyển dụng cần xóa', log_id);
            return res.status(400).json({ message: 'Không tìm thấy bài tuyển dụng cần xóa, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Xóa bài tuyển dụng: ${ recruitment.position }`, log_id);

        await RecruitmentModel.deleteRecruitment(recruitment_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Xóa bài tuyển dụng thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const createRecruitmentApplication = async (req, res) => {
    try {
        const language = req.language;
        const recruitment_application = req.body.recruitment_application;

        if (!recruitment_application.recruitment_id) {
            return res.status(400).json({ message: 'Không nhận được dữ liệu bài tuyển dụng, vui lòng tải lại trang.' });
        }

        const recruitment = await RecruitmentModel.getRecruitmentById(recruitment_application.recruitment_id);

        const currentDateTime = new Date();
        const applicationDeadline = new Date(recruitment.application_deadline);

        if (currentDateTime > applicationDeadline) {
            return res.status(400).json({ message: 'Đã quá hạn nộp đơn ứng tuyển.' });
        }

        if (!recruitment) {
            return res.status(400).json({ message: 'Không nhận được dữ liệu bài tuyển dụng, vui lòng tải lại trang.' });
        }

        await RecruitmentApplicationModel.createRecruitmentApplication(recruitment_application, language);

        return res.status(200).json({ message: 'Chúng tôi đã nhận được đơn ứng tuyển của bạn, vui lõng theo dõi email và số điện thoại được đề cập.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const getRecruitmentApplications = async (req, res) => {
    try {
        const language = req.language;
        const keyword = req.query.keyword || '';
        const page = req.query.page || 1;

        const recruitment_applications = await RecruitmentApplicationModel.getRecruitmentApplications(keyword, page, language);

        return res.status(200).json({ data: recruitment_applications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}

const updateRecruitmentApplication = async (req, res) => {
    try {
        const language = req.language;
        const newDataRecruitmentApplication = req.body.newDataRecruitmentApplication;
        const admin_id = req.admin_id;
        const log_id = req.log_id;
        
        if (!newDataRecruitmentApplication) {
            await LogModel.updateDetailLog('Không nhận được dữ liệu cập nhật đơn ứng tuyển', log_id);
            return res.status(400).json({ message: 'Không nhận được dữ liệu cập nhật, vui lòng thử lại.' });
        }

        const recruitment_application = await RecruitmentApplicationModel.getRecruitmentApplicationById(newDataRecruitmentApplication.recruitment_application_id);
        
        if (!recruitment_application) {
            await LogModel.updateDetailLog('Không tìm thấy đơn ứng tuyển cần cập nhật.', log_id);
            return res.status(400).json({ message: 'Không tìm thấy đơn ứng tuyển cần cập nhật, vui lòng tải lại trang.' });
        }

        await LogModel.updateDetailLog(`Cập nhật đơn ứng tuyển của ứng viên ${ recruitment_application.fullname } cho vị trí ${ recruitment_application.position }`, log_id);

        await RecruitmentApplicationModel.updateRecruitmentApplication(newDataRecruitmentApplication, admin_id);

        await LogModel.updateStatusLog(log_id);

        return res.status(200).json({ message: 'Cập nhật đơn ứng tuyển thành công.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi từ phía server.' });
    }
}


module.exports = {
    login, logout, refreshToken, createDataAdmin, getDataAdmins,
    toggleAdminStatus,
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
    createTechnology, getTechnologies, getTechnologyById, updateTechnology, deleteTechnology,
    updateDisplayText, updateDisplayImage,
    createBlog, getBlogsByTitle, getBlog, updateBlog, deleteBlog,
    creatRequest, getRequests, updateRequest,
    createFAQ, getFAQs, updateFAQ, deleteFAQ,
    getOldLogs, getNewLogs,
    createPicture, getPictures, deletePicture,
    createDocument, getDocuments, deleteDocument,
    createRecruitment, getRecruitments, getRecruitment, updateRecruitment, deleteRecruitment,
    createRecruitmentApplication, getRecruitmentApplications, updateRecruitmentApplication
}