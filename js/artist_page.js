// artist_page.js

// Hàm format thời gian (giây sang MM:SS)
function formatAudioTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Hàm lấy duration của một file audio (trả về Promise)
function getAudioFileDuration(audioSrc) {
    return new Promise((resolve, reject) => {
        if (!audioSrc) {
            resolve("0:00"); // Hoặc giá trị mặc định khác nếu không có src
            return;
        }
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
            resolve(formatAudioTime(audio.duration));
        });
        audio.addEventListener('error', (e) => {
            console.warn(`Cảnh báo: Không thể tải metadata cho ${audioSrc}:`, e.message);
            resolve("N/A"); // Hoặc giá trị lỗi
        });
        try {
            audio.src = audioSrc;
        } catch (error) {
            console.error(`Lỗi khi gán src cho audio ${audioSrc}:`, error);
            reject(error);
        }
    });
}

// Hàm xử lý dữ liệu nghệ sĩ, thêm duration vào các bài hát
async function processArtistDataWithDurations(rawData) {
    if (!rawData) {
        console.error("Dữ liệu nghệ sĩ đầu vào không hợp lệ.");
        return { name: "Nghệ sĩ không tồn tại", popularSongs: [], albums: [], singles: [], bio:"" };
    }
    // Tạo một bản sao sâu để không thay đổi dữ liệu gốc trong ALL_MOCK_ARTISTS
    const processedData = JSON.parse(JSON.stringify(rawData));

    const songArraysToProcess = [];
    if (processedData.popularSongs && processedData.popularSongs.length > 0) {
        songArraysToProcess.push(processedData.popularSongs);
    }
    if (processedData.singles && processedData.singles.length > 0) {
        // Chỉ xử lý singles nếu chúng có audioSrc
        const singlesWithAudio = processedData.singles.filter(s => s.audioSrc);
        if(singlesWithAudio.length > 0) songArraysToProcess.push(singlesWithAudio);
    }
    // Có thể thêm logic cho 'songs' bên trong 'albums' nếu cần

    for (const songArray of songArraysToProcess) {
        const durationPromises = songArray.map(song =>
            getAudioFileDuration(song.audioSrc).then(duration => {
                song.duration = duration; // Gán duration vào đối tượng song
            }).catch(err => {
                console.error(`Lỗi khi lấy duration cho ${song.title}:`, err);
                song.duration = "Lỗi"; // Gán giá trị lỗi nếu có vấn đề
            })
        );
        await Promise.all(durationPromises);
    }

    return processedData;
}


document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements for Artist Page
    const artistHeaderBanner = document.getElementById('artist-header-banner');
    const artistAvatarImg = document.getElementById('artist-avatar-img');
    const artistProfileName = document.getElementById('artist-profile-name');
    const artistProfileStats = document.getElementById('artist-profile-stats');
    const artistFollowBtn = document.getElementById('artist-follow-btn');
    const artistPopularSongsContainer = document.getElementById('artist-popular-songs');
    const artistAlbumsGrid = document.getElementById('artist-albums-grid');
    const artistSinglesGrid = document.getElementById('artist-singles-grid');
    const artistBio = document.getElementById('artist-bio');

    // --- LẤY DỮ LIỆU NGHỆ SĨ TỪ FILE DATA ---
    function getArtistIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('artistId');
    }

    const artistId = getArtistIdFromUrl() || "son-tung-mtp"; // Lấy ID từ URL hoặc dùng mặc định
    let rawArtistData;

    if (typeof ALL_MOCK_ARTISTS !== 'undefined' && ALL_MOCK_ARTISTS[artistId]) {
        rawArtistData = ALL_MOCK_ARTISTS[artistId];
    } else {
        console.error(`Không tìm thấy dữ liệu cho artistId: ${artistId}.`);
        // Hiển thị thông báo lỗi trên trang hoặc redirect
        artistProfileName.textContent = "Nghệ sĩ không tồn tại";
        // Ẩn các phần khác hoặc hiển thị thông báo
        document.getElementById('artist-main-content').innerHTML = `<div style="padding:20px; text-align:center;"><h2>Không tìm thấy nghệ sĩ</h2><p>Thông tin nghệ sĩ đang được cập nhật</p></div>`;
        return; // Dừng thực thi nếu không có dữ liệu
    }

    try {
        // Hiển thị thông tin cơ bản trước (tên, avatar) để người dùng thấy gì đó nhanh chóng
        if(artistHeaderBanner && rawArtistData.bannerUrl) artistHeaderBanner.style.setProperty('--artist-banner-url', `url('${rawArtistData.bannerUrl}')`);
        if(artistAvatarImg) artistAvatarImg.src = rawArtistData.avatarUrl || 'https://via.placeholder.com/180';
        if(artistProfileName) artistProfileName.textContent = rawArtistData.name || "Đang tải...";
        if(artistProfileStats && rawArtistData.monthlyListeners) artistProfileStats.textContent = `${rawArtistData.monthlyListeners} người theo dõi hàng tháng`;
        if(artistBio) artistBio.textContent = rawArtistData.bio || "Thông tin đang được cập nhật...";

        console.log("Đang xử lý dữ liệu nghệ sĩ và lấy durations...");
        const artistDataWithDurations = await processArtistDataWithDurations(rawArtistData);
        console.log("Dữ liệu nghệ sĩ sau khi xử lý và có durations:", artistDataWithDurations);
        loadArtistPageContent(artistDataWithDurations);
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi xử lý dữ liệu nghệ sĩ:", error);
        // Hiển thị thông báo lỗi tổng quát trên trang
        if(artistProfileName) artistProfileName.textContent = "Lỗi tải dữ liệu";
        document.getElementById('artist-main-content').innerHTML = `<div style="padding:20px; text-align:center;"><h2>Đã xảy ra lỗi</h2><p>Không thể tải thông tin nghệ sĩ. Vui lòng thử lại sau.</p></div>`;
    }

    function loadArtistPageContent(artistData) {
        // Header (đã được cập nhật một phần ở trên, giờ cập nhật lại nếu cần)
        if(artistHeaderBanner && artistData.bannerUrl) artistHeaderBanner.style.setProperty('--artist-banner-url', `url('${artistData.bannerUrl}')`);
        if(artistAvatarImg) {
            artistAvatarImg.src = artistData.avatarUrl || 'https://via.placeholder.com/180';
            artistAvatarImg.alt = artistData.name || "Artist Avatar";
        }
        if(artistProfileName) artistProfileName.textContent = artistData.name || "Không có tên";
        if(artistProfileStats && artistData.monthlyListeners) artistProfileStats.textContent = `${artistData.monthlyListeners} người theo dõi hàng tháng`;
        if(artistBio) artistBio.textContent = artistData.bio || "Chưa có thông tin tiểu sử.";

        // Follow button
        if (artistFollowBtn) {
            updateFollowButton(artistData.isFollowing || false);
            artistFollowBtn.onclick = () => { // Dùng onclick để dễ gỡ nếu cần
                artistData.isFollowing = !artistData.isFollowing;
                updateFollowButton(artistData.isFollowing);
                // In a real app, send this update to the server
                console.log(`Artist ${artistData.name} following status: ${artistData.isFollowing}`);
            };
        }


        // Popular Songs
        if (artistPopularSongsContainer) {
            artistPopularSongsContainer.innerHTML = ""; // Clear previous
            if (artistData.popularSongs && artistData.popularSongs.length > 0) {
                artistData.popularSongs.forEach((song, index) => {
                    const songEl = document.createElement('div');
                    songEl.classList.add('song-list-item');
                    songEl.dataset.src = song.audioSrc;
                    songEl.dataset.title = song.title;
                    songEl.dataset.artist = artistData.name;
                    songEl.dataset.art = song.albumArt;

                    songEl.innerHTML = `
                        <span class="song-index">${index + 1}</span>
                        <img src="${song.albumArt || 'https://via.placeholder.com/40'}" alt="${song.title || 'Song'}" class="album-art-small">
                        <div class="song-details">
                            <div class="song-title">${song.title || 'Không có tiêu đề'}</div>
                        </div>
                        <div class="song-plays">${song.plays || 'N/A'}</div>
                        <div class="song-duration">${song.duration || 'N/A'}</div>
                        <div class="song-actions">
                            <button title="Thích" class="like-song-btn" data-song-id="${song.id}">♡</button>
                        </div>
                    `;
                    songEl.addEventListener('click', function() {
                        if (typeof window.playSongFromData === 'function' && this.dataset.src) {
                             window.playSongFromData({
                                src: this.dataset.src,
                                title: this.dataset.title,
                                artist: this.dataset.artist,
                                art: this.dataset.art
                            });
                        } else {
                            console.warn("Không thể phát bài hát. Thiếu playSongFromData() hoặc data-src.");
                        }
                    });
                    artistPopularSongsContainer.appendChild(songEl);
                });
            } else {
                artistPopularSongsContainer.innerHTML = "<p>Chưa có bài hát nổi bật nào.</p>";
            }
        }


        // Albums
        if (artistAlbumsGrid) {
            artistAlbumsGrid.innerHTML = "";
            if (artistData.albums && artistData.albums.length > 0) {
                artistData.albums.forEach(album => {
                    const cardEl = createContentCard(album, artistData.name, 'Album');
                    artistAlbumsGrid.appendChild(cardEl);
                });
            } else {
                artistAlbumsGrid.innerHTML = "<p>Chưa có album nào.</p>";
            }
        }


        // Singles & EPs
        if (artistSinglesGrid) {
            artistSinglesGrid.innerHTML = "";
            if (artistData.singles && artistData.singles.length > 0) {
                artistData.singles.forEach(single => {
                    const cardEl = createContentCard(single, artistData.name, 'Single');
                    artistSinglesGrid.appendChild(cardEl);
                });
            } else {
                artistSinglesGrid.innerHTML = "<p>Chưa có single/EP nào.</p>";
            }
        }
    }

    function updateFollowButton(isFollowing) {
        if (!artistFollowBtn) return;
        if (isFollowing) {
            artistFollowBtn.textContent = "Đang theo dõi";
            artistFollowBtn.classList.add('following');
        } else {
            artistFollowBtn.textContent = "Theo dõi";
            artistFollowBtn.classList.remove('following');
        }
    }

    function createContentCard(itemData, artistName, typeLabel) { // typeLabel can be 'Album' or 'Single'
        const card = document.createElement('div');
        card.classList.add('card');

        // Nếu là single và có audioSrc, thì có thể phát trực tiếp
        if (typeLabel === 'Single' && itemData.audioSrc) {
            card.dataset.src = itemData.audioSrc;
            card.dataset.title = itemData.title;
            card.dataset.artist = artistName;
            card.dataset.art = itemData.artUrl;
            card.dataset.duration = itemData.duration; // Thêm duration nếu có
        } else {
            // Đối với album, có thể xử lý khác khi click (ví dụ: mở trang album)
            card.dataset.albumId = itemData.id;
        }

        card.innerHTML = `
            <img src="${itemData.artUrl || 'https://via.placeholder.com/200'}" alt="${itemData.title || 'Content'}" class="album-art">
            <h3 class="song-title">${itemData.title || 'Không có tiêu đề'}</h3>
            <p class="song-artist">${typeLabel} • ${itemData.year || 'N/A'}</p>
            <button class="play-button-overlay">▶</button>
        `;

        card.addEventListener('click', function() {
            if (this.dataset.src && typeof window.playSongFromData === 'function') { // Ưu tiên phát nếu là single có src
                window.playSongFromData({
                    src: this.dataset.src,
                    title: this.dataset.title,
                    artist: this.dataset.artist,
                    art: this.dataset.art
                });
            } else if (this.dataset.albumId) {
                console.log(`Clicked ${typeLabel}:`, itemData.title, `- ID: ${this.dataset.albumId}. Implement navigation or play album logic.`);
                // Ví dụ: alert(`Bạn đã click vào album: ${itemData.title}`);
                // Hoặc: window.location.href = `album_page.html?albumId=${this.dataset.albumId}`;
            } else {
                 console.warn("Không có hành động nào được định nghĩa cho click này.");
            }
        });
        return card;
    }
});