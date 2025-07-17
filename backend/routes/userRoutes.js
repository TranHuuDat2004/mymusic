// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Đảm bảo đã import
const multer = require('multer'); // Import multer để kiểm tra lỗi
// Import middleware upload đã cấu hình từ multer


// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/user/update
// @access  Private
router.put('/update', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Kiểm tra xem username/email mới có bị trùng không (ngoại trừ chính user này)
        const { username, email } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }], 
            _id: { $ne: user._id } 
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username hoặc Email đã được sử dụng." });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        // Thêm các trường khác nếu bạn cho phép cập nhật
        
        const updatedUser = await user.save();
        
        // Trả về thông tin đã cập nhật (không bao gồm mật khẩu)
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
});

router.get('/profile', protect, (req, res) => {
    // middleware 'protect' đã lấy và gắn user vào req.user
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
});

// @desc    Đổi mật khẩu
// @route   PUT /api/user/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword; // Middleware pre-save sẽ tự động hash
        await user.save();
        res.json({ message: 'Đổi mật khẩu thành công.' });
    } else {
        res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
    }
});

// @desc    Đổi avatar
// @route   PUT /api/user/change-avatar
// @access  Private
router.put('/change-avatar', protect, (req, res) => {
    // Gọi upload.single như một middleware với callback để bắt lỗi
    upload.single('avatar')(req, res, async function (err) {
        // --- Xử lý lỗi từ Multer trước tiên ---
        if (err instanceof multer.MulterError) {
            // Lỗi do multer (file quá lớn, quá nhiều file...)
            return res.status(400).json({ message: `Lỗi upload: ${err.message}` });
        } else if (err) {
            // Lỗi khác do fileFilter (ví dụ: file không phải ảnh)
            return res.status(400).json({ message: err.message });
        }

        // --- Nếu không có lỗi upload, tiếp tục xử lý logic ---
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            let newAvatarPath = '';

            if (req.file) {
                newAvatarPath = req.file.path.replace(/\\/g, '/').replace('public/', '');
            } else if (req.body.defaultAvatarPath) {
                newAvatarPath = req.body.defaultAvatarPath;
            } else {
                return res.status(400).json({ message: 'Vui lòng tải lên hoặc chọn một ảnh.' });
            }

            user.avatarUrl = newAvatarPath;
            await user.save();
            
            res.json({ 
                message: 'Cập nhật avatar thành công.', 
                avatarUrl: user.avatarUrl 
            });

        } catch (serverError) {
            console.error("Server error inside avatar logic:", serverError);
            res.status(500).json({ message: "Lỗi server nội bộ khi xử lý avatar." });
        }
    });
});
module.exports = router;