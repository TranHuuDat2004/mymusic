// public/js/search.js (Phiên bản cuối cùng, gọi API tìm kiếm của server)

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    
    // Hàm để hiển thị kết quả tìm kiếm từ dữ liệu API trả về
    function displayResults(data, query) {
        resultsContainer.innerHTML = ''; // Xóa kết quả cũ

        const { artists, songs } = data;

        if (artists.length === 0 && songs.length === 0) {
            resultsContainer.innerHTML = `<p>Không tìm thấy kết quả nào cho "<strong>${query}</strong>".</p>`;
            return;
        }

        // Hiển thị nghệ sĩ
        if (artists.length > 0) {
            const artistsSection = document.createElement('div');
            artistsSection.className = 'search-result-section';
            artistsSection.innerHTML = `<h2>Nghệ sĩ</h2>`;
            const artistsGrid = document.createElement('div');
            artistsGrid.className = 'card-grid';
            
            artists.forEach(artist => {
                const artistCard = document.createElement('a');
                artistCard.href = `/artist?artistId=${artist._id}`;
                artistCard.className = 'card artist-card';
                artistCard.innerHTML = `
                    <img src="/${artist.avatarUrl || 'img/singer-holder.png'}" alt="${artist.name}" class="album-art">
                    <h3 class="artist-card-name">${artist.name}</h3>
                    <p class="artist-card-type">Nghệ sĩ</p>
                `;
                artistsGrid.appendChild(artistCard);
            });
            artistsSection.appendChild(artistsGrid);
            resultsContainer.appendChild(artistsSection);
        }

        // Hiển thị bài hát
        if (songs.length > 0) {
            const songsSection = document.createElement('div');
            songsSection.className = 'search-result-section';
            songsSection.innerHTML = `<h2>Bài hát</h2>`;
            const songsGrid = document.createElement('div');
            songsGrid.className = 'card-grid';

            songs.forEach(song => {
                if (typeof window.createSongCard !== 'function') return;
                const songCard = window.createSongCard(song);
                
                songCard.addEventListener('click', () => {
                    if (typeof window.playSongFromData !== 'function') return;
                    // Context playlist bây giờ là chính danh sách các bài hát tìm được
                    window.playSongFromData(song, songs);
                });
                songsGrid.appendChild(songCard);
            });
            songsSection.appendChild(songsGrid);
            resultsContainer.appendChild(songsSection);
        }
    }

    // Hàm gọi API tìm kiếm
    async function performSearch(query) {
        if (!query.trim()) {
            resultsContainer.innerHTML = `<p class="search-initial-message">Nhập từ khóa để bắt đầu tìm kiếm.</p>`;
            return;
        }

        resultsContainer.innerHTML = `<p class="loading-message">Đang tìm kiếm...</p>`;

        try {
            // Gọi API endpoint mới, encode query để xử lý các ký tự đặc biệt
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Phản hồi từ server không hợp lệ.');
            }
            const data = await response.json();
            displayResults(data, query);

        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm:", error);
            resultsContainer.innerHTML = `<p class="error-message">Có lỗi xảy ra, không thể tìm kiếm.</p>`;
        }
    }

    // Gắn sự kiện cho thanh tìm kiếm với Debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value;
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // Chờ 300ms sau khi ngừng gõ

        clearSearchBtn.style.display = query ? 'block' : 'none';
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        resultsContainer.innerHTML = `<p class="search-initial-message">Nhập từ khóa để bắt đầu tìm kiếm.</p>`;
        clearSearchBtn.style.display = 'none';
    });
});