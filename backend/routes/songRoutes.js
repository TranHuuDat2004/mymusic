// backend/routes/songRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { protect } = require('../middleware/authMiddleware');

// @desc    Thêm/xóa một bài hát khỏi danh sách yêu thích
// @route   PUT /api/songs/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const songId = req.params.id;

        // Kiểm tra xem bài hát đã có trong danh sách yêu thích chưa
        const { data: existingLike, error: fetchError } = await supabase
            .from('user_liked_songs')
            .select('*')
            .eq('user_id', userId)
            .eq('song_id', songId)
            .maybeSingle();

        if (fetchError) {
            throw fetchError;
        }

        if (existingLike) {
            // Nếu bài hát đã có trong danh sách -> Xóa đi (unlike)
            const { error: deleteError } = await supabase
                .from('user_liked_songs')
                .delete()
                .eq('user_id', userId)
                .eq('song_id', songId);

            if (deleteError) {
                throw deleteError;
            }
            res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
        } else {
            // Nếu chưa có -> Thêm vào (like)
            const { error: insertError } = await supabase
                .from('user_liked_songs')
                .insert({
                    user_id: userId,
                    song_id: songId
                });

            if (insertError) {
                throw insertError;
            }
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
        const userId = req.user.id;

        // Lấy danh sách bài hát mà người dùng đã thích qua bảng user_liked_songs (sử dụng join)
        const { data: likedSongsData, error: fetchError } = await supabase
            .from('user_liked_songs')
            .select(`
                songs (
                    id,
                    title,
                    artist_name,
                    artist_id,
                    art_url,
                    audio_src,
                    plays,
                    is_favorite
                )
            `)
            .eq('user_id', userId);
        
        if (fetchError) {
            throw fetchError;
        }

        // Biến đổi cấu trúc trả về để mảng chỉ chứa các object bài hát và thêm trường _id để tương thích frontend
        const songs = likedSongsData
            .map(item => item.songs)
            .filter(song => song !== null)
            .map(song => ({
                ...song,
                _id: song.id
            }));

        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;