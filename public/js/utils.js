// utils.js

// --- Hàm tạo một card bài hát ---
// Hàm này sẽ được gọi từ main.js và search.js
// --- Hàm tạo một card bài hát ---
function createSongCard(songData) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    // Gán dataset để player.js có thể đọc
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

// Expose hàm renderPlaylistLinks ra global
window.renderPlaylistLinks = renderPlaylistLinks;



console.log("utils.js loaded with playlist functions");