// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../supabaseClient');

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

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${email.toLowerCase().trim()},username.eq.${username.toLowerCase().trim()}`);

        if (checkError) {
            throw checkError;
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email hoặc tên người dùng đã tồn tại' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới trong Supabase
        const { data: user, error: insertError } = await supabase
            .from('users')
            .insert({
                username: username.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword
            })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        // Trả về thông tin người dùng và token
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatar_url,
            token: generateToken(user.id)
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

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        // Tìm người dùng bằng email
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (fetchError) {
            throw fetchError;
        }

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatar_url,
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});


module.exports = router;