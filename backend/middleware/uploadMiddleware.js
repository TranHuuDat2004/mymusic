// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ file trong bộ nhớ (Memory Storage) để upload trực tiếp lên Supabase
const storage = multer.memoryStorage();

// Kiểm tra loại file
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)!'));
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;