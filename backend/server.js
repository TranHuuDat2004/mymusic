// backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import các models
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');

const app = express();

// --- Middlewares ---
// Cho phép các request từ mọi nguồn gốc (quan trọng cho front-end)
app.use(cors()); 
// Giúp server có thể đọc được dữ liệu JSON từ body của request
app.use(express.json()); 

// --- Kết nối đến Database ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- ===== API ROUTES ===== ---

// --- 1. API cho Artists ---

// GET /api/artists - Lấy danh sách tất cả nghệ sĩ
app.get('/api/artists', async (req, res) => {
    try {
        // Lấy tất cả nghệ sĩ và sắp xếp theo tên
        const artists = await Artist.find().sort({ name: 1 });
        res.json(artists);
    } catch (err) {
        console.error("Error fetching artists:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách nghệ sĩ." });
    }
});

// GET /api/artists/:id - Lấy thông tin chi tiết của một nghệ sĩ và các bài hát của họ
app.get('/api/artists/:id', async (req, res) => {
    try {
        const artistId = req.params.id;
        
        // Dùng Promise.all để lấy thông tin nghệ sĩ và bài hát song song
        const [artist, songs] = await Promise.all([
            Artist.findById(artistId),
            Song.find({ artistId: artistId }).sort({ plays: -1 }) // Sắp xếp theo lượt nghe giảm dần
        ]);

        if (!artist) {
            return res.status(404).json({ message: "Không tìm thấy nghệ sĩ." });
        }

        // Gộp kết quả và trả về
        res.json({ ...artist.toObject(), songs: songs });

    } catch (err) {
        console.error(`Error fetching artist ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin nghệ sĩ." });
    }
});


// --- 2. API cho Songs ---

// GET /api/songs - Lấy toàn bộ danh sách bài hát (cho thư viện)
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        console.error("Error fetching songs:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách bài hát." });
    }
});

// GET /api/songs/:id - Lấy thông tin chi tiết một bài hát (ít dùng, nhưng nên có)
app.get('/api/songs/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ message: "Không tìm thấy bài hát." });
        }
        res.json(song);
    } catch (err) {
        console.error(`Error fetching song ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin bài hát." });
    }
});


// --- 3. API cho Playlists ---

// GET /api/playlists - Lấy danh sách tất cả playlist (cho trang all_playlists.html)
app.get('/api/playlists', async (req, res) => {
    try {
        // Chỉ lấy thông tin cơ bản của playlist, không cần populate toàn bộ bài hát
        const playlists = await Playlist.find().select('title'); // Chỉ lấy _id và title
        res.json(playlists);
    } catch (err) {
        console.error("Error fetching playlists:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách playlist." });
    }
});

// GET /api/playlists/sections - Lấy các section cho trang chủ
// Đây là API mà chúng ta đã thảo luận, nó lấy cả thông tin bài hát
app.get('/api/playlists/sections', async (req, res) => {
    try {
        // Dùng populate để lấy thông tin chi tiết của các bài hát trong playlist
        const playlistsWithSongs = await Playlist.find().populate('songs');
        res.json(playlistsWithSongs);
    } catch (err) {
        console.error("Error fetching playlist sections:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy các section." });
    }
});

// GET /api/playlists/:id - Lấy thông tin chi tiết của một playlist
app.get('/api/playlists/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: "Không tìm thấy playlist." });
        }
        res.json(playlist);
    } catch (err)
    {
        console.error(`Error fetching playlist ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy chi tiết playlist." });
    }
});


// --- Khởi động Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} http://localhost:${PORT}/`));