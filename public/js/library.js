// public/js/library.js (Phiên bản gọi API)

document.addEventListener('DOMContentLoaded', () => {
    const libraryContainer = document.getElementById('library-content-container');
    const songsDisplayContainer = document.getElementById('library-songs-display');

    if (!libraryContainer || !songsDisplayContainer) {
        console.error("Library.js: Không tìm thấy các container cần thiết.");
        return;
    }

    let currentViewMode = 'grid';
    let allLibrarySongs = [];

    // --- Hàm render nội dung dựa trên chế độ xem ---
    function renderLibraryContent(songs) {
        songsDisplayContainer.innerHTML = ''; // Xóa nội dung cũ (ví dụ: "Đang tải...")

        if (!songs || songs.length === 0) {
            songsDisplayContainer.innerHTML = '<p class="search-initial-message">Thư viện của bạn trống.</p>';
            return;
        }

        if (currentViewMode === 'grid') {
            songsDisplayContainer.className = 'card-grid';
            songs.forEach(song => {
                // Dùng hàm createSongCard từ utils.js
                if (typeof window.createSongCard !== 'function') return;
                const card = window.createSongCard(song);
                card.addEventListener('click', () => {
                    if (typeof window.playSongFromData !== 'function') return;
                    // Khi click, context là toàn bộ thư viện
                    window.playSongFromData(song, songs);
                });
                songsDisplayContainer.appendChild(card);
            });
        } else if (currentViewMode === 'list') {
            songsDisplayContainer.className = 'song-list-container';

            // Header cho bảng
            const tableHeader = document.createElement('div');
            tableHeader.className = 'song-list-header song-list-item';
            tableHeader.innerHTML = `
                <span class="song-index">#</span>
                <div class="song-details"><div class="song-title">TIÊU ĐỀ</div></div>
                <div class="song-artist-column">NGHỆ SĨ</div>
                <div class="song-plays">LƯỢT NGHE</div>
            `;
            songsDisplayContainer.appendChild(tableHeader);

            // Các dòng bài hát
            songs.forEach((song, index) => {
                // Dùng hàm createSongListItem từ utils.js
                if (typeof window.createSongListItem !== 'function') return;
                const songItem = window.createSongListItem(song, index + 1, song.artistName);
                songItem.addEventListener('click', (event) => {
                    if (event.target.closest('.like-song-btn')) return;
                    if (typeof window.playSongFromData !== 'function') return;
                    window.playSongFromData(song, songs);
                });
                songsDisplayContainer.appendChild(songItem);
            });
        }
    }

    // --- Hàm khởi tạo header và các nút điều khiển ---
    function initializeControls() {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'library-header';
        headerDiv.innerHTML = `
            <h1>Toàn bộ Thư viện</h1>
            <div class="view-toggle-buttons">
                <button id="view-toggle-grid" class="view-toggle-btn active" title="Xem dạng lưới (Card)">
                    <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
                </button>
                <button id="view-toggle-list" class="view-toggle-btn" title="Xem dạng danh sách">
                    <svg viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4z"/></svg>
                </button>
            </div>
        `;
        // Chèn header vào đầu của main content
        libraryContainer.prepend(headerDiv);

        // Gắn sự kiện cho các nút chuyển đổi view
        const gridBtn = document.getElementById('view-toggle-grid');
        const listBtn = document.getElementById('view-toggle-list');

        gridBtn.addEventListener('click', () => {
            if (currentViewMode !== 'grid') {
                currentViewMode = 'grid';
                gridBtn.classList.add('active');
                listBtn.classList.remove('active');
                renderLibraryContent(allLibrarySongs);
            }
        });

        listBtn.addEventListener('click', () => {
            if (currentViewMode !== 'list') {
                currentViewMode = 'list';
                listBtn.classList.add('active');
                gridBtn.classList.remove('active');
                renderLibraryContent(allLibrarySongs);
            }
        });
    }

    // --- Hàm chính: Tải dữ liệu và khởi chạy trang ---
    async function loadLibrary() {
        try {
            const response = await fetch('/api/songs');
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu thư viện từ server.');
            }
            allLibrarySongs = await response.json();

            // Sắp xếp bài hát theo tiêu đề A-Z
            allLibrarySongs.sort((a, b) => a.title.localeCompare(b.title));

            // Dữ liệu đã có, giờ render nội dung
            renderLibraryContent(allLibrarySongs);

        } catch (error) {
            console.error("Lỗi khi tải thư viện:", error);
            songsDisplayContainer.innerHTML = `<p class="error-message">Đã xảy ra lỗi khi tải thư viện. Vui lòng thử lại.</p>`;
        }
    }

    // Khởi chạy mọi thứ
    initializeControls();
    loadLibrary();

    // --- Hàm render nội dung dựa trên chế độ xem ---
    function renderLibraryContent(songs) {
        songsDisplayContainer.innerHTML = '';

        if (!songs || songs.length === 0) {
            songsDisplayContainer.innerHTML = '<p class="search-initial-message">Thư viện của bạn trống.</p>';
            return;
        }

        if (currentViewMode === 'grid') {
            songsDisplayContainer.className = 'card-grid';
            songs.forEach(song => {
                if (typeof window.createSongCard !== 'function') return;
                const card = window.createSongCard(song);
                card.addEventListener('click', () => {
                    if (typeof window.playSongFromData !== 'function') return;
                    window.playSongFromData(song, songs);
                });
                songsDisplayContainer.appendChild(card);
            });
        } else if (currentViewMode === 'list') {
            // --- BẮT ĐẦU CẬP NHẬT ---
            songsDisplayContainer.className = 'song-list-container';

            // Header cho bảng
            const tableHeader = document.createElement('div');
            tableHeader.className = 'song-list-header song-list-item';
            // Các cột: #, Ảnh, Tiêu đề, Nghệ sĩ, Lượt nghe
            tableHeader.innerHTML = `
            <span class="song-index">#</span>
            <div class="song-art-placeholder"></div>
            <div class="song-details">TIÊU ĐỀ</div>
            <div class="song-artist-column">NGHỆ SĨ</div>
            <div class="song-plays">LƯỢT NGHE</div>
        `;
            songsDisplayContainer.appendChild(tableHeader);

            // Các dòng bài hát
            songs.forEach((song, index) => {
                const songItem = document.createElement('div');
                songItem.className = 'song-list-item';

                // Thêm data-artist vào song-details để dùng cho responsive
                const artistName = song.artistName || 'Nghệ sĩ không xác định';

                songItem.innerHTML = `
                <span class="song-index">${index + 1}</span>
                <img src="/${song.artUrl || 'img/song-holder.png'}" alt="${song.title}" class="album-art-small">
                <div class="song-details" data-artist="${artistName}">
                    <div class="song-title">${song.title}</div>
                </div>
                <div class="song-artist-column">${artistName}</div>
                <div class="song-plays">${(song.plays || 0).toLocaleString('vi-VN')}</div>
            `;

                songItem.addEventListener('click', (event) => {
                    if (typeof window.playSongFromData !== 'function') return;
                    window.playSongFromData(song, songs);
                });
                songsDisplayContainer.appendChild(songItem);
            });
            // --- KẾT THÚC CẬP NHẬT ---
        }
    }

    // --- THÊM LẠI HÀM NÀY ---
    // --- Hàm khởi tạo header và các nút điều khiển ---
    function initializeControls() {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'library-header';
        headerDiv.innerHTML = `
        <h1>Toàn bộ Thư viện</h1>
        <div class="view-toggle-buttons">
            <button id="view-toggle-grid" class="view-toggle-btn active" title="Xem dạng lưới (Card)">
                <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
            </button>
            <button id="view-toggle-list" class="view-toggle-btn" title="Xem dạng danh sách">
                <svg viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4z"/></svg>
            </button>
        </div>
    `;
        // Chèn header vào đầu của main content container
        libraryContainer.prepend(headerDiv);

        // Lấy các nút vừa tạo
        const gridBtn = document.getElementById('view-toggle-grid');
        const listBtn = document.getElementById('view-toggle-list');

        // Gắn sự kiện cho nút xem dạng LƯỚI (GRID)
        gridBtn.addEventListener('click', () => {
            if (currentViewMode !== 'grid') {
                currentViewMode = 'grid';
                gridBtn.classList.add('active');
                listBtn.classList.remove('active');
                // Gọi lại hàm render với chế độ xem mới
                renderLibraryContent(allLibrarySongs);
            }
        });

        // Gắn sự kiện cho nút xem dạng DANH SÁCH (LIST)
        listBtn.addEventListener('click', () => {
            if (currentViewMode !== 'list') {
                currentViewMode = 'list';
                listBtn.classList.add('active');
                gridBtn.classList.remove('active');
                // Gọi lại hàm render với chế độ xem mới
                renderLibraryContent(allLibrarySongs);
            }
        });
    }
    // --- KẾT THÚC PHẦN THÊM LẠI ---
});