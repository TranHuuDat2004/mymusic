// utils.js

// --- Hàm tạo một card bài hát ---
// Hàm này sẽ được gọi từ main.js và search.js
function createSongCard(songData) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.src = songData.audioSrc || '';
    card.dataset.title = songData.title || 'Không có tiêu đề';
    card.dataset.artist = songData.artistData || songData.displayArtist?.name || 'N/A';
    card.dataset.art = songData.artUrl || 'https://via.placeholder.com/200';

    const img = document.createElement('img');
    img.src = songData.artUrl || 'https://via.placeholder.com/200';
    img.alt = songData.title || 'Album Art';
    img.classList.add('album-art');
    img.loading = 'lazy';

    const titleH3 = document.createElement('h3');
    titleH3.classList.add('song-title');
    titleH3.textContent = songData.title || 'Không có tiêu đề';

    const artistP = document.createElement('p');
    artistP.classList.add('song-artist');
    if (songData.displayArtist && songData.displayArtist.id && songData.displayArtist.name) {
        const artistLink = document.createElement('a');
        artistLink.href = `artist_page.html?artistId=${songData.displayArtist.id}`;
        artistLink.textContent = songData.displayArtist.name;
        // Ngăn link nghệ sĩ tự kích hoạt phát nhạc của card cha
        artistLink.addEventListener('click', (e) => e.stopPropagation());
        artistP.appendChild(artistLink);
    } else if (songData.displayArtist && songData.displayArtist.name) {
        artistP.textContent = songData.displayArtist.name;
    } else {
        artistP.textContent = 'Nghệ sĩ không xác định';
    }

    const playButton = document.createElement('button');
    playButton.classList.add('play-button-overlay');
    playButton.innerHTML = '▶';
    // Ngăn nút play tự kích hoạt sự kiện click của card cha (nếu cần)
    // playButton.addEventListener('click', (e) => e.stopPropagation());

    card.appendChild(img);
    card.appendChild(titleH3);
    card.appendChild(artistP);
    card.appendChild(playButton);

    // **QUAN TRỌNG:** Gắn listener sẽ được thực hiện bởi hàm gọi createSongCard
    // thông qua hàm addCardClickListener được expose từ player.js
    if (typeof window.addCardClickListener === 'function') {
         window.addCardClickListener(card);
    } else {
        console.warn('Hàm window.addCardClickListener không tồn tại khi tạo card.');
    }

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
            link.href = `playlist.html?id=${encodeURIComponent(section.id)}`;
            link.textContent = section.title;
            if (currentPage === 'playlist.html' && currentPlaylistId === section.id) {
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