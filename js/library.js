// library.js

document.addEventListener('DOMContentLoaded', async () => { // Thêm async vì initializeLibrary là async
    console.log("Library DOMContentLoaded Start");

    const libraryContainer = document.getElementById('library-content-container');
    const playlistUl = document.getElementById('playlist-links-list'); // Ul trong sidebar

    // Các biến cho nút chuyển đổi view và container hiển thị bài hát
    // Sẽ được gán giá trị trong initializeLibrary sau khi các phần tử được tạo
    let viewToggleGridBtn, viewToggleListBtn, songsDisplayContainer;

    let currentViewMode = 'grid'; // Mặc định là 'grid' (dạng card)
    let allLibrarySongs = []; // Mảng để lưu trữ tất cả bài hát (đã xử lý duration)

    // --- Hàm format thời gian (MM:SS) ---
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return "N/A";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Hàm lấy duration của một file audio (trả về Promise) ---
    function getAudioFileDuration(audioSrc) {
        return new Promise((resolve) => {
            if (!audioSrc) {
                console.warn("getAudioFileDuration: audioSrc không được cung cấp.");
                resolve("0:00");
                return;
            }
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                    resolve(formatTime(audio.duration));
                } else {
                    resolve("N/A");
                }
            });
            audio.addEventListener('error', () => {
                resolve("N/A");
            });
            try {
                audio.src = audioSrc;
            } catch (error) {
                resolve("N/A");
            }
        });
    }

    // --- Hàm tạo một mục bài hát trong danh sách (kiểu bảng) ---
    function createSongListItem(songData, index, artistNameToDisplay) {
        const songItem = document.createElement('div');
        songItem.classList.add('song-list-item');
        songItem.dataset.src = songData.audioSrc || '';
        songItem.dataset.title = songData.title || 'Không có tiêu đề';
        songItem.dataset.artist = artistNameToDisplay || songData.artistData || 'N/A';
        songItem.dataset.art = songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40';

        const durationDisplay = songData.duration || 'N/A';

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
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
        `;

        songItem.addEventListener('click', function(event) {
            if (event.target.closest('button.like-song-btn') || event.target.closest('a')) {
                return;
            }
            if (typeof window.playSongFromData === 'function' && this.dataset.src) {
                window.playSongFromData({
                    src: this.dataset.src,
                    title: this.dataset.title,
                    artist: this.dataset.artist,
                    art: this.dataset.art
                });
            } else {
                console.warn("Không thể phát bài hát từ danh sách. Thiếu playSongFromData() hoặc data-src.");
            }
        });

        const likeBtn = songItem.querySelector('.like-song-btn');
        if (likeBtn) {
            if (songData.isFavorite) {
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            }
            likeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('liked');
                songData.isFavorite = this.classList.contains('liked');
                this.innerHTML = songData.isFavorite ?
                    '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' :
                    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            });
        }
        return songItem;
    }

    // --- Hàm render nội dung dựa trên chế độ xem ---
    function renderLibraryContent(viewMode) {
        if (!songsDisplayContainer) {
            console.error("Container hiển thị bài hát (#library-songs-display) không tồn tại.");
            return;
        }
        songsDisplayContainer.innerHTML = ''; // Xóa nội dung cũ

        if (allLibrarySongs.length > 0) {
            if (viewMode === 'grid') {
                songsDisplayContainer.className = 'card-grid';
                allLibrarySongs.forEach(song => {
                    if (typeof window.createSongCard === 'function') {
                        const card = window.createSongCard(song); // Gọi từ utils.js
                        songsDisplayContainer.appendChild(card);
                    } else {
                        console.error("Hàm window.createSongCard không tồn tại.");
                    }
                });
            } else if (viewMode === 'list') {
                songsDisplayContainer.className = 'song-list-container';
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
                songsDisplayContainer.appendChild(tableHeader);

                allLibrarySongs.forEach((song, index) => {
                    const songItem = createSongListItem(song, index + 1, song.artistNameToDisplay); // Gọi hàm cục bộ
                    songsDisplayContainer.appendChild(songItem);
                });
            }
        } else {
            songsDisplayContainer.innerHTML = '<p class="search-initial-message">Thư viện của bạn trống.</p>';
        }
    }

    // --- Hàm khởi tạo thư viện (ASYNC) ---
    async function initializeLibrary() {
        if (typeof ALL_MUSIC_SECTIONS === 'undefined' || !libraryContainer) {
            console.error("Lỗi tải dữ liệu hoặc container thư viện chính.");
            if (libraryContainer) libraryContainer.innerHTML = '<h1>Thư viện</h1><p>Lỗi tải dữ liệu thư viện.</p>';
            return;
        }

        libraryContainer.innerHTML = ''; // Xóa nội dung "Đang tải..."

        // Tạo header với tiêu đề và nút chuyển đổi view
        const libraryHeaderDiv = document.createElement('div');
        libraryHeaderDiv.classList.add('library-header');
        const libraryTitle = document.createElement('h1');
        libraryTitle.textContent = 'Toàn bộ Thư viện';
        libraryHeaderDiv.appendChild(libraryTitle);
        const viewToggleButtonsDiv = document.createElement('div');
        viewToggleButtonsDiv.classList.add('view-toggle-buttons');
        viewToggleButtonsDiv.innerHTML = `
            <button id="view-toggle-grid" class="view-toggle-btn active" title="Xem dạng lưới (Card)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
            </button>
            <button id="view-toggle-list" class="view-toggle-btn" title="Xem dạng danh sách">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V7H3v2z"/></svg>
            </button>
        `;
        libraryHeaderDiv.appendChild(viewToggleButtonsDiv);
        libraryContainer.appendChild(libraryHeaderDiv);

        songsDisplayContainer = document.createElement('div');
        songsDisplayContainer.id = 'library-songs-display';
        songsDisplayContainer.classList.add(currentViewMode === 'grid' ? 'card-grid' : 'song-list-container');
        libraryContainer.appendChild(songsDisplayContainer);

        viewToggleGridBtn = document.getElementById('view-toggle-grid');
        viewToggleListBtn = document.getElementById('view-toggle-list');

        // Gom tất cả bài hát
        let tempAllSongs = [];
        ALL_MUSIC_SECTIONS.forEach(section => {
            if (Array.isArray(section.songs)) {
                section.songs.forEach(song => {
                    const uniqueId = song.id || `${song.title}-${song.artistData}`;
                    if (!tempAllSongs.some(s => (s.id || `${s.title}-${s.artistData}`) === uniqueId)) {
                        song.artistNameToDisplay = song.displayArtist?.name || song.artistData || 'N/A';
                        tempAllSongs.push(JSON.parse(JSON.stringify(song)));
                    }
                });
            }
        });

        // Lấy duration cho tất cả bài hát
        if (typeof getAudioFileDuration === 'function') { // Gọi trực tiếp
            console.log(`Đang lấy thời lượng cho ${tempAllSongs.length} bài hát...`);
            const durationPromises = tempAllSongs.map(song =>
                getAudioFileDuration(song.audioSrc).then(duration => {
                    song.duration = duration;
                }).catch(err => { // Nên bắt lỗi ở đây để Promise.all không bị dừng sớm
                    console.warn(`Không thể lấy duration cho ${song.title || song.audioSrc}:`, err);
                    song.duration = "N/A"; // Gán giá trị mặc định nếu lỗi
                })
            );
            try {
                await Promise.all(durationPromises);
                console.log("Đã lấy xong thời lượng.");
            } catch (error) {
                console.error("Lỗi trong quá trình chờ lấy tất cả durations:", error);
            }
        } else {
            console.warn("Hàm getAudioFileDuration không tồn tại, không thể lấy thời lượng.");
        }

        allLibrarySongs = tempAllSongs;

        // Render lần đầu với view mặc định
        renderLibraryContent(currentViewMode);

        // Xử lý sự kiện cho nút chuyển đổi view
        if (viewToggleGridBtn && viewToggleListBtn) {
            viewToggleGridBtn.addEventListener('click', () => {
                if (currentViewMode !== 'grid') {
                    currentViewMode = 'grid';
                    renderLibraryContent(currentViewMode);
                    viewToggleGridBtn.classList.add('active');
                    viewToggleListBtn.classList.remove('active');
                }
            });

            viewToggleListBtn.addEventListener('click', () => {
                if (currentViewMode !== 'list') {
                    currentViewMode = 'list';
                    renderLibraryContent(currentViewMode);
                    viewToggleListBtn.classList.add('active');
                    viewToggleGridBtn.classList.remove('active');
                }
            });
        }
    }

    // Render playlist links trong sidebar
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUl && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUl);
    }

    // Active link thư viện
    document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
    const libraryLink = document.querySelector('.sidebar-nav a[href="library.html"]');
    if(libraryLink) libraryLink.classList.add('active');

    // Khởi tạo thư viện
    initializeLibrary().catch(err => {
        console.error("Lỗi nghiêm trọng trong quá trình khởi tạo thư viện:", err);
        if (libraryContainer) libraryContainer.innerHTML = '<h1>Thư viện</h1><p>Đã xảy ra lỗi khi tải thư viện. Vui lòng thử lại.</p>';
    });

    console.log("Library DOMContentLoaded End");
});

console.log("library.js loaded");