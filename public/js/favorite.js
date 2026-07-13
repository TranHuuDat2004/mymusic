// public/js/favorite.js

document.addEventListener('DOMContentLoaded', () => {
    const displayContainer = document.getElementById('favorite-songs-display');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token) {
        // Nếu chưa đăng nhập, chuyển về trang login
        window.location.href = '/login';
        return;
    }

    // Hàm gọi API để lấy danh sách bài hát yêu thích
    async function loadFavoriteSongs() {
        try {
            const response = await fetch('/api/songs/favorites', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem('userInfo');
                    window.location.href = '/login';
                }
                throw new Error('Không thể tải danh sách yêu thích.');
            }

            const favoriteSongs = await response.json();
            renderFavoriteSongs(favoriteSongs);

        } catch (error) {
            console.error("Lỗi khi tải bài hát yêu thích:", error);
            displayContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    // Hàm render danh sách ra giao diện
    function renderFavoriteSongs(songs) {
        displayContainer.innerHTML = '';
        displayContainer.className = 'song-list-container';

        if (!songs || songs.length === 0) {
            displayContainer.innerHTML = '<p class="search-initial-message">Bạn chưa thích bài hát nào.</p>';
            return;
        }

        const tableHeader = document.createElement('div');
        // ... code tạo header ...
        displayContainer.appendChild(tableHeader);

        songs.forEach((song, index) => {
            // Bây giờ hàm này đã tồn tại
            if (typeof window.createSongListItem === 'function') {
                const songItem = window.createSongListItem(song, index + 1, song.artistName);

                songItem.addEventListener('click', (event) => {
                    // Ngăn phát nhạc khi click vào nút like
                    if (event.target.closest('.like-song-btn')) return;

                    if (typeof window.playSongFromData !== 'function') return;
                    window.playSongFromData(song, songs);
                });
                displayContainer.appendChild(songItem);
            }
        });
    }
    // Chạy hàm chính
    loadFavoriteSongs();
});