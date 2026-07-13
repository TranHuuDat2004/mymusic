// backend/uploadToSupabase.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const supabase = require('./supabaseClient');
const allMusicData = require('./music.js');

const BUCKET_NAME = 'mymusic';

// Helper: Chuyển đổi tên file cục bộ và upload lên Supabase Storage
async function uploadFileToStorage(localSubPath) {
    if (!localSubPath) return null;

    // Chuẩn hóa đường dẫn cục bộ
    // Ví dụ: localSubPath = 'audio/bac-phan.mp3' -> localFilePath = 'public/audio/bac-phan.mp3'
    const localFilePath = path.join(__dirname, '../public', localSubPath);

    if (!fs.existsSync(localFilePath)) {
        console.warn(`⚠️  Không tìm thấy file: ${localFilePath}`);
        return null;
    }

    // Đường dẫn lưu trữ trong Bucket (loại bỏ dấu tiếng Việt, ký tự đặc biệt và khoảng trắng để tránh lỗi Invalid Key)
    const ext = path.extname(localSubPath);
    const dir = path.dirname(localSubPath).replace(/\\/g, '/');
    const baseName = path.basename(localSubPath, ext);

    const cleanBaseName = baseName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-zA-Z0-9\s-_]/g, '') // Loại bỏ ký tự lạ
        .trim()
        .replace(/\s+/g, '-') // Đổi dấu cách thành gạch ngang
        .toLowerCase();

    const storagePath = (dir === '.' ? '' : dir + '/') + cleanBaseName + ext;

    const fileBuffer = fs.readFileSync(localFilePath);
    const fileExt = path.extname(localFilePath).toLowerCase();

    // Xác định Content-Type phù hợp
    let contentType = 'application/octet-stream';
    if (fileExt === '.mp3') contentType = 'audio/mpeg';
    else if (fileExt === '.png') contentType = 'image/png';
    else if (fileExt === '.jpg' || fileExt === '.jpeg') contentType = 'image/jpeg';
    else if (fileExt === '.webp') contentType = 'image/webp';

    console.log(`[Upload] Đang upload ${localSubPath} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)...`);

    // Thực hiện tải lên (upsert: true để ghi đè nếu file đã tồn tại, cacheControl: 1 năm để tiết kiệm băng thông)
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: contentType,
            upsert: true,
            cacheControl: '31536000'
        });

    if (error) {
        console.error(`❌ Lỗi upload file ${localSubPath}:`, error.message);
        return null;
    }

    // Lấy Public URL của file đã tải lên
    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

    return publicUrlData.publicUrl;
}

async function runMigration() {
    try {
        console.log('--- KHỞI ĐỘNG QUÁ TRÌNH DI CHUYỂN SANG SUPABASE ---');

        // 1. Kiểm tra / Tạo bucket 'mymusic'
        console.log(`Kiểm tra bucket '${BUCKET_NAME}'...`);
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error('❌ Lỗi khi kiểm tra buckets:', bucketError.message);
            console.log('👉 Vui lòng tạo bucket public tên là "mymusic" thủ công trên Supabase Dashboard.');
            return;
        }

        const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
        if (!bucketExists) {
            console.log(`Bucket '${BUCKET_NAME}' chưa tồn tại. Đang tiến hành tạo mới...`);
            const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
                public: true
            });
            if (createError) {
                console.error('❌ Lỗi tạo bucket:', createError.message);
                console.log('👉 Vui lòng tạo bucket public tên là "mymusic" thủ công trên Supabase Dashboard.');
                return;
            }
            console.log(`✅ Đã tạo thành công public bucket '${BUCKET_NAME}'.`);
        } else {
            console.log(`✅ Bucket '${BUCKET_NAME}' đã tồn tại và sẵn sàng.`);
        }

        // 2. Xóa sạch dữ liệu cũ trong Database (Chỉ xóa Songs, Artists, Playlists, Playlist_Songs)
        console.log('Đang làm sạch dữ liệu cũ trong cơ sở dữ liệu Supabase...');
        
        // Vì có khóa ngoại nên cần xóa bảng trung gian trước
        await supabase.from('playlist_songs').delete().neq('playlist_id', '');
        await supabase.from('songs').delete().neq('title', '');
        await supabase.from('artists').delete().neq('name', '');
        await supabase.from('playlists').delete().neq('title', '');

        console.log('✅ Đã xóa sạch dữ liệu cũ.');

        // 3. Trích xuất Nghệ sĩ độc nhất & Upload ảnh đại diện nghệ sĩ
        console.log('Trích xuất thông tin các nghệ sĩ...');
        const artistsMap = new Map();
        allMusicData.forEach(section => {
            section.songs.forEach(song => {
                if (song.displayArtist && song.displayArtist.id) {
                    const artistId = song.displayArtist.id;
                    if (!artistsMap.has(artistId)) {
                        artistsMap.set(artistId, {
                            id: artistId,
                            name: song.displayArtist.name,
                            avatarUrlLocal: song.artUrl // Tạm thời lấy artUrl bài hát làm ảnh đại diện
                        });
                    }
                }
            });
        });

        // Di chuyển và lưu thông tin nghệ sĩ
        const artistsToInsert = [];
        for (const [artistId, artistData] of artistsMap.entries()) {
            console.log(`\nĐang xử lý ảnh đại diện cho Nghệ sĩ: ${artistData.name}`);
            const supabaseAvatarUrl = await uploadFileToStorage(artistData.avatarUrlLocal);
            artistsToInsert.push({
                id: artistData.id,
                name: artistData.name,
                avatar_url: supabaseAvatarUrl || artistData.avatarUrlLocal,
                banner_url: supabaseAvatarUrl || artistData.avatarUrlLocal
            });
        }

        console.log(`\nĐang chèn ${artistsToInsert.length} nghệ sĩ vào database...`);
        const { error: artistInsertError } = await supabase.from('artists').insert(artistsToInsert);
        if (artistInsertError) {
            console.error('❌ Lỗi chèn nghệ sĩ:', artistInsertError.message);
            return;
        }
        console.log('✅ Đã lưu danh sách nghệ sĩ thành công.');

        // 4. Tạo các Playlists
        console.log('\nĐang xử lý danh sách các Playlist...');
        const playlistsToInsert = allMusicData.map(section => ({
            id: section.id,
            title: section.title,
            description: section.description || `Tuyển tập các bài hát hay nhất thuộc thể loại ${section.title}.`
        }));

        const { error: playlistInsertError } = await supabase.from('playlists').insert(playlistsToInsert);
        if (playlistInsertError) {
            console.error('❌ Lỗi chèn playlist:', playlistInsertError.message);
            return;
        }
        console.log(`✅ Đã lưu ${playlistsToInsert.length} playlist thành công.`);

        // 5. Upload File Nhạc & Ảnh bìa của từng bài hát, sau đó lưu vào database
        console.log('\nĐang xử lý upload file nhạc và ảnh bìa...');
        
        // Để dễ dàng liên kết bài hát với playlist sau khi insert, ta lập một Map lưu thông tin
        // key là audioSrc cũ của bài hát, value là UUID mới được tạo trong database
        const songSourceToUuidMap = new Map();

        for (const section of allMusicData) {
            console.log(`\n--- Đang xử lý các bài hát trong playlist: ${section.title} ---`);
            
            for (const song of section.songs) {
                console.log(`\nBài hát: "${song.title}" - ${song.artistData}`);
                
                // Upload nhạc
                const supabaseAudioUrl = await uploadFileToStorage(song.audioSrc);
                // Upload ảnh cover
                const supabaseCoverUrl = await uploadFileToStorage(song.artUrl);

                if (!supabaseAudioUrl) {
                    console.warn(`⚠️ Bỏ qua bài hát "${song.title}" vì không upload được file âm thanh.`);
                    continue;
                }

                const playsClean = parseInt(String(song.plays).replace(/\D/g, '')) || Math.floor(Math.random() * 100000);

                // Chèn bài hát vào database để lấy UUID tự động sinh ra
                const songRecord = {
                    title: song.title,
                    artist_name: song.displayArtist ? song.displayArtist.name : 'Unknown Artist',
                    artist_id: song.displayArtist ? song.displayArtist.id : null,
                    art_url: supabaseCoverUrl || song.artUrl,
                    audio_src: supabaseAudioUrl,
                    plays: playsClean,
                    is_favorite: song.isFavorite || false
                };

                const { data: insertedSong, error: songInsertError } = await supabase
                    .from('songs')
                    .insert(songRecord)
                    .select()
                    .single();

                if (songInsertError) {
                    console.error(`❌ Lỗi chèn bài hát "${song.title}":`, songInsertError.message);
                    continue;
                }

                console.log(`✅ Đã lưu bài hát "${song.title}" (ID: ${insertedSong.id})`);
                songSourceToUuidMap.set(song.audioSrc, insertedSong.id);
            }
        }

        // 6. Tạo liên kết nhiều-nhiều trong bảng playlist_songs
        console.log('\nĐang liên kết các bài hát vào playlist tương ứng...');
        const playlistSongsToInsert = [];

        allMusicData.forEach(section => {
            section.songs.forEach(song => {
                const songUuid = songSourceToUuidMap.get(song.audioSrc);
                if (songUuid) {
                    playlistSongsToInsert.push({
                        playlist_id: section.id,
                        song_id: songUuid
                    });
                }
            });
        });

        if (playlistSongsToInsert.length > 0) {
            const { error: linkError } = await supabase.from('playlist_songs').insert(playlistSongsToInsert);
            if (linkError) {
                console.error('❌ Lỗi khi liên kết bài hát vào playlist:', linkError.message);
                return;
            }
            console.log(`✅ Đã liên kết thành công ${playlistSongsToInsert.length} bản ghi vào playlist_songs.`);
        }

        console.log('\n======================================================');
        console.log('🎉 QUÁ TRÌNH DI CHUYỂN DỮ LIỆU SANG SUPABASE HOÀN TẤT! 🎉');
        console.log('======================================================');
        process.exit(0);

    } catch (err) {
        console.error('❌ Lỗi không mong muốn trong quá trình chạy script:', err);
        process.exit(1);
    }
}

runMigration();
