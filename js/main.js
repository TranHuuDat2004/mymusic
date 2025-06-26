// js/main.js (Phiên bản mới cho trang chủ "Khám phá")

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main (Home) DOMContentLoaded Start");

    const homeContentContainer = document.getElementById('home-content');
    if (!homeContentContainer) {
        console.error("Không tìm thấy container #home-content.");
        return;
    }

    // Xóa thông báo "Đang tải..."
    homeContentContainer.innerHTML = '';

    // --- CÁC HÀM RENDER CHO TỪNG LOẠI WIDGET ---

    /**
     * Render một section các card bài hát/playlist thông thường
     * @param {object} sectionData - Dữ liệu của section từ ALL_MUSIC_SECTIONS
     */
    function renderStandardSection(sectionData) {
        if (!sectionData || !sectionData.songs || sectionData.songs.length === 0) return;

        const sectionEl = document.createElement('section');
        sectionEl.classList.add('content-section');

        const titleEl = document.createElement('h2');
        titleEl.classList.add('section-title');
        titleEl.textContent = sectionData.title;

        const gridEl = document.createElement('div');
        gridEl.classList.add('card-grid');

        sectionData.songs.slice(0, 6).forEach(song => { // Chỉ hiển thị 6 bài đầu tiên
            const card = createSongCard(song);
            if (typeof addCardClickListener === 'function') {
                addCardClickListener(card);
            }
            gridEl.appendChild(card);
        });

        sectionEl.appendChild(titleEl);
        sectionEl.appendChild(gridEl);
        homeContentContainer.appendChild(sectionEl);
    }

    /**
     * Render widget các nghệ sĩ nổi bật
     * @param {number} count - Số lượng nghệ sĩ muốn hiển thị
     */
    function renderTopArtistsWidget(count = 6) {
        const artistsMap = new Map();
        ALL_MUSIC_SECTIONS.flatMap(s => s.songs).forEach(song => {
            if (song.displayArtist && song.displayArtist.id && !artistsMap.has(song.displayArtist.id)) {
                artistsMap.set(song.displayArtist.id, {
                    id: song.displayArtist.id,
                    name: song.displayArtist.name,
                    avatarUrl: song.artUrl // Lấy ảnh bìa làm avatar
                });
            }
        });

        const uniqueArtists = Array.from(artistsMap.values());
        if (uniqueArtists.length === 0) return;

        const sectionEl = document.createElement('section');
        sectionEl.classList.add('content-section');
        sectionEl.innerHTML = `<h2 class="section-title">Nghệ sĩ nổi bật</h2>`;

        const gridEl = document.createElement('div');
        gridEl.classList.add('card-grid');

        uniqueArtists.slice(0, count).forEach(artist => {
            const card = document.createElement('a');
            card.href = `artist_page.html?artistId=${artist.id}`;
            card.classList.add('card', 'artist-card'); // Dùng style của artist card
            card.innerHTML = `
                <img src="${artist.avatarUrl || 'img/singer-holder.png'}" alt="${artist.name}" class="album-art">
                <h3 class="artist-card-name">${artist.name}</h3>
                <p class="artist-card-type">Nghệ sĩ</p>
            `;
            gridEl.appendChild(card);
        });

        sectionEl.appendChild(gridEl);
        homeContentContainer.appendChild(sectionEl);
    }

    /**
     * Render widget các playlist "Daily Mix"
     * Lấy ngẫu nhiên các playlist từ ALL_MUSIC_SECTIONS để giả lập
     */
    function renderDailyMixWidget(count = 6) {
        if (typeof ALL_MUSIC_SECTIONS === 'undefined' || ALL_MUSIC_SECTIONS.length === 0) return;

        // Trộn ngẫu nhiên các section để giả lập "Daily Mix"
        const shuffledSections = [...ALL_MUSIC_SECTIONS].sort(() => 0.5 - Math.random());

        const sectionEl = document.createElement('section');
        sectionEl.classList.add('content-section');
        sectionEl.innerHTML = `<h2 class="section-title">Playlist ngẫu nhiên <a href="all_playlists.html">(Xem tất cả Playlist)</a></h2>`;

        const gridEl = document.createElement('div');
        gridEl.classList.add('card-grid');

        shuffledSections.slice(0, count).forEach((playlist, index) => {
            const card = document.createElement('a');
            card.href = `playlist.html?id=${playlist.id}`;
            card.classList.add('card', 'playlist-card'); // Có thể style riêng cho playlist card

            const coverArt = (playlist.songs && playlist.songs.length > 0) ? playlist.songs[0].artUrl : 'img/song-holder.png';

            card.innerHTML = `
                <img src="${coverArt}" alt="${playlist.title}" class="album-art">
                <h3 class="song-title">Daily Mix ${index + 1}</h3>
                <p class="song-artist">${playlist.title}</p>
            `;
            gridEl.appendChild(card);
        });

        sectionEl.appendChild(gridEl);
        homeContentContainer.appendChild(sectionEl);
    }

    // --- XÂY DỰNG TRANG CHỦ ---
    // Bây giờ bạn có thể gọi các hàm render theo thứ tự bạn muốn

    // 1. Chào mừng
    const welcomeHeader = document.createElement('h1');
    welcomeHeader.textContent = "Chào Trần Hữu Đạt";
    homeContentContainer.appendChild(welcomeHeader);

    // 2. Render widget Daily Mix
    renderDailyMixWidget(6);

    // 3. Render một vài section nhạc tiêu chuẩn
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined') {
        renderStandardSection(ALL_MUSIC_SECTIONS.find(s => s.id === 'Vpop'));
        renderStandardSection(ALL_MUSIC_SECTIONS.find(s => s.id === 'VpopRemix'));
        renderStandardSection(ALL_MUSIC_SECTIONS.find(s => s.id === 'ElectronicEDM'));
    }

    // 4. Render widget Nghệ sĩ nổi bật
    renderTopArtistsWidget(6);

    // GỌI HÀM CHÈN FOOTER SAU KHI MỌI THỨ ĐÃ XONG
    if (typeof window.appendMainFooter === 'function') {
        window.appendMainFooter();
    }
    console.log("Main (Home) DOMContentLoaded End");
});