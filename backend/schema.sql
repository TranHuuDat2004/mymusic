-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Chọn "New query" -> Dán toàn bộ nội dung dưới đây và nhấn Run.

-- 1. Xóa các bảng cũ nếu đã tồn tại để tránh xung đột
DROP TABLE IF EXISTS user_liked_songs CASCADE;
DROP TABLE IF EXISTS playlist_songs CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Tạo bảng Artists
CREATE TABLE artists (
    id TEXT PRIMARY KEY, -- Sử dụng slug (ví dụ: 'alanwalker')
    name TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    monthly_listeners TEXT
);

-- 3. Tạo bảng Songs
CREATE TABLE songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
    art_url TEXT,
    audio_src TEXT NOT NULL,
    plays INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT FALSE
);

-- 4. Tạo bảng Playlists
CREATE TABLE playlists (
    id TEXT PRIMARY KEY, -- Sử dụng slug (ví dụ: 'VpopRemix')
    title TEXT NOT NULL,
    description TEXT
);

-- 5. Tạo bảng trung gian Playlist_Songs (liên kết nhiều-nhiều giữa Playlists và Songs)
CREATE TABLE playlist_songs (
    playlist_id TEXT REFERENCES playlists(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    PRIMARY KEY (playlist_id, song_id)
);

-- 6. Tạo bảng Users
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT 'img/avatar.png',
    password TEXT NOT NULL, -- Sẽ lưu password đã được mã hóa bằng bcryptjs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tạo bảng trung gian User_Liked_Songs (lưu danh sách nhạc yêu thích của người dùng)
CREATE TABLE user_liked_songs (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, song_id)
);
