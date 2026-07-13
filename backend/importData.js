// backend/importData.js (Phiên bản an toàn)

// Import các thư viện cần thiết
require('dotenv').config();
const mongoose = require('mongoose');

// Import các models
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');
// KHÔNG import model User ở đây để tránh thao tác nhầm

// Import dữ liệu nhạc
const allMusicData = require('./music.js'); // Sửa lại đường dẫn nếu cần

// --- KẾT NỐI ĐẾN DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected for data import...');
        importData();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// --- HÀM XỬ LÝ IMPORT ---
const importData = async () => {
    try {
        // --- 1. XÓA DỮ LIỆU CŨ MỘT CÁCH AN TOÀN ---
        // THAY ĐỔI QUAN TRỌNG: Thay vì xóa toàn bộ database,
        // chúng ta chỉ xóa dữ liệu từ các collection cụ thể.
        // Collection 'users' và các collection khác sẽ không bị ảnh hưởng.
        console.log('Clearing existing music data (Songs, Artists, Playlists)...');
        await Song.deleteMany({});
        await Artist.deleteMany({});
        await Playlist.deleteMany({});
        console.log('Music data cleared successfully. User data remains untouched.');

        // --- 2. XỬ LÝ VÀ CHUẨN BỊ DỮ LIỆU MỚI ---
        console.log('Processing data from music.js...');
        const allSongsFromJs = allMusicData.flatMap(section => section.songs);

        const artistsMap = new Map();
        allSongsFromJs.forEach(song => {
            if (song.displayArtist && song.displayArtist.id) {
                if (!artistsMap.has(song.displayArtist.id)) {
                    artistsMap.set(song.displayArtist.id, {
                        _id: song.displayArtist.id,
                        name: song.displayArtist.name,
                        avatarUrl: song.artUrl,
                        bannerUrl: song.artUrl // Tạm thời dùng chung ảnh
                    });
                }
            }
        });
        const uniqueArtistsToInsert = Array.from(artistsMap.values());

        // Tạo một map để tra cứu ID bài hát mới một cách hiệu quả
        const songIdMap = new Map();
        const songsToInsert = allSongsFromJs.map(song => {
            const newSongId = new mongoose.Types.ObjectId();
            songIdMap.set(song.audioSrc, newSongId); // Lưu lại ID mới theo audioSrc
            return {
                _id: newSongId,
                title: song.title,
                artistName: song.displayArtist ? song.displayArtist.name : 'Unknown Artist',
                artistId: song.displayArtist ? song.displayArtist.id : null,
                artUrl: song.artUrl,
                audioSrc: song.audioSrc,
                plays: parseInt(String(song.plays).replace(/\D/g, '')) || Math.floor(Math.random() * 100000),
                isFavorite: song.isFavorite || false
            };
        });

        // --- 3. CHÈN DỮ LIỆU VÀO DATABASE ---
        console.log(`Inserting ${uniqueArtistsToInsert.length} new artists...`);
        if (uniqueArtistsToInsert.length > 0) {
            await Artist.insertMany(uniqueArtistsToInsert);
        }
        console.log('Artists inserted.');

        console.log(`Inserting ${songsToInsert.length} new songs...`);
        if (songsToInsert.length > 0) {
            await Song.insertMany(songsToInsert);
        }
        console.log('Songs inserted.');

        // --- 4. TẠO PLAYLIST VÀ LIÊN KẾT BÀI HÁT ---
        console.log('Creating playlists and linking songs...');
        const playlistsToInsert = allMusicData.map(section => {
            const songIdsForPlaylist = section.songs
                .map(songJs => songIdMap.get(songJs.audioSrc)) // Tra cứu ID mới từ map
                .filter(id => id); // Lọc bỏ các giá trị undefined nếu không tìm thấy

            return {
                _id: section.id,
                title: section.title,
                description: section.description || `Tuyển tập các bài hát hay nhất thuộc thể loại ${section.title}.`,
                songs: songIdsForPlaylist
            };
        });

        if (playlistsToInsert.length > 0) {
            await Playlist.insertMany(playlistsToInsert);
        }
        console.log(`${playlistsToInsert.length} playlists created and linked.`);
        
        console.log('-----------------------------------');
        console.log('✅ DATA IMPORTED SUCCESSFULLY! ✅');
        console.log('-----------------------------------');
        process.exit();

    } catch (error) {
        console.error('Error during data import:', error);
        process.exit(1);
    }
};