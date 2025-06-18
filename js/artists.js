// js/artists.js (Hoàn chỉnh với ảnh dự phòng)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Artists DOMContentLoaded Start");

    const artistsGridContainer = document.getElementById('artists-grid');
    const fallbackImage = 'img/singer-holder.png'; // Định nghĩa ảnh dự phòng

    // --- Hàm tạo card cho một nghệ sĩ ---
    function createArtistCard(artistData) {
        if (!artistData || !artistData.id || !artistData.name) return null;

        const card = document.createElement('a');
        card.href = `artist_page.html?artistId=${encodeURIComponent(artistData.id)}`;
        card.classList.add('card', 'artist-card');

        card.innerHTML = `
            <img src="${artistData.avatarUrl || fallbackImage}" alt="${artistData.name}" class="album-art" loading="lazy">
            <h3 class="artist-card-name">${artistData.name}</h3>
            <p class="artist-card-type">Nghệ sĩ</p>
        `;
        return card;
    }

    // --- Tự động tạo danh sách nghệ sĩ từ ALL_MUSIC_SECTIONS ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && artistsGridContainer) {
        artistsGridContainer.innerHTML = '';

        const artistsMap = new Map();

        ALL_MUSIC_SECTIONS.flatMap(section => section.songs).forEach(song => {
            if (song.displayArtist && song.displayArtist.id) {
                if (!artistsMap.has(song.displayArtist.id)) {
                    artistsMap.set(song.displayArtist.id, {
                        id: song.displayArtist.id,
                        name: song.displayArtist.name,
                        // Lấy ảnh bìa của bài hát làm avatar, nếu không có sẽ dùng fallback ở createArtistCard
                        avatarUrl: song.artUrl 
                    });
                }
            }
        });
        
        const uniqueArtists = Array.from(artistsMap.values());

        if (uniqueArtists.length > 0) {
            uniqueArtists.sort((a, b) => a.name.localeCompare(b.name));
            uniqueArtists.forEach(artist => {
                const artistCardElement = createArtistCard(artist);
                if (artistCardElement) {
                    artistsGridContainer.appendChild(artistCardElement);
                }
            });
        } else {
            artistsGridContainer.innerHTML = '<p>Chưa có thông tin nghệ sĩ nào.</p>';
        }

    } else {
        if (artistsGridContainer) artistsGridContainer.innerHTML = '<p>Lỗi tải danh sách nghệ sĩ.</p>';
    }
    
    console.log("Artists DOMContentLoaded End");
});