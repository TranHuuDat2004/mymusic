const mongoose = require('mongoose');
const playlistSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Dùng slug làm _id (ví dụ: 'VpopRemix')
    title: { type: String, required: true },
    description: String,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // Mảng các ID của bài hát
});
module.exports = mongoose.model('Playlist', playlistSchema);