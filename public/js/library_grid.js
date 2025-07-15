// library.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Library DOMContentLoaded Start");

    const libraryContainer = document.getElementById('library-content-container');
    const playlistUl = document.getElementById('playlist-links-list');

    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && libraryContainer) {
        libraryContainer.innerHTML = ''; // Xóa nội dung cũ

        const libraryTitle = document.createElement('h1');
        libraryTitle.textContent = 'Toàn bộ Thư viện'; // Hoặc "Tất cả bài hát"
        libraryContainer.appendChild(libraryTitle);

        // Tạo container cho danh sách bài hát kiểu bảng
        const songListContainer = document.createElement('div');
        songListContainer.id = "library-song-list-container";
        songListContainer.classList.add('song-list-container'); // Tái sử dụng class từ artist_page CSS

        const allSongs = [];
        ALL_MUSIC_SECTIONS.forEach(section => {
            if (Array.isArray(section.songs)) {
                section.songs.forEach(song => {
                    const uniqueId = song.id || `${song.title}-${song.artistData}`;
                    if (!allSongs.some(s => (s.id || `${s.title}-${s.artistData}`) === uniqueId)) {
                        // Thêm thông tin nghệ sĩ gốc vào đối tượng song để hiển thị
                        // Giả sử song.displayArtist.name là tên nghệ sĩ chính
                        song.artistNameToDisplay = song.displayArtist?.name || song.artistData || 'N/A';
                        allSongs.push(song);
                    }
                });
            }
        });

        if (allSongs.length > 0) {
            // Tùy chọn: Sắp xếp
            // allSongs.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

            // Tạo header cho bảng (tùy chọn, nếu muốn có tiêu đề cột)
            
            const tableHeader = document.createElement('div');
            tableHeader.classList.add('song-list-header', 'song-list-item'); // Tái sử dụng class item
            tableHeader.innerHTML = `
                <span class="song-index">#</span>
                <span class="song-art-placeholder"></span> <!-- Placeholder cho ảnh -->
                <div class="song-details">
                    <div class="song-title">TIÊU ĐỀ</div>
                </div>
                <div class="song-artist-header">NGHỆ SĨ</div> <!-- Thêm cột nghệ sĩ -->
                <div class="song-plays">LƯỢT NGHE</div>
                <div class="song-duration">THỜI LƯỢNG</div>
                <div class="song-actions-placeholder"></div> <!-- Placeholder cho nút like -->
            `;
            songListContainer.appendChild(tableHeader);
            


            allSongs.forEach((song, index) => {
                // Gọi hàm tạo một hàng bài hát (sẽ định nghĩa ở utils.js)
                if (typeof window.createSongListItem === 'function') {
                    const songItemElement = window.createSongListItem(song, index + 1, song.artistNameToDisplay);
                    songListContainer.appendChild(songItemElement);
                } else {
                    console.error("Hàm createSongListItem không tồn tại.");
                }
            });
        } else {
            const noSongsMessage = document.createElement('p');
            noSongsMessage.textContent = 'Thư viện của bạn trống.';
            noSongsMessage.style.textAlign = 'center';
            noSongsMessage.style.padding = '40px 20px';
            songListContainer.appendChild(noSongsMessage);
        }
        libraryContainer.appendChild(songListContainer);

    } else {
        console.error("Lỗi tải dữ liệu thư viện.");
        if(libraryContainer) libraryContainer.innerHTML = '<h1>Thư viện</h1><p>Lỗi tải dữ liệu thư viện.</p>';
    }

    // Render playlist links trong sidebar
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUl && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUl);
    }

    // Active link thư viện
    document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
    const libraryLink = document.querySelector('.sidebar-nav a[href="library.html"]');
    if(libraryLink) libraryLink.classList.add('active');

    console.log("Library DOMContentLoaded End");
});
// --- Hàm tạo một mục bài hát trong danh sách (kiểu bảng) ---
// songData: object chứa thông tin bài hát
// index: số thứ tự bài hát
// artistNameToDisplay: Tên nghệ sĩ để hiển thị (có thể lấy từ songData.displayArtist.name)
function createSongListItem(songData, index, artistNameToDisplay) {
    const songItem = document.createElement('div');
    songItem.classList.add('song-list-item');
    // Gán data attributes để phát nhạc
    songItem.dataset.src = songData.audioSrc || '';
    songItem.dataset.title = songData.title || 'Không có tiêu đề';
    // data-artist nên là tên nghệ sĩ chính của bài hát đó, có thể là artistNameToDisplay
    songItem.dataset.artist = artistNameToDisplay || songData.artistData || 'N/A';
    songItem.dataset.art = songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40'; // Ưu tiên albumArt nếu có

    // Cập nhật duration từ audio file nếu chưa có (logic này nên nằm ở bước xử lý dữ liệu ban đầu)
    // Nếu songData.duration đã được tính toán trước (ví dụ từ getAudioFileDuration), thì dùng nó
    const durationDisplay = songData.duration || 'N/A'; // Giả sử duration đã có

    songItem.innerHTML = `
        <span class="song-index">${index}</span>
        <img src="${songData.albumArt || songData.artUrl || 'https://via.placeholder.com/40'}" alt="${songData.title || 'Art'}" class="album-art-small">
        <div class="song-details">
            <div class="song-title">${songData.title || 'Không có tiêu đề'}</div>
            <!-- Hiển thị nghệ sĩ của bài hát ở đây -->
            <div class="song-artist-name-in-list">${artistNameToDisplay || 'Nghệ sĩ không xác định'}</div>
        </div>
        <div class="song-album-placeholder"></div> <!-- Placeholder nếu muốn thêm cột Album sau này -->
        <div class="song-plays">${songData.plays || 'N/A'}</div> <!-- Lượt nghe nếu có -->
        <div class="song-duration">${durationDisplay}</div>
        <div class="song-actions">
            <button title="Thích" class="like-song-btn" data-song-id="${songData.id || ''}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
            <!-- <button title="Thêm vào playlist">⊕</button> -->
        </div>
    `;

    // Gắn listener để phát nhạc khi click vào item (không phải vào nút like hay link nghệ sĩ)
    songItem.addEventListener('click', function(event) {
        // Chỉ phát nhạc nếu click trực tiếp vào item, không phải các nút con bên trong
        if (event.target.closest('button.like-song-btn') || event.target.closest('a')) {
            return; // Không làm gì nếu click vào nút like hoặc link
        }

        if (typeof window.playSongFromData === 'function' && this.dataset.src) {
            window.playSongFromData({
                src: this.dataset.src,
                title: this.dataset.title,
                artist: this.dataset.artist, // Nghệ sĩ cho player bar
                art: this.dataset.art
            });
        } else {
            console.warn("Không thể phát bài hát từ danh sách.");
        }
    });

    // Xử lý nút like (ví dụ, bạn có thể mở rộng sau)
    const likeBtn = songItem.querySelector('.like-song-btn');
    if (likeBtn) {
        // Kiểm tra trạng thái yêu thích ban đầu (nếu có)
        if (songData.isFavorite) {
            likeBtn.classList.add('liked'); // Thêm class 'liked' nếu đã thích
            likeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        }

        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện click của item cha
            this.classList.toggle('liked');
            // Cập nhật trạng thái isFavorite trong dữ liệu (tạm thời, vì là web tĩnh)
            // Và cập nhật icon
            if (this.classList.contains('liked')) {
                songData.isFavorite = true; // Cập nhật trong object songData (chỉ có tác dụng trong phiên này)
                this.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
                console.log(`Đã thích: ${songData.title}`);
            } else {
                songData.isFavorite = false;
                this.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
                console.log(`Bỏ thích: ${songData.title}`);
            }
            // TODO: Cập nhật trạng thái này vào localStorage hoặc server nếu có
        });
    }

    return songItem;
}
// Expose hàm createSongListItem ra global
window.createSongListItem = createSongListItem;
console.log("library.js loaded");