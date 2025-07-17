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
const User = require('./models/User'); // Import User model
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const songRoutes = require('./routes/songRoutes');
const userRoutes = require('./routes/userRoutes');
// ------------------------------------------
const { protect } = require('./middleware/authMiddleware'); 

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

// --- THÊM ROUTE MỚI CHO TRANG CHI TIẾT NGHỆ SĨ ---
app.get('/artist', async (req, res) => {
    const artistId = req.query.artistId;

    if (!artistId) {
        return res.status(400).render('error', { 
            title: "Lỗi",
            message: "Không tìm thấy ID của nghệ sĩ." 
        });
    }

    try {
        // Sử dụng Promise.all để thực hiện 2 truy vấn song song cho hiệu quả
        const [artist, songs] = await Promise.all([
            Artist.findById(artistId),
            // Tìm tất cả bài hát của nghệ sĩ này, sắp xếp theo lượt nghe giảm dần
            Song.find({ artistId: artistId }).sort({ plays: -1 }) 
        ]);

        if (!artist) {
            return res.status(404).render('error', { 
                title: "Không tìm thấy",
                message: "Nghệ sĩ bạn yêu cầu không tồn tại." 
            });
        }

        // Gộp dữ liệu nghệ sĩ và danh sách bài hát của họ vào một object
        const artistData = {
            ...artist.toObject(), // Chuyển Mongoose document thành plain object
            songs: songs // Thêm mảng bài hát vào
        };

        // Render file artist.ejs và truyền dữ liệu đã gộp vào
        res.render('artist', {
            title: `${artist.name} - My Music Player`,
            artist: artistData // Truyền toàn bộ object vào view
        });

    } catch (error) {
        console.error(`Error rendering artist page for ID ${artistId}:`, error);
        res.status(500).render('error', { 
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải trang nghệ sĩ."
        });
    }
});

// backend/server.js

// ... các route khác ...

// --- THÊM ROUTE MỚI CHO TRANG DANH SÁCH NGHỆ SĨ ---
app.get('/artists', async (req, res) => {
    try {
        // Lấy tất cả nghệ sĩ từ database và sắp xếp theo tên A-Z
        const allArtists = await Artist.find().sort({ name: 1 });

        // Render file artists.ejs và truyền mảng nghệ sĩ vào
        res.render('artists', {
            title: 'Nghệ Sĩ - My Music Player',
            artists: allArtists // 'artists' là tên biến sẽ dùng trong file .ejs
        });

    } catch (error) {
        console.error("Error rendering artists list page:", error);
        res.status(500).render('error', {
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải danh sách nghệ sĩ."
        });
    }
});

// --- THÊM ROUTE MỚI CHO TRANG TÌM KIẾM ---
app.get('/search', (req, res) => {
    // Chỉ cần render trang tĩnh, không cần truyền dữ liệu ban đầu
    res.render('search', {
        title: 'Tìm kiếm - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG GIỚI THIỆU ---
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Giới thiệu - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG CHÍNH SÁCH COOKIE ---
app.get('/cookie', (req, res) => {
    res.render('cookie', {
        title: 'Chính sách Cookie - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG PHÁP LÝ ---
app.get('/legal', (req, res) => {
    res.render('legal', {
        title: 'Pháp lý - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG QUYỀN RIÊNG TƯ ---
app.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Chính sách Quyền riêng tư - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG HƯỚNG DẪN SỬ DỤNG ---
app.get('/tutorial', (req, res) => {
    res.render('tutorial', {
        title: 'Hướng dẫn sử dụng - My Music Player'
    });
});

// --- THÊM ROUTE MỚI CHO TRANG LỊCH SỬ PHIÊN BẢN ---
app.get('/version', (req, res) => {
    res.render('version', {
        title: 'Lịch sử phiên bản - My Music Player'
    });
});

// --- THÊM ROUTES ĐỂ RENDER TRANG LOGIN VÀ REGISTER ---
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Đăng nhập - My Music Player'
    });
});

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Đăng ký - My Music Player'
    });
});

// --- ROUTE CHO TRANG THƯ VIỆN ---
// (Đảm bảo route này tồn tại và đúng)
app.get('/library', (req, res) => {
    // Chúng ta sẽ cần một middleware để bảo vệ route này sau, nhưng bây giờ cứ render
    res.render('library', { 
        title: 'Thư viện - My Music Player'
    });
});

app.get('/favorite', (req, res) => {
    // Chúng ta sẽ cần một middleware để bảo vệ route này sau, nhưng bây giờ cứ render
    res.render('favorite', { 
        title: 'Nhạc yêu thích - My Music Player'
    });
});



app.get('/account', (req, res) => {
    // req.user được gắn bởi middleware 'protect'
    const user = req.user; 
    res.render('account', {
        title: 'Cài đặt tài khoản - My Music Player',
        user: user // Truyền thông tin người dùng vào view
    });
});

// --- ===== API ROUTES ===== ---
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes); // THÊM DÒNG NÀY
app.use('/api/user', userRoutes);
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

// GET /api/playlists - Lấy danh sách tất cả playlist (cho trang all_playlists)
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

// --- API ROUTE MỚI CHO TÌM KIẾM ---
app.get('/api/search', async (req, res) => {
    // Lấy query tìm kiếm từ URL, ví dụ: /api/search?q=sơn tùng
    const query = req.query.q;

    if (!query) {
        // Nếu không có query, trả về mảng rỗng
        return res.json({ artists: [], songs: [] });
    }

    try {
        // Tạo một biểu thức chính quy (regular expression) để tìm kiếm không phân biệt hoa thường
        // 'i' là cờ cho "case-insensitive"
        const regex = new RegExp(query, 'i');

        // Dùng Promise.all để tìm kiếm song song trên cả hai collection
        const [foundArtists, foundSongs] = await Promise.all([
            // Tìm nghệ sĩ có tên khớp với regex
            Artist.find({ name: { $regex: regex } }).limit(10), // Giới hạn 10 kết quả
            // Tìm bài hát có tiêu đề HOẶC tên nghệ sĩ khớp với regex
            Song.find({ 
                $or: [
                    { title: { $regex: regex } }, 
                    { artistName: { $regex: regex } }
                ]
            }).limit(50) // Giới hạn 50 kết quả
        ]);
        
        // Trả về kết quả dưới dạng một object JSON
        res.json({
            artists: foundArtists,
            songs: foundSongs
        });

    } catch (error) {
        console.error("API search error:", error);
        res.status(500).json({ message: "Lỗi server khi thực hiện tìm kiếm." });
    }
});


// --- Khởi động Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} http://localhost:${PORT}/`));