// backend/importData.js

// Import các thư viện cần thiết
require('dotenv').config(); // Để đọc file .env
const mongoose = require('mongoose');

// Import các models
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');

// Import dữ liệu cũ
const allMusicData = require('./music.js'); // Giả sử bạn đã có file music.js chứa dữ liệu bài hát

// --- KẾT NỐI ĐẾN DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected for data import...');
        importData(); // Bắt đầu import sau khi kết nối thành công
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Thoát nếu không kết nối được
    });


// --- HÀM XỬ LÝ IMPORT ---
const importData = async () => {
    try {
        // --- 1. XÓA DỮ LIỆU CŨ (ĐỂ TRÁNH TRÙNG LẶP KHI CHẠY LẠI) ---
        console.log('Clearing existing data...');
        await Song.deleteMany({});
        await Artist.deleteMany({});
        await Playlist.deleteMany({});
        console.log('Data cleared.');

        // --- 2. XỬ LÝ VÀ CHUẨN BỊ DỮ LIỆU MỚI ---
        console.log('Processing data from music.js...');
        const allSongsFromJs = allMusicData.flatMap(section => section.songs);

        // Tạo một Map để lấy danh sách nghệ sĩ duy nhất
        const artistsMap = new Map();
        allSongsFromJs.forEach(song => {
            if (song.displayArtist && song.displayArtist.id) {
                if (!artistsMap.has(song.displayArtist.id)) {
                    artistsMap.set(song.displayArtist.id, {
                        _id: song.displayArtist.id, // Dùng slug làm _id
                        name: song.displayArtist.name,
                        // Tạm thời lấy ảnh bài hát đầu tiên làm avatar
                        avatarUrl: song.artUrl 
                    });
                }
            }
        });
        const uniqueArtistsToInsert = Array.from(artistsMap.values());

        // Chuẩn bị dữ liệu bài hát để chèn
        const songsToInsert = allSongsFromJs.map(song => ({
            _id: new mongoose.Types.ObjectId(), // Tạo một ID mới cho mỗi bài hát
            title: song.title,
            artistName: song.displayArtist.name,
            artistId: song.displayArtist.id,
            artUrl: song.artUrl,
            audioSrc: song.audioSrc,
            plays: parseInt(String(song.plays).replace(/\D/g, '')) || 0,
            isFavorite: song.isFavorite || false
        }));

        // --- 3. CHÈN DỮ LIỆU VÀO DATABASE ---
        console.log('Inserting new artists...');
        await Artist.insertMany(uniqueArtistsToInsert);
        console.log(`${uniqueArtistsToInsert.length} artists inserted.`);

        console.log('Inserting new songs...');
        await Song.insertMany(songsToInsert);
        console.log(`${songsToInsert.length} songs inserted.`);

        // --- 4. TẠO PLAYLIST VÀ LIÊN KẾT BÀI HÁT ---
        console.log('Creating playlists and linking songs...');
        for (const section of allMusicData) {
            // Tìm các ID của các bài hát thuộc về section này trong DB
            const songIdsForPlaylist = section.songs.map(songJs => {
                const foundSongDb = songsToInsert.find(s => s.audioSrc === songJs.audioSrc);
                return foundSongDb ? foundSongDb._id : null;
            }).filter(id => id !== null); // Lọc bỏ các giá trị null nếu không tìm thấy

            const newPlaylist = new Playlist({
                _id: section.id, // Dùng id cũ làm _id
                title: section.title,
                songs: songIdsForPlaylist
            });
            await newPlaylist.save();
        }
        console.log(`${allMusicData.length} playlists created and linked.`);
        
        console.log('-----------------------------------');
        console.log('✅ DATA IMPORTED SUCCESSFULLY! ✅');
        console.log('-----------------------------------');
        process.exit(); // Thoát script sau khi hoàn thành

    } catch (error) {
        console.error('Error during data import:', error);
        process.exit(1); // Thoát nếu có lỗi
    }
};