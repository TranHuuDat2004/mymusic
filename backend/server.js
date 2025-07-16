// backend/server.js

require('dotenv').config();
const express = require('express');
const path = require('path'); // Import module 'path' của Node.js
const mongoose = require('mongoose');
const cors = require('cors');

// --- IMPORT TẤT CẢ MODELS NGAY TẠI ĐÂY ---
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');
// ------------------------------------------


const app = express();

// --- CẤU HÌNH ---
app.use(cors());
app.use(express.json());

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');
// 2. Chỉ định thư mục chứa các file view
app.set('views', path.join(__dirname, 'views'));

// 3. Cấu hình thư mục Public để phục vụ các file tĩnh (CSS, JS, images)
// Dòng này rất quan trọng! Nó nói với Express rằng thư mục `public` ở cấp cao hơn
app.use(express.static(path.join(__dirname, '../public')));

// --- Middlewares ---
// Cho phép các request từ mọi nguồn gốc (quan trọng cho front-end)
app.use(cors());
// Giúp server có thể đọc được dữ liệu JSON từ body của request
app.use(express.json());

// --- Kết nối đến Database ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));


// Route cho trang chủ
app.get('/', async (req, res) => {
    try {
        // Lấy dữ liệu từ database
        const Playlist = require('./models/Playlist');
        const sections = await Playlist.find().populate('songs');

        // Render file index.ejs và truyền dữ liệu vào
        res.render('index', {
            title: 'MyMusic Player - Trang chủ',
            welcomeMessage: 'Chào mừng trở lại, Trần Hữu Đạt',
            sections: sections // Truyền toàn bộ sections vào view
        });

    } catch (error) {
        console.error("Error rendering homepage:", error);
        res.status(500).send("Lỗi tải trang");
    }
});

// --- THÊM ROUTE MỚI CHO TRANG ALL PLAYLISTS ---
app.get('/all_playlists', async (req, res) => {
    try {
        // Lấy tất cả các playlist từ database
        // Populate bài hát đầu tiên để lấy ảnh bìa
        const playlists = await Playlist.find().populate({
            path: 'songs',
            perDocumentLimit: 1 // Chỉ lấy 1 bài hát đầu tiên cho mỗi playlist
        });

        res.render('all_playlists', {
            title: 'Tất cả Playlist - My Music Player',
            playlists: playlists // Truyền dữ liệu playlists vào view
        });

    } catch (error) {
        console.error("Error rendering all playlists page:", error);
        res.status(500).send("Lỗi tải trang");
    }
});

// --- THÊM ROUTE MỚI CHO TRANG CHI TIẾT PLAYLIST ---
app.get('/playlist', async (req, res) => {
    // Lấy ID của playlist từ query parameter (?id=...)
    const playlistId = req.query.id;

    if (!playlistId) {
        return res.status(400).render('error', { 
            title: "Lỗi",
            message: "Không tìm thấy ID của playlist." 
        });
    }

    try {
        // Tìm playlist trong database bằng ID và populate tất cả các bài hát của nó
        const playlist = await Playlist.findById(playlistId).populate('songs');

        if (!playlist) {
            // Nếu không tìm thấy playlist, render trang lỗi 404
            return res.status(404).render('error', { 
                title: "Không tìm thấy",
                message: "Playlist bạn yêu cầu không tồn tại hoặc đã bị xóa." 
            });
        }

        // Render file playlist.ejs và truyền dữ liệu của playlist tìm được vào
        res.render('playlist', {
            title: `${playlist.title} - My Music Player`,
            playlist: playlist // Truyền toàn bộ object playlist vào view
        });

    } catch (error) {
        console.error(`Error rendering playlist page for ID ${playlistId}:`, error);
        res.status(500).render('error', { 
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải trang playlist."
        });
    }
});


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
    } catch (err) {
        console.error(`Error fetching playlist ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy chi tiết playlist." });
    }
});


// --- Khởi động Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} http://localhost:${PORT}/`));