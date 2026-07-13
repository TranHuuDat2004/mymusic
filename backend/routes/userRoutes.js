// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const supabase = require('../supabaseClient');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Đảm bảo đã import

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/user/update
// @access  Private
router.put('/update', protect, async (req, res) => {
    const userId = req.user.id;
    const { username, email } = req.body;

    try {
        // Kiểm tra xem username/email mới có bị trùng không (ngoại trừ chính user này)
        const checkQuery = [];
        if (username) checkQuery.push(`username.eq.${username.toLowerCase().trim()}`);
        if (email) checkQuery.push(`email.eq.${email.toLowerCase().trim()}`);

        if (checkQuery.length > 0) {
            const { data: existingUsers, error: checkError } = await supabase
                .from('users')
                .select('id')
                .neq('id', userId)
                .or(checkQuery.join(','));

            if (checkError) {
                throw checkError;
            }

            if (existingUsers && existingUsers.length > 0) {
                return res.status(400).json({ message: "Username hoặc Email đã được sử dụng." });
            }
        }

        const updates = {};
        if (username) updates.username = username.toLowerCase().trim();
        if (email) updates.email = email.toLowerCase().trim();
        updates.updated_at = new Date().toISOString();

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        res.json({
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

router.get('/profile', protect, (req, res) => {
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
    const userId = req.user.id;

    try {
        // Lấy password đã hash từ DB
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('password')
            .eq('id', userId)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const { error: updateError } = await supabase
            .from('users')
            .update({
                password: hashedPassword,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (updateError) {
            throw updateError;
        }

        res.json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// @desc    Đổi avatar
// @route   PUT /api/user/change-avatar
// @access  Private
router.put('/change-avatar', protect, (req, res) => {
    // Gọi upload.single như một middleware với callback để bắt lỗi
    upload.single('avatar')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Lỗi upload: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const userId = req.user.id;
            let newAvatarPath = '';

            if (req.file) {
                // Upload buffer lên Supabase Storage
                const fileName = `uploads/avatars/${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
                
                const { data, error: uploadError } = await supabase.storage
                    .from('mymusic')
                    .upload(fileName, req.file.buffer, {
                        contentType: req.file.mimetype,
                        upsert: true
                    });

                if (uploadError) {
                    return res.status(500).json({ message: `Lỗi khi tải ảnh lên Storage: ${uploadError.message}` });
                }

                // Lấy public URL
                const { data: publicUrlData } = supabase.storage
                    .from('mymusic')
                    .getPublicUrl(fileName);

                newAvatarPath = publicUrlData.publicUrl;
            } else if (req.body.defaultAvatarPath) {
                newAvatarPath = req.body.defaultAvatarPath;
            } else {
                return res.status(400).json({ message: 'Vui lòng tải lên hoặc chọn một ảnh.' });
            }

            // Cập nhật avatar_url của user trong Database
            const { error: dbError } = await supabase
                .from('users')
                .update({
                    avatar_url: newAvatarPath,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (dbError) {
                throw dbError;
            }
            
            res.json({ 
                message: 'Cập nhật avatar thành công.', 
                avatarUrl: newAvatarPath 
            });

        } catch (serverError) {
            console.error("Server error inside avatar logic:", serverError);
            res.status(500).json({ message: "Lỗi server nội bộ khi xử lý avatar." });
        }
    });
});

module.exports = router;