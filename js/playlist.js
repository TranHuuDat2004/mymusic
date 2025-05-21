// utils.js
console.log("utils.js loading...");

// --- Hàm format thời gian (MM:SS) ---
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Hàm lấy duration của một file audio (trả về Promise) ---
function getAudioFileDuration(audioSrc) {
    return new Promise((resolve) => {
        if (!audioSrc) {
            // console.warn("getAudioFileDuration: audioSrc không được cung cấp.");
            resolve("0:00"); // Trả về giá trị mặc định nếu không có src
            return;
        }
        const audio = new Audio();
        audio.preload = "metadata"; // Chỉ tải metadata

        audio.onloadedmetadata = () => {
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                // console.log(`Duration for ${audioSrc}: ${audio.duration}`);
                resolve(formatTime(audio.duration)); // Sử dụng formatTime cục bộ
            } else {
                // console.warn(`getAudioFileDuration: Duration không hợp lệ cho ${audioSrc}. Giá trị: ${audio.duration}`);
                resolve("N/A");
            }
            // Giải phóng tài nguyên sau khi lấy metadata
            audio.src = ""; // Xóa src để dừng tải thêm
            audio.load();   // Yêu cầu trình duyệt hủy bỏ tải
        };
        audio.onerror = (e) => {
            // console.warn(`getAudioFileDuration: Lỗi khi tải metadata cho ${audioSrc}:`, e);
            resolve("N/A");
        };
        try {
            audio.src = audioSrc;
        } catch (error) {
            console.error(`getAudioFileDuration: Lỗi khi gán src cho audio ${audioSrc}:`, error);
            resolve("N/A");
        }
    });
}

// --- Hàm tạo một card bài hát (cho view dạng lưới/card) ---
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
        artistLink.href = `artist_page.html?artistId=${encodeURIComponent(songData.displayArtist.id)}`;
        artistLink.textContent = songData.displayArtist.name;
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

    card.appendChild(img);
    card.appendChild(titleH3);
    card.appendChild(artistP);
    card.appendChild(playButton);

    return card; // Listener click sẽ được gắn bởi hàm gọi nó
}

// --- Hàm tạo một mục bài hát trong danh sách (kiểu bảng) ---
function createSongListItem(songData, index, artistNameToDisplay) {
    const songItem = document.createElement('div');
    songItem.classList.add('song-list-item');
    songItem.dataset.src = songData.audioSrc || '';
    songItem.dataset.title = songData.title || 'Không có tiêu đề';
    songItem.dataset.artist = artistNameToDisplay || songData.artistData || 'N/A';
    songItem.dataset.art = songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40';

    const durationDisplay = songData.duration || 'N/A'; // Duration đã được tính toán và truyền vào

    songItem.innerHTML = `
        <span class="song-index">${index}</span>
        <img src="${songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40'}" alt="${songData.title || 'Art'}" class="album-art-small">
        <div class="song-details">
            <div class="song-title">${songData.title || 'Không có tiêu đề'}</div>
            
        </div>
        <div class="song-artist-column">${artistNameToDisplay || 'Nghệ sĩ không xác định'}</div>
        <div class="song-plays">${songData.plays || 'N/A'}</div>
        <div class="song-duration">${durationDisplay}</div>
        <div class="song-actions">
            <button title="Thích" class="like-song-btn" data-song-id="${songData.id || ''}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
        </div>
    `;

    // Listener click cho toàn bộ item sẽ được gắn bởi hàm gọi createSongListItem,
    // vì nó cần context của `playlistArray` (ví dụ: `songsToDisplay`).

    // Xử lý nút like
    const likeBtn = songItem.querySelector('.like-song-btn');
    if (likeBtn) {
        if (songData.isFavorite) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        }
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện click của item cha
            this.classList.toggle('liked');
            songData.isFavorite = this.classList.contains('liked'); // Cập nhật trong phiên
            this.innerHTML = songData.isFavorite ?
                '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' :
                '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        });
    }
    return songItem;
}

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

// Expose các hàm ra global để các file khác có thể sử dụng
window.formatTime = formatTime;
window.getAudioFileDuration = getAudioFileDuration;
window.createSongCard = createSongCard;
window.createSongListItem = createSongListItem;
window.renderPlaylistLinks = renderPlaylistLinks;

console.log("utils.js loaded successfully.");

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Playlist DOMContentLoaded Start");

    const playlistDetailContainer = document.getElementById('playlist-detail-container');
    const playlistUlSidebar = document.getElementById('playlist-links-list');

    function getPlaylistIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }
    const playlistId = getPlaylistIdFromUrl();

    if (typeof ALL_MUSIC_SECTIONS === 'undefined' || !playlistDetailContainer || !playlistId) {
        console.error("Playlist.js: Dữ liệu nhạc, container hoặc ID playlist không hợp lệ.");
        if (playlistDetailContainer) playlistDetailContainer.innerHTML = '<h1>Lỗi</h1><p>Không thể tải thông tin playlist.</p>';
        if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUlSidebar && typeof window.renderPlaylistLinks === 'function') {
            window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUlSidebar);
        }
        return;
    }

    const targetSection = ALL_MUSIC_SECTIONS.find(section => section.id === playlistId);

    if (targetSection) {
        playlistDetailContainer.innerHTML = ''; // Xóa "Đang tải..."
        document.title = `${targetSection.title} - My Music Player`;

        // Tạo Header Playlist
        const playlistHeaderDiv = document.createElement('div');
        playlistHeaderDiv.classList.add('playlist-header-details');
        const playlistCoverArtDiv = document.createElement('div');
        playlistCoverArtDiv.classList.add('playlist-cover-art');
        const coverImg = document.createElement('img');
        coverImg.src = targetSection.songs && targetSection.songs.length > 0 ?
                       (targetSection.songs[0].artUrl || 'https://via.placeholder.com/180?text=Playlist') :
                       'https://via.placeholder.com/180?text=Playlist';
        coverImg.alt = targetSection.title;
        playlistCoverArtDiv.appendChild(coverImg);
        playlistHeaderDiv.appendChild(playlistCoverArtDiv);
        const playlistInfoDiv = document.createElement('div');
        playlistInfoDiv.classList.add('playlist-info');
        playlistInfoDiv.innerHTML = `
            <span class="playlist-type">Playlist</span>
            <h1 class="playlist-main-title">${targetSection.title}</h1>
            <p class="playlist-description">${targetSection.description || ''}</p>
            <div class="playlist-stats">
                ${targetSection.songs ? targetSection.songs.length : 0} bài hát
            </div>
        `;
        playlistHeaderDiv.appendChild(playlistInfoDiv);
        playlistDetailContainer.appendChild(playlistHeaderDiv);

        // Tạo Container cho Danh sách Bài hát
        const songListContainer = document.createElement('div');
        songListContainer.id = `playlist-${playlistId}-songs`;
        songListContainer.classList.add('song-list-container');

        // Tạo Header Bảng
        const tableHeader = document.createElement('div');
        tableHeader.classList.add('song-list-header', 'song-list-item');
        tableHeader.innerHTML = `
            <span class="song-index">#</span>
            <span class="song-art-placeholder"></span>
            <div class="song-details"><div class="song-title">TIÊU ĐỀ</div></div>
            <div style="padding-left:40px" class="song-artist-column">NGHỆ SĨ</div>
            <div class="song-plays">LƯỢT NGHE</div>
            <div class="song-duration">THỜI LƯỢNG</div>
            <div class="song-actions-placeholder"></div>
        `;
        songListContainer.appendChild(tableHeader);

        if (targetSection.songs && targetSection.songs.length > 0) {
            let songsToDisplay = JSON.parse(JSON.stringify(targetSection.songs));

            if (typeof window.getAudioFileDuration === 'function') {
                console.log(`Playlist: Bắt đầu lấy thời lượng cho ${songsToDisplay.length} bài hát trong '${targetSection.title}'...`);
                const durationPromises = songsToDisplay.map(song =>
                    window.getAudioFileDuration(song.audioSrc)
                        .then(duration => {
                            song.duration = duration;
                        })
                        .catch(err => {
                            song.duration = "N/A";
                        })
                );
                try {
                    await Promise.all(durationPromises);
                    console.log("Playlist: Đã lấy xong tất cả thời lượng.");
                } catch (error) {
                    console.error("Playlist: Lỗi trong Promise.all khi chờ lấy durations:", error);
                }
            } else {
                console.warn("Playlist: Hàm window.getAudioFileDuration không tồn tại.");
                songsToDisplay.forEach(song => song.duration = "N/A");
            }

            songsToDisplay.forEach((songData, index) => {
                if (typeof window.createSongListItem === 'function') {
                    const songItem = window.createSongListItem(
                        songData,
                        index + 1,
                        songData.displayArtist?.name || songData.artistData
                    );
                    songItem.addEventListener('click', function(event) {
                        if (event.target.closest('button.like-song-btn') || event.target.closest('a')) return;
                        if (typeof window.playSongFromData === 'function' && songData.audioSrc) {
                            const songToPlayForPlayer = {
                                src: songData.audioSrc,
                                title: songData.title,
                                artist: songData.displayArtist?.name || songData.artistData,
                                art: songData.artUrl || songData.albumArt,
                            };
                            window.playSongFromData(songToPlayForPlayer, songsToDisplay);
                        } else {
                            console.warn("Playlist: Không thể phát bài hát.");
                        }
                    });
                    songListContainer.appendChild(songItem);
                } else {
                    console.error("Playlist: Hàm window.createSongListItem không tồn tại.");
                }
            });
        } else {
            songListContainer.innerHTML = '<p>Playlist này chưa có bài hát nào.</p>';
        }
        playlistDetailContainer.appendChild(songListContainer);

    } else {
        playlistDetailContainer.innerHTML = '<h1>Không tìm thấy playlist</h1><p>Playlist bạn yêu cầu không tồn tại hoặc đã bị xóa.</p>';
        document.title = "Không tìm thấy playlist - My Music Player";
    }

    // Render playlist links trong sidebar
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUlSidebar && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUlSidebar);
    }

    // Xóa active khỏi nav chính, active link playlist hiện tại đã xử lý trong renderPlaylistLinks
    document.querySelectorAll('.sidebar-nav > ul > li > a').forEach(link => {
        if (!link.closest('.sidebar-playlists')) { // Không tác động đến link trong sidebar-playlists
            link.classList.remove('active');
        }
    });

    console.log("Playlist DOMContentLoaded End");
});

console.log("playlist.js loaded successfully.");