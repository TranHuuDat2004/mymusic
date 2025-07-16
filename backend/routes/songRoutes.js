// backend/routes/songRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// @desc    Thêm/xóa một bài hát khỏi danh sách yêu thích
// @route   PUT /api/songs/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Lấy user từ middleware
        const songId = req.params.id;

        const index = user.likedSongs.indexOf(songId);

        if (index > -1) {
            // Nếu bài hát đã có trong danh sách -> Xóa đi (unlike)
            user.likedSongs.splice(index, 1);
            await user.save();
            res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
        } else {
            // Nếu chưa có -> Thêm vào (like)
            user.likedSongs.push(songId);
            await user.save();
            res.json({ message: 'Đã thêm vào danh sách yêu thích' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});


// @desc    Lấy danh sách các bài hát yêu thích của người dùng
// @route   GET /api/songs/favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
    try {
        // Tìm người dùng và populate (lấy toàn bộ thông tin) các bài hát đã thích
        const user = await User.findById(req.user._id).populate('likedSongs');
        
        if (user) {
            res.json(user.likedSongs);
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;