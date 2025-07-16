// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (loại bỏ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin người dùng từ ID trong token và gắn vào request
            // .select('-password') để không lấy trường password
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Cho phép request đi tiếp
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không có token' });
    }
};

module.exports = { protect };