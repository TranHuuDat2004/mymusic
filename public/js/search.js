// search.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Search DOMContentLoaded Start");

    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const playlistUl = document.getElementById('playlist-links-list'); // Lấy Ul sidebar

    // --- Tạo link playlist động trong sidebar (Gọi hàm từ utils.js) ---
    // Vẫn cần render playlist trên trang search để sidebar hiển thị đúng
     if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUl && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUl);
        // KHÔNG gọi attachSmoothScrollListeners ở đây
    } else {
         console.error("Lỗi: Không tìm thấy dữ liệu nhạc, ul playlist hoặc hàm renderPlaylistLinks trên trang search.");
    }

    // --- Logic tìm kiếm (như cũ) ---
    if (typeof ALL_MUSIC_SECTIONS === 'undefined') {
        // ... xử lý lỗi dữ liệu ...
        return;
    }
    if (typeof window.createSongCard !== 'function') {
       // ... xử lý lỗi thiếu hàm ...
        return;
    }

    function performSearch(query) {
       // ... code hàm performSearch như trước, gọi window.createSongCard ...
        if (!resultsContainer) return;
        resultsContainer.innerHTML = ''; // Xóa kết quả cũ

        const initialMessage = '<p class="search-initial-message">Nhập từ khóa để bắt đầu tìm kiếm.</p>';
        if (!query) {
             resultsContainer.innerHTML = initialMessage;
            return;
        }

        const lowerCaseQuery = query.toLowerCase().trim();
        const foundSongs = [];

        ALL_MUSIC_SECTIONS.forEach(section => {
            if (Array.isArray(section.songs)) {
                section.songs.forEach(song => {
                    const titleMatch = song.title?.toLowerCase().includes(lowerCaseQuery);
                    const artistMatch = song.displayArtist?.name?.toLowerCase().includes(lowerCaseQuery);
                    const artistDataMatch = song.artistData?.toLowerCase().includes(lowerCaseQuery);

                    if (titleMatch || artistMatch || artistDataMatch) {
                        const uniqueId = song.id || `${song.title}-${song.artistData}`;
                        if (!foundSongs.some(found => (found.id || `${found.title}-${found.artistData}`) === uniqueId)) {
                            foundSongs.push(song);
                        }
                    }
                });
            }
        });

        if (foundSongs.length > 0) {
            const resultGrid = document.createElement('div');
            resultGrid.classList.add('card-grid');
            foundSongs.forEach(song => {
                const card = window.createSongCard(song);
                resultGrid.appendChild(card);
            });
            resultsContainer.appendChild(resultGrid);
        } else {
            resultsContainer.innerHTML = `<p>Không tìm thấy kết quả nào cho "${query}".</p>`;
        }
    }


    // Xử lý input tìm kiếm
    if (searchInput && clearSearchBtn) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            performSearch(query);
            clearSearchBtn.style.display = query ? 'inline-block' : 'none';
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            performSearch('');
            clearSearchBtn.style.display = 'none';
            searchInput.focus();
        });
    } else {
        console.warn("Không tìm thấy search input hoặc nút clear.");
    }

    console.log("Search DOMContentLoaded End");
});

console.log("search.js loaded"); // Để kiểm tra thứ tự load