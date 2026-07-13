// backend/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const supabase = require('./supabaseClient');

const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const userRoutes = require('./routes/userRoutes');
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
app.use(express.static(path.join(__dirname, '../public')));

// Route cho trang chủ
app.get('/', async (req, res) => {
    try {
        // Lấy tất cả playlists và JOIN các bài hát của từng playlist từ Supabase
        const { data: playlistsData, error } = await supabase
            .from('playlists')
            .select(`
                id,
                title,
                description,
                playlist_songs (
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
                )
            `);

        if (error) {
            throw error;
        }

        // Format lại dữ liệu tương thích cấu trúc MongoDB cũ (.populate('songs'))
        const sections = playlistsData.map(pl => ({
            _id: pl.id,
            id: pl.id,
            title: pl.title,
            description: pl.description,
            songs: pl.playlist_songs
                .map(ps => ps.songs)
                .filter(s => s !== null)
                .map(s => ({
                    ...s,
                    _id: s.id,
                    artUrl: s.art_url,
                    audioSrc: s.audio_src,
                    plays: s.plays.toLocaleString('vi-VN'), // Định dạng dấu chấm hàng nghìn như cũ
                    isFavorite: s.is_favorite
                }))
        }));

        res.render('index', {
            title: 'MyMusic Player - Trang chủ',
            welcomeMessage: 'Chào mừng trở lại, Trần Hữu Đạt',
            sections: sections
        });

    } catch (error) {
        console.error("Error rendering homepage:", error);
        res.status(500).send("Lỗi tải trang");
    }
});

// --- ROUTE CHO TRANG ALL PLAYLISTS ---
app.get('/all_playlists', async (req, res) => {
    try {
        // Lấy tất cả playlists cùng các bài hát từ Supabase
        const { data: playlistsData, error } = await supabase
            .from('playlists')
            .select(`
                id,
                title,
                description,
                playlist_songs (
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
                )
            `);

        if (error) {
            throw error;
        }

        const playlists = playlistsData.map(pl => ({
            _id: pl.id,
            id: pl.id,
            title: pl.title,
            description: pl.description,
            songs: pl.playlist_songs
                .map(ps => ps.songs)
                .filter(s => s !== null)
                .slice(0, 1) // Chỉ lấy 1 bài hát làm ảnh bìa giống cũ
                .map(s => ({
                    ...s,
                    _id: s.id,
                    artUrl: s.art_url,
                    audioSrc: s.audio_src
                }))
        }));

        res.render('all_playlists', {
            title: 'Tất cả Playlist - My Music Player',
            playlists: playlists
        });

    } catch (error) {
        console.error("Error rendering all playlists page:", error);
        res.status(500).send("Lỗi tải trang");
    }
});

// --- ROUTE CHO TRANG CHI TIẾT PLAYLIST ---
app.get('/playlist', async (req, res) => {
    const playlistId = req.query.id;

    if (!playlistId) {
        return res.status(400).render('error', { 
            title: "Lỗi",
            message: "Không tìm thấy ID của playlist." 
        });
    }

    try {
        const { data: pl, error } = await supabase
            .from('playlists')
            .select(`
                id,
                title,
                description,
                playlist_songs (
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
                )
            `)
            .eq('id', playlistId)
            .maybeSingle();

        if (error) throw error;

        if (!pl) {
            return res.status(404).render('error', { 
                title: "Không tìm thấy",
                message: "Playlist bạn yêu cầu không tồn tại hoặc đã bị xóa." 
            });
        }

        const playlist = {
            _id: pl.id,
            id: pl.id,
            title: pl.title,
            description: pl.description,
            songs: pl.playlist_songs
                .map(ps => ps.songs)
                .filter(s => s !== null)
                .map(s => ({
                    ...s,
                    _id: s.id,
                    artUrl: s.art_url,
                    audioSrc: s.audio_src,
                    plays: s.plays.toLocaleString('vi-VN'),
                    isFavorite: s.is_favorite
                }))
        };

        res.render('playlist', {
            title: `${playlist.title} - My Music Player`,
            playlist: playlist
        });

    } catch (error) {
        console.error(`Error rendering playlist page for ID ${playlistId}:`, error);
        res.status(500).render('error', { 
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải trang playlist."
        });
    }
});

// --- ROUTE CHO TRANG CHI TIẾT NGHỆ SĨ ---
app.get('/artist', async (req, res) => {
    const artistId = req.query.artistId;

    if (!artistId) {
        return res.status(400).render('error', { 
            title: "Lỗi",
            message: "Không tìm thấy ID của nghệ sĩ." 
        });
    }

    try {
        const [artistRes, songsRes] = await Promise.all([
            supabase.from('artists').select('*').eq('id', artistId).maybeSingle(),
            supabase.from('songs').select('*').eq('artist_id', artistId).order('plays', { ascending: false })
        ]);

        if (artistRes.error) throw artistRes.error;
        if (songsRes.error) throw songsRes.error;

        if (!artistRes.data) {
            return res.status(404).render('error', { 
                title: "Không tìm thấy",
                message: "Nghệ sĩ bạn yêu cầu không tồn tại." 
            });
        }

        const artistData = {
            ...artistRes.data,
            _id: artistRes.data.id,
            avatarUrl: artistRes.data.avatar_url,
            bannerUrl: artistRes.data.banner_url,
            monthlyListeners: artistRes.data.monthly_listeners,
            songs: songsRes.data.map(s => ({
                ...s,
                _id: s.id,
                artUrl: s.art_url,
                audioSrc: s.audio_src,
                plays: s.plays.toLocaleString('vi-VN'),
                isFavorite: s.is_favorite
            }))
        };

        res.render('artist', {
            title: `${artistData.name} - My Music Player`,
            artist: artistData
        });

    } catch (error) {
        console.error(`Error rendering artist page for ID ${artistId}:`, error);
        res.status(500).render('error', { 
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải trang nghệ sĩ."
        });
    }
});

// --- ROUTE CHO TRANG DANH SÁCH NGHỆ SĨ ---
app.get('/artists', async (req, res) => {
    try {
        const { data: allArtistsData, error } = await supabase
            .from('artists')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        const allArtists = allArtistsData.map(a => ({
            ...a,
            _id: a.id,
            avatarUrl: a.avatar_url,
            bannerUrl: a.banner_url,
            monthlyListeners: a.monthly_listeners
        }));

        res.render('artists', {
            title: 'Nghệ Sĩ - My Music Player',
            artists: allArtists
        });

    } catch (error) {
        console.error("Error rendering artists list page:", error);
        res.status(500).render('error', {
            title: "Lỗi Server",
            message: "Đã có lỗi xảy ra khi tải danh sách nghệ sĩ."
        });
    }
});

// --- TRANG TĨNH ---
app.get('/search', (req, res) => {
    res.render('search', { title: 'Tìm kiếm - My Music Player' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Giới thiệu - My Music Player' });
});

app.get('/cookie', (req, res) => {
    res.render('cookie', { title: 'Chính sách Cookie - My Music Player' });
});

app.get('/legal', (req, res) => {
    res.render('legal', { title: 'Pháp lý - My Music Player' });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Chính sách Quyền riêng tư - My Music Player' });
});

app.get('/tutorial', (req, res) => {
    res.render('tutorial', { title: 'Hướng dẫn sử dụng - My Music Player' });
});

app.get('/version', (req, res) => {
    res.render('version', { title: 'Lịch sử phiên bản - My Music Player' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Đăng nhập - My Music Player' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Đăng ký - My Music Player' });
});

app.get('/library', (req, res) => {
    res.render('library', { title: 'Thư viện - My Music Player' });
});

app.get('/favorite', (req, res) => {
    res.render('favorite', { title: 'Nhạc yêu thích - My Music Player' });
});

app.get('/account', protect, (req, res) => {
    res.render('account', {
        title: 'Cài đặt tài khoản - My Music Player',
        user: req.user
    });
});

// --- ===== API ROUTES ===== ---
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/user', userRoutes);

// GET /api/artists
app.get('/api/artists', async (req, res) => {
    try {
        const { data: artistsData, error } = await supabase
            .from('artists')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        const artists = artistsData.map(a => ({
            ...a,
            _id: a.id,
            avatarUrl: a.avatar_url,
            bannerUrl: a.banner_url,
            monthlyListeners: a.monthly_listeners
        }));

        res.json(artists);
    } catch (err) {
        console.error("Error fetching artists:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách nghệ sĩ." });
    }
});

// GET /api/artists/:id
app.get('/api/artists/:id', async (req, res) => {
    try {
        const artistId = req.params.id;

        const [artistRes, songsRes] = await Promise.all([
            supabase.from('artists').select('*').eq('id', artistId).maybeSingle(),
            supabase.from('songs').select('*').eq('artist_id', artistId).order('plays', { ascending: false })
        ]);

        if (artistRes.error) throw artistRes.error;
        if (songsRes.error) throw songsRes.error;

        if (!artistRes.data) {
            return res.status(404).json({ message: "Không tìm thấy nghệ sĩ." });
        }

        const artist = {
            ...artistRes.data,
            _id: artistRes.data.id,
            avatarUrl: artistRes.data.avatar_url,
            bannerUrl: artistRes.data.banner_url,
            monthlyListeners: artistRes.data.monthly_listeners,
            songs: songsRes.data.map(s => ({
                ...s,
                _id: s.id,
                artUrl: s.art_url,
                audioSrc: s.audio_src,
                isFavorite: s.is_favorite
            }))
        };

        res.json(artist);

    } catch (err) {
        console.error(`Error fetching artist ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin nghệ sĩ." });
    }
});

// GET /api/songs
app.get('/api/songs', async (req, res) => {
    try {
        const { data: songsData, error } = await supabase.from('songs').select('*');
        if (error) throw error;

        const songs = songsData.map(s => ({
            ...s,
            _id: s.id,
            artUrl: s.art_url,
            audioSrc: s.audio_src,
            isFavorite: s.is_favorite
        }));

        res.json(songs);
    } catch (err) {
        console.error("Error fetching songs:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách bài hát." });
    }
});

// GET /api/songs/:id
app.get('/api/songs/:id', async (req, res) => {
    try {
        const { data: song, error } = await supabase
            .from('songs')
            .select('*')
            .eq('id', req.params.id)
            .maybeSingle();

        if (error) throw error;

        if (!song) {
            return res.status(404).json({ message: "Không tìm thấy bài hát." });
        }

        res.json({
            ...song,
            _id: song.id,
            artUrl: song.art_url,
            audioSrc: song.audio_src,
            isFavorite: song.is_favorite
        });
    } catch (err) {
        console.error(`Error fetching song ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin bài hát." });
    }
});

// GET /api/playlists
app.get('/api/playlists', async (req, res) => {
    try {
        const { data: playlistsData, error } = await supabase.from('playlists').select('id, title');
        if (error) throw error;

        const playlists = playlistsData.map(pl => ({
            _id: pl.id,
            id: pl.id,
            title: pl.title
        }));

        res.json(playlists);
    } catch (err) {
        console.error("Error fetching playlists:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách playlist." });
    }
});

// GET /api/playlists/sections
app.get('/api/playlists/sections', async (req, res) => {
    try {
        const { data: playlistsData, error } = await supabase
            .from('playlists')
            .select(`
                id,
                title,
                description,
                playlist_songs (
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
                )
            `);

        if (error) throw error;

        const sections = playlistsData.map(pl => ({
            _id: pl.id,
            id: pl.id,
            title: pl.title,
            description: pl.description,
            songs: pl.playlist_songs
                .map(ps => ps.songs)
                .filter(s => s !== null)
                .map(s => ({
                    ...s,
                    _id: s.id,
                    artUrl: s.art_url,
                    audioSrc: s.audio_src,
                    isFavorite: s.is_favorite
                }))
        }));

        res.json(sections);
    } catch (err) {
        console.error("Error fetching playlist sections:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy các section." });
    }
});

// GET /api/playlists/:id
app.get('/api/playlists/:id', async (req, res) => {
    try {
        const { data: pl, error } = await supabase
            .from('playlists')
            .select(`
                id,
                title,
                description,
                playlist_songs (
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
                )
            `)
            .eq('id', req.params.id)
            .maybeSingle();

        if (error) throw error;

        if (!pl) {
            return res.status(404).json({ message: "Không tìm thấy playlist." });
        }

        const playlist = {
            _id: pl.id,
            id: pl.id,
            title: pl.title,
            description: pl.description,
            songs: pl.playlist_songs
                .map(ps => ps.songs)
                .filter(s => s !== null)
                .map(s => ({
                    ...s,
                    _id: s.id,
                    artUrl: s.art_url,
                    audioSrc: s.audio_src,
                    isFavorite: s.is_favorite
                }))
        };

        res.json(playlist);
    } catch (err) {
        console.error(`Error fetching playlist ${req.params.id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy chi tiết playlist." });
    }
});

// GET /api/search
app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({ artists: [], songs: [] });
    }

    try {
        const [artistsRes, songsRes] = await Promise.all([
            supabase.from('artists').select('*').ilike('name', `%${query}%`).limit(10),
            supabase.from('songs').select('*').or(`title.ilike.%${query}%,artist_name.ilike.%${query}%`).limit(50)
        ]);

        if (artistsRes.error) throw artistsRes.error;
        if (songsRes.error) throw songsRes.error;

        const artists = (artistsRes.data || []).map(a => ({
            ...a,
            _id: a.id,
            avatarUrl: a.avatar_url,
            bannerUrl: a.banner_url
        }));

        const songs = (songsRes.data || []).map(s => ({
            ...s,
            _id: s.id,
            artUrl: s.art_url,
            audioSrc: s.audio_src,
            isFavorite: s.is_favorite
        }));

        res.json({ artists, songs });

    } catch (error) {
        console.error("API search error:", error);
        res.status(500).json({ message: "Lỗi server khi thực hiện tìm kiếm." });
    }
});

// --- Khởi động Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} http://localhost:${PORT}/`));