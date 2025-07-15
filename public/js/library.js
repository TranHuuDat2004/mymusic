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

    // Trong js/library.js

    // --- Hàm tạo một mục bài hát trong danh sách (kiểu bảng) (PHIÊN BẢN MỚI) ---
    function createSongListItem(songData, index) {
        const songItem = document.createElement('div');
        songItem.classList.add('song-list-item');
        // Vẫn lưu dataset để dự phòng hoặc cho các mục đích khác
        songItem.dataset.src = songData.audioSrc || '';
        songItem.dataset.title = songData.title || 'Không có tiêu đề';
        songItem.dataset.artist = songData.artistNameToDisplay || songData.artistData || 'N/A';
        songItem.dataset.art = songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40';

        const durationDisplay = songData.duration || 'N/A';
        const artistNameToDisplay = songData.artistNameToDisplay || 'Nghệ sĩ không xác định';

        songItem.innerHTML = `
        <span class="song-index">${index}</span>
        <img src="${songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40'}" alt="${songData.title || 'Art'}" class="album-art-small">
        <div class="song-details">
            <div class="song-title">${songData.title || 'Không có tiêu đề'}</div>
        </div>
        <div class="song-artist-column">${artistNameToDisplay}</div>
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

        // **QUAN TRỌNG: Xóa bỏ addEventListener('click') khỏi đây.**
        // Việc gắn listener sẽ được thực hiện ở hàm renderLibraryContent.

        const likeBtn = songItem.querySelector('.like-song-btn');
        if (likeBtn) {
            if (songData.isFavorite) {
                likeBtn.classList.add('liked');
                likeBtn.querySelector('svg').setAttribute('fill', '#1DB954');
            }
            likeBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // Ngăn sự kiện click lan ra songItem
                this.classList.toggle('liked');
                songData.isFavorite = this.classList.contains('liked');
                this.querySelector('svg').setAttribute('fill', songData.isFavorite ? '#1DB954' : 'currentColor');
            });
        }
        return songItem;
    }

    // --- Hàm render nội dung dựa trên chế độ xem (PHIÊN BẢN MỚI, ĐỒNG BỘ LOGIC) ---
    function renderLibraryContent(viewMode) {
        if (!songsDisplayContainer) {
            console.error("Container hiển thị bài hát (#library-songs-display) không tồn tại.");
            return;
        }
        songsDisplayContainer.innerHTML = ''; // Xóa nội dung cũ

        if (allLibrarySongs.length === 0) {
            songsDisplayContainer.innerHTML = '<p class="search-initial-message">Thư viện của bạn trống.</p>';
            return;
        }

        if (viewMode === 'grid') {
            songsDisplayContainer.className = 'card-grid';
            allLibrarySongs.forEach(song => {
                const card = createSongCard(song);
                // Gắn listener sau khi tạo card
                if (typeof window.addCardClickListener === 'function') {
                    window.addCardClickListener(card);
                }
                songsDisplayContainer.appendChild(card);
            });
        } else if (viewMode === 'list') {
            songsDisplayContainer.className = 'song-list-container';
            // Tạo header cho bảng
            const tableHeader = document.createElement('div');
            tableHeader.classList.add('song-list-header', 'song-list-item');
            tableHeader.innerHTML = `
            <span class="song-index">#</span>
            <span class="song-art-placeholder"></span>
            <div class="song-details"><div class="song-title">TIÊU ĐỀ</div></div>
            <div class="song-artist-column">NGHỆ SĨ</div>
            <div class="song-plays">LƯỢT NGHE</div>
            <div class="song-duration">THỜI LƯỢNG</div>
            <div class="song-actions-placeholder"></div>
        `;
            songsDisplayContainer.appendChild(tableHeader);

            // Tạo từng dòng bài hát
            allLibrarySongs.forEach((song, index) => {
                const songItem = createSongListItem(song, index + 1);

                // Gắn listener click để phát nhạc cho cả dòng
                songItem.addEventListener('click', (event) => {
                    // Không phát nhạc nếu click vào nút like
                    if (event.target.closest('button.like-song-btn')) {
                        return;
                    }
                    // Luôn gọi với đối tượng `song` đầy đủ từ mảng
                    window.playSongFromData(song);
                });

                songsDisplayContainer.appendChild(songItem);
            });
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
    if (libraryLink) libraryLink.classList.add('active');

    // Khởi tạo thư viện
    initializeLibrary().catch(err => {
        console.error("Lỗi nghiêm trọng trong quá trình khởi tạo thư viện:", err);
        if (libraryContainer) libraryContainer.innerHTML = '<h1>Thư viện</h1><p>Đã xảy ra lỗi khi tải thư viện. Vui lòng thử lại.</p>';
    });

        // GỌI HÀM CHÈN FOOTER SAU KHI MỌI THỨ ĐÃ XONG
    if (typeof window.appendMainFooter === 'function') {
        window.appendMainFooter();
    }

    console.log("Library DOMContentLoaded End");
});

console.log("library.js loaded");