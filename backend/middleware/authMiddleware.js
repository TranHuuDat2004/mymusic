// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (loại bỏ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin người dùng từ Supabase (loại bỏ trường password)
            const { data: user, error } = await supabase
                .from('users')
                .select('id, username, email, avatar_url, created_at, updated_at')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                return res.status(401).json({ message: 'Không được phép, không tìm thấy người dùng' });
            }

            // Gắn thông tin người dùng vào request (thêm _id và avatarUrl tương thích ngược)
            req.user = {
                ...user,
                _id: user.id,
                avatarUrl: user.avatar_url
            };
            
            next(); // Cho phép request đi tiếp
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không được phép, không có token' });
    }
};

module.exports = { protect };