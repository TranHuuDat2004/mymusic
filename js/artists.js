// artists.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Artists DOMContentLoaded Start");

    const artistsGridContainer = document.getElementById('artists-grid');
    const playlistUlSidebar = document.getElementById('playlist-links-list'); // Sidebar playlist UL

    // --- Hàm tạo card cho một nghệ sĩ ---
    function createArtistCard(artistData) {
        if (!artistData || !artistData.id || !artistData.name) {
            console.warn("Dữ liệu nghệ sĩ không hợp lệ:", artistData);
            return null;
        }

        const card = document.createElement('a'); // Dùng thẻ <a> để có thể click điều hướng
        card.href = `artist_page.html?artistId=${encodeURIComponent(artistData.id)}`;
        card.classList.add('card', 'artist-card'); // Thêm class artist-card để style riêng

        const img = document.createElement('img');
        img.src = artistData.avatarUrl || 'https://via.placeholder.com/180/888/FFF?text=Artist';
        img.alt = artistData.name;
        img.classList.add('album-art'); // Tái sử dụng class này, nhưng CSS sẽ làm nó tròn
        img.loading = 'lazy';

        const nameH3 = document.createElement('h3');
        nameH3.classList.add('artist-card-name'); // Class mới cho tên
        nameH3.textContent = artistData.name;

        const typeP = document.createElement('p');
        typeP.classList.add('artist-card-type');
        typeP.textContent = 'Nghệ sĩ';

        card.appendChild(img);
        card.appendChild(nameH3);
        card.appendChild(typeP);

        // Không cần nút play overlay cho card nghệ sĩ
        // Và không cần gắn listener phát nhạc ở đây, vì click vào card sẽ điều hướng

        return card;
    }

    // --- Render danh sách nghệ sĩ ---
    if (typeof ALL_MOCK_ARTISTS !== 'undefined' && artistsGridContainer) {
        artistsGridContainer.innerHTML = ''; // Xóa thông báo "Đang tải..."

        const artistIds = Object.keys(ALL_MOCK_ARTISTS); // Lấy danh sách các ID nghệ sĩ

        if (artistIds.length > 0) {
            artistIds.forEach(artistId => {
                const artist = ALL_MOCK_ARTISTS[artistId];
                const artistCardElement = createArtistCard(artist);
                if (artistCardElement) {
                    artistsGridContainer.appendChild(artistCardElement);
                }
            });
        } else {
            artistsGridContainer.innerHTML = '<p>Chưa có thông tin nghệ sĩ nào.</p>';
        }

    } else {
        console.error("Không tìm thấy dữ liệu ALL_MOCK_ARTISTS hoặc container artists-grid.");
        if(artistsGridContainer) artistsGridContainer.innerHTML = '<p>Lỗi tải danh sách nghệ sĩ.</p>';
    }

    // --- Render playlist links trong sidebar (vẫn cần) ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUlSidebar && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUlSidebar);
    }

    // Đảm bảo class 'active' đúng cho link 'Nghệ Sĩ'
    document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
    const artistsLink = document.querySelector('.sidebar-nav a[href="artists.html"]');
    if(artistsLink) artistsLink.classList.add('active');

    console.log("Artists DOMContentLoaded End");

    // --- Logic Sidebar Toggle (Có thể tách ra ui.js) ---
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    // const mainContentForOverlay = document.querySelector('.main-content'); // Không cần nếu overlay thêm vào body

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            sidebar.classList.toggle('active');
            toggleSidebarOverlay(sidebar.classList.contains('active'));
        });
    }

    // Đóng sidebar khi click ra ngoài
    document.addEventListener('click', (event) => {
        if (sidebar && sidebar.classList.contains('active') &&
            !sidebar.contains(event.target) &&
            event.target !== menuToggleBtn) {
            sidebar.classList.remove('active');
            toggleSidebarOverlay(false);
        }
    });
});

console.log("artists.js loaded");