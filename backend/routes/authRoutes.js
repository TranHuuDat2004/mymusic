// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

// Hàm tạo token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token hết hạn sau 30 ngày
    });
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'Email hoặc tên người dùng đã tồn tại' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        // Trả về thông tin người dùng và token
        // --- SỬA Ở ĐÂY ---
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl, // Trả về avatarUrl (sẽ là giá trị default)
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});


// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl, // Trả về avatarUrl đã lưu của user
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});


module.exports = router;