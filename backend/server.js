require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

// --- API ROUTES ---

// API để lấy tất cả các playlist/section cho trang chủ
app.get('/api/sections', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs');
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API để lấy toàn bộ thư viện bài hát
app.get('/api/library', async (req, res) => {
    try {
        const allSongs = await Song.find();
        res.json(allSongs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API để lấy thông tin chi tiết của một nghệ sĩ
app.get('/api/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        const songs = await Song.find({ artistId: req.params.id });
        if (!artist) return res.status(404).json({ message: 'Artist not found' });
        res.json({ artist, songs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ... (Thêm các route khác cho search, playlist detail, etc.)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));