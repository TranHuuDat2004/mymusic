// utils.js

// --- Hàm tạo một card bài hát ---
// Hàm này sẽ được gọi từ main.js và search.js
// --- Hàm tạo một card bài hát ---
function createSongCard(songData) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Gán dataset để player.js có thể đọc
    card.dataset.id = songData._id || ''; 
    card.dataset.src = songData.audioSrc || '';
    card.dataset.title = songData.title || 'Không có tiêu đề';
    card.dataset.artist = songData.artistData || songData.displayArtist?.name || songData.artistName || 'N/A';
    card.dataset.art = songData.artUrl || '/img/song-holder.png';

    // Dùng artistName từ dữ liệu API nếu có
    const artistText = songData.displayArtist?.name || songData.artistName || 'Nghệ sĩ không xác định';

    card.innerHTML = `
        <img src="/${songData.artUrl || 'img/song-holder.png'}" alt="${songData.title}" class="album-art" loading="lazy">
        <h3 class="song-title">${songData.title || 'Không có tiêu đề'}</h3>
        <p class="song-artist">${artistText}</p>
        <button class="play-button-overlay">▶</button>
    `;

    // **QUAN TRỌNG:** Xóa bỏ hoàn toàn khối if (typeof window.addCardClickListener)
    // Việc gắn listener sẽ do file gọi hàm này (main.js, library.js...) hoặc script inline đảm nhiệm.

    return card;
}

// Hàm format thời gian (MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
// --- Hàm render các link playlist trong sidebar ---
// sectionsData: Mảng dữ liệu (ví dụ: ALL_MUSIC_SECTIONS)
// targetUlElement: Phần tử <ul> trong sidebar để chèn link vào
// --- Hàm render các link playlist trong sidebar ---
function renderPlaylistLinks(sectionsData, targetUlElement) {
    if (!targetUlElement) return;
    if (!sectionsData || !Array.isArray(sectionsData)) {
        targetUlElement.innerHTML = '<li>Lỗi tải playlist</li>'; return;
    }
    targetUlElement.innerHTML = '';


    const currentPage = window.location.pathname.split("/").pop();
    const urlParams = new URLSearchParams(window.location.search);
    const currentPlaylistId = urlParams.get('id');

    sectionsData.forEach(section => {
        if (section && section.id && section.title) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `playlist?id=${encodeURIComponent(section.id)}`;
            link.textContent = section.title;
            if (currentPage === 'playlist' && currentPlaylistId === section.id) {
                link.classList.add('active-playlist-link');
            }
            listItem.appendChild(link);
            targetUlElement.appendChild(listItem);
        }
    });

}


// --- HÀM TẠO MỘT MỤC BÀI HÁT TRONG DANH SÁCH (DẠNG BẢNG) ---
function createSongListItem(songData, index, artistNameToDisplay) {
    const songItem = document.createElement('div');
    songItem.className = 'song-list-item';
    
    // THÊM data-id VÀO ĐÂY
    songItem.dataset.id = songData._id || '';

    const artistName = artistNameToDisplay || songData.artistName || 'Nghệ sĩ không xác định';

    songItem.innerHTML = `
        <span class="song-index">${index}</span>
        <img src="/${songData.artUrl || 'img/song-holder.png'}" alt="${songData.title || 'Art'}" class="album-art-small">
        <div class="song-details" data-artist="${artistName}">
            <div class="song-title">${songData.title || 'Không có tiêu đề'}</div>
        </div>
        <div class="song-artist-column">${artistName}</div>
        <div class="song-plays">${(songData.plays || 0).toLocaleString('vi-VN')}</div>
        <div class="song-actions">
            <button title="Thích" class="like-song-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
        </div>
    `;

    const likeBtn = songItem.querySelector('.like-song-btn');
    if (likeBtn) {
        // --- SỬA LẠI HOÀN TOÀN ---
        // Chỉ cập nhật trạng thái ban đầu, không gắn listener gọi API ở đây nữa
        if (window.userLikedSongIds && window.userLikedSongIds.has(songData._id)) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('svg').setAttribute('fill', '#1DB954');
        }

        // Gắn listener để gọi sự kiện chung
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Phát ra một sự kiện tùy chỉnh mà player.js có thể lắng nghe
            const likeEvent = new CustomEvent('toggleLike', { detail: { songId: songData._id } });
            document.dispatchEvent(likeEvent);
        });
        // --- KẾT THÚC SỬA LẠI ---
    }
    return songItem;
}

// --- EXPOSE CÁC HÀM RA GLOBAL SCOPE ---
// Đảm bảo bạn đã "expose" các hàm này ra để các file khác có thể dùng
window.createSongCard = createSongCard;
window.formatTime = formatTime;
window.renderPlaylistLinks = renderPlaylistLinks;
window.createSongListItem = createSongListItem; // << THÊM DÒNG NÀY

console.log("utils.js loaded with all utility functions.");