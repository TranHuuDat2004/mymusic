// favorite.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Favorite DOMContentLoaded Start");

    const favoriteContainer = document.getElementById('favorite-songs-grid');
    const playlistUl = document.getElementById('playlist-links-list');

    // --- Render danh sách bài hát yêu thích ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && favoriteContainer) {
        favoriteContainer.innerHTML = ''; // Xóa thông báo "Đang tải..."

        const favoriteSongs = [];

        // Lặp qua tất cả các section và bài hát để tìm mục yêu thích
        ALL_MUSIC_SECTIONS.forEach(section => {
            if (Array.isArray(section.songs)) {
                section.songs.forEach(song => {
                    // Kiểm tra thuộc tính isFavorite
                    if (song.isFavorite === true) {
                         // Tránh thêm trùng lặp nếu cùng một bài hát có trong nhiều section (dựa vào id nếu có)
                        const uniqueId = song.id || `${song.title}-${song.artistData}`;
                        if (!favoriteSongs.some(fav => (fav.id || `${fav.title}-${fav.artistData}`) === uniqueId)) {
                            favoriteSongs.push(song);
                        }
                    }
                });
            }
        });

        // Hiển thị kết quả
        if (favoriteSongs.length > 0) {
            favoriteSongs.forEach(song => {
                if (typeof window.createSongCard === 'function') {
                    const card = window.createSongCard(song); // Gọi hàm từ utils.js
                    favoriteContainer.appendChild(card);
                } else {
                    console.error("Hàm createSongCard không tồn tại khi render favorite.");
                }
            });
        } else {
            // Hiển thị thông báo nếu không có bài hát yêu thích nào
            favoriteContainer.innerHTML = '<p>Bạn chưa có bài hát yêu thích nào.</p>';
            // Có thể thêm hướng dẫn cách "thích" bài hát nếu có chức năng đó
        }

    } else {
        console.error("Không tìm thấy dữ liệu ALL_MUSIC_SECTIONS hoặc container favorite.");
        if(favoriteContainer) favoriteContainer.innerHTML = '<p>Lỗi tải danh sách yêu thích.</p>';
    }

    // --- Render playlist links trong sidebar (vẫn cần) ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUl && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUl);
        // Không cần gắn smooth scroll ở đây
    } else {
        console.error("Lỗi: Không tìm thấy dữ liệu nhạc, ul playlist hoặc hàm renderPlaylistLinks trên trang favorite.");
    }

    // Đảm bảo class 'active' đúng cho link 'Bài hát đã thích'
    document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
    const favoriteLink = document.querySelector('.sidebar-nav a[href="favorite.html"]');
    if(favoriteLink) favoriteLink.classList.add('active');


    console.log("Favorite DOMContentLoaded End");
});

console.log("favorite.js loaded"); // Để kiểm tra thứ tự load