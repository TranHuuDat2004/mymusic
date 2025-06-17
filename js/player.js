// js/player.js (Hoàn chỉnh với chức năng Fullscreen)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Player DOMContentLoaded Start");

    // --- 1. TẠO VÀ CHÈN HTML CHO CÁC THÀNH PHẦN PLAYER ---
    const playerContainer = document.getElementById('player-bar-container');
    const fullscreenPlayerContainer = document.getElementById('now-playing-fullscreen-container');

    if (!playerContainer || !fullscreenPlayerContainer) {
        console.warn("Không tìm thấy container cho player hoặc màn hình fullscreen.");
        return;
    }

    // A. HTML cho Player Bar
    const playerBarHTML = `
        <div class="song-info">
            <img src="img/favicon.png" alt="Now Playing" id="now-playing-art">
            <div class="text-details">
                <h4 id="now-playing-title">Chưa có nhạc</h4>
                <p id="now-playing-artist">Chọn một bài hát</p>
            </div>
            <div class="actions">
                <button id="like-btn" title="Thích"><svg viewBox="0 0 24 24" width="18" height="18" class="icon-like"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg></button>
            </div>
        </div>
        <div class="player-controls">
            <div class="buttons">
                <button id="shuffle-btn" title="Ngẫu nhiên"><svg viewBox="0 0 24 24" width="20" height="20" class="icon-shuffle"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg></button>
                <button id="prev-btn" title="Trước"><svg viewBox="0 0 24 24" width="20" height="20" class="icon-prev"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg></button>
                <button class="play-pause-btn" id="main-play-pause-btn" title="Phát"><svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg></button>
                <button id="next-btn" title="Tiếp theo"><svg viewBox="0 0 24 24" width="20" height="20" class="icon-next"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg></button>
                <button id="repeat-btn" title="Lặp lại"><svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg></button>
            </div>
            <div class="progress-bar-container">
                <span id="current-time">0:00</span>
                <input type="range" id="progress-bar" min="0" max="100" value="0" title="Thanh tiến trình">
                <span id="total-time">0:00</span>
            </div>
        </div>
        <div class="other-controls">
            <button id="volume-btn" title="Âm lượng"><svg viewBox="0 0 24 24" width="18" height="18" class="icon-volume"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></button>
            <div class="volume-bar-container"><input type="range" id="volume-bar" min="0" max="100" value="70" title="Thanh âm lượng"></div>
        </div>
    `;
    playerContainer.className = 'player-bar';
    playerContainer.innerHTML = playerBarHTML;

    // B. HTML cho màn hình Now Playing Fullscreen
    const fullscreenPlayerHTML = `
        <div class="np-fullscreen" id="now-playing-fullscreen">
            <button class="np-close-btn" id="np-close-btn" title="Đóng"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
            <div class="np-art-wrapper"><img src="img/favicon.png" alt="Album Art" id="np-fullscreen-art"></div>
            <div class="np-details">
                <h2 id="np-fullscreen-title">Chưa có nhạc</h2>
                <p id="np-fullscreen-artist">Chọn một bài hát</p>
            </div>
            <div class="np-progress">
                <span id="np-fullscreen-current-time">0:00</span>
                <input type="range" id="np-fullscreen-progress-bar" min="0" max="100" value="0">
                <span id="np-fullscreen-total-time">0:00</span>
            </div>
            <div class="np-controls">
                <button id="np-fullscreen-prev-btn" title="Trước"><svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg></button>
                <button id="np-fullscreen-play-pause-btn" class="play-pause-btn" title="Phát"><svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></button>
                <button id="np-fullscreen-next-btn" title="Tiếp theo"><svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg></button>
            </div>
            <div class="np-extra-controls">
                <button id="np-fullscreen-volume-btn" title="Âm lượng"><svg viewBox="0 0 24 24" width="24" height="24" class="icon-volume" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></button>
                <input type="range" id="np-fullscreen-volume-bar" min="0" max="100" value="70">
                <button id="np-fullscreen-shuffle-btn" title="Ngẫu nhiên"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg></button>
                <button id="np-fullscreen-repeat-btn" title="Lặp lại"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg></button>
            </div>
        </div>
    `;
    fullscreenPlayerContainer.innerHTML = fullscreenPlayerHTML;

    // --- 2. LẤY CÁC PHẦN TỬ DOM ---
    const audioPlayer = document.getElementById('audio-player');
    // Player Bar elements
    const mainPlayPauseBtn = document.getElementById('main-play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const volumeBar = document.getElementById('volume-bar');
    const nowPlayingArt = document.getElementById('now-playing-art');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nowPlayingArtist = document.getElementById('now-playing-artist');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const likeBtn = document.getElementById('like-btn');
    const volumeBtn = document.getElementById('volume-btn');
    // Fullscreen elements
    const npCloseBtn = document.getElementById('np-close-btn');
    const npFsArt = document.getElementById('np-fullscreen-art');
    const npFsTitle = document.getElementById('np-fullscreen-title');
    const npFsArtist = document.getElementById('np-fullscreen-artist');
    const npFsCurrentTime = document.getElementById('np-fullscreen-current-time');
    const npFsTotalTime = document.getElementById('np-fullscreen-total-time');
    const npFsProgressBar = document.getElementById('np-fullscreen-progress-bar');
    const npFsPlayPauseBtn = document.getElementById('np-fullscreen-play-pause-btn');
    const npFsPrevBtn = document.getElementById('np-fullscreen-prev-btn');
    const npFsNextBtn = document.getElementById('np-fullscreen-next-btn');
    const npFsVolumeBtn = document.getElementById('np-fullscreen-volume-btn');
    const npFsVolumeBar = document.getElementById('np-fullscreen-volume-bar');
    const npFsShuffleBtn = document.getElementById('np-fullscreen-shuffle-btn');
    const npFsRepeatBtn = document.getElementById('np-fullscreen-repeat-btn');

    // --- 3. QUẢN LÝ TRẠNG THÁI PLAYER ---
    let allSongsFlat = [], currentQueue = [], currentIndex = -1;
    let isShuffle = false, repeatMode = 'none', isVolumeInitialized = false, lastVolume = 0.7;

    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && Array.isArray(ALL_MUSIC_SECTIONS)) {
        allSongsFlat = ALL_MUSIC_SECTIONS.flatMap(section => section.songs);
    }

    const playIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg>';
    const pauseIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
    const repeatIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>';
    const repeatOneIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zM13 15V9h-1l-2 1v1h1.5v4H13z"></path></svg>';

    // --- 4. HỆ THỐNG NOTIFICATION & HÀM TIỆN ÍCH ---
    const notificationContainer = document.getElementById('notification-container');
    let notificationTimeout;
    function showNotification(message) {
        if (!notificationContainer) return;
        clearTimeout(notificationTimeout);
        notificationContainer.textContent = message;
        notificationContainer.classList.add('active');
        notificationTimeout = setTimeout(() => notificationContainer.classList.remove('active'), 2000);
    }

    // --- HÀM CẬP NHẬT FAVICON - PHIÊN BẢN TƯƠNG THÍCH SAFARI/IOS ---
    function updateFavicon(iconUrl) {
        // Bước 1: Tìm và xóa tất cả các thẻ link favicon cũ.
        // Dùng querySelectorAll để đảm bảo xóa hết mọi loại (icon, shortcut icon, apple-touch-icon).
        const oldLinks = document.querySelectorAll("link[rel*='icon']");
        oldLinks.forEach(link => link.parentNode.removeChild(link));

        // Bước 2: Tạo một thẻ link mới hoàn toàn.
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.type = 'image/png'; // Thêm type để rõ ràng hơn
        newLink.href = iconUrl;

        // Bước 3: Thêm thẻ link mới vào <head>.
        // Việc này sẽ buộc trình duyệt phải tải lại tài nguyên.
        document.head.appendChild(newLink);
    }

    // --- 5. CÁC HÀM XỬ LÝ PLAYER CHÍNH ---
    function playSongByIndex(index) {
        if (index < 0 || index >= currentQueue.length) {
            document.title = "MyMusic Player";
            updateFavicon("img/favicon.png");
            return;
        }

        currentIndex = index;
        const songData = currentQueue[currentIndex];

        // --- BẮT ĐẦU: CẬP NHẬT MEDIA SESSION API (PHIÊN BẢN ĐÃ SỬA) ---
        if ('mediaSession' in navigator) {
            // Xác định URL ảnh sẽ sử dụng: ưu tiên ảnh bìa của bài hát,
            // nếu không có thì mới dùng ảnh mặc định.
            const imageUrl = songData.artUrl || 'img/favicon-512x512.png'; // Dùng ảnh favicon lớn nhất làm ảnh dự phòng

            navigator.mediaSession.metadata = new MediaMetadata({
                title: songData.title || "Không có tiêu đề",
                artist: songData.artistData || "Nghệ sĩ không xác định",
                album: 'MyMusic Player',
                artwork: [
                    // LUÔN SỬ DỤNG imageUrl (là ảnh bìa hoặc ảnh dự phòng)
                    { src: imageUrl, sizes: '96x96', type: 'image/png' },
                    { src: imageUrl, sizes: '128x128', type: 'image/png' },
                    { src: imageUrl, sizes: '192x192', type: 'image/png' },
                    { src: imageUrl, sizes: '256x256', type: 'image/png' },
                    { src: imageUrl, sizes: '384x384', type: 'image/png' },
                    { src: imageUrl, sizes: '512x512', type: 'image/png' },
                ]
            });

            // Cập nhật hành động cho các nút trên widget media
            navigator.mediaSession.setActionHandler('play', () => { mainPlayPauseBtn.click(); });
            navigator.mediaSession.setActionHandler('pause', () => { mainPlayPauseBtn.click(); });
            navigator.mediaSession.setActionHandler('previoustrack', () => { prevBtn.click(); });
            navigator.mediaSession.setActionHandler('nexttrack', () => { nextBtn.click(); });
        }
        // --- KẾT THÚC: CẬP NHẬT MEDIA SESSION API ---


        document.title = `${songData.title} - ${songData.artistData}`;
        updateFavicon(songData.artUrl || "img/favicon.png");

        nowPlayingTitle.textContent = songData.title;
        nowPlayingArtist.textContent = songData.artistData;
        nowPlayingArt.src = songData.artUrl;

        npFsTitle.textContent = songData.title;
        npFsArtist.textContent = songData.artistData;
        npFsArt.src = songData.artUrl;

        audioPlayer.src = songData.audioSrc;
        likeBtn.classList.toggle('active', !!songData.isFavorite);

        const playPromise = audioPlayer.play();
        if (playPromise) {
            playPromise.catch(error => {
                if (error.name !== 'AbortError') {
                    console.error(`Lỗi khi phát "${songData.title}":`, error);
                    nowPlayingTitle.textContent = "Lỗi tải nhạc";
                }
            });
        }
    }

    window.playSongFromData = (clickedSong, playlistContext = null) => {
        currentQueue = (playlistContext && Array.isArray(playlistContext)) ? [...playlistContext] : [...allSongsFlat];
        const index = currentQueue.findIndex(song => song.audioSrc === clickedSong.audioSrc);
        if (index === -1) return;
        if (isShuffle) {
            const firstSong = currentQueue.splice(index, 1)[0];
            currentQueue.sort(() => Math.random() - 0.5);
            currentQueue.unshift(firstSong);
            playSongByIndex(0);
        } else {
            playSongByIndex(index);
        }
    };

    window.addCardClickListener = (cardElement) => {
        if (!cardElement) return;
        cardElement.addEventListener('click', () => {
            const clickedSong = allSongsFlat.find(song => song.audioSrc === cardElement.dataset.src);
            if (clickedSong) window.playSongFromData(clickedSong);
        });
    };

    function playNext() {
        if (currentQueue.length === 0) return;
        let nextIndex = isShuffle ? Math.floor(Math.random() * currentQueue.length) : (currentIndex + 1) % currentQueue.length;
        if (isShuffle && currentQueue.length > 1 && nextIndex === currentIndex) return playNext();
        playSongByIndex(nextIndex);
    }

    function playPrev() {
        if (currentQueue.length === 0) return;
        if (audioPlayer.currentTime > 3) { audioPlayer.currentTime = 0; return; }
        const prevIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        playSongByIndex(isShuffle ? Math.floor(Math.random() * currentQueue.length) : prevIndex);
    }

    // --- 6. GẮN CÁC LISTENER ---
    // Mở/Đóng Fullscreen
    const songInfoDiv = playerContainer.querySelector('.song-info');
    songInfoDiv.addEventListener('click', (e) => {
        if (e.target.closest('#like-btn')) return;
        if (currentIndex !== -1) fullscreenPlayerContainer.classList.add('active');
    });
    npCloseBtn.addEventListener('click', () => fullscreenPlayerContainer.classList.remove('active'));

    // Các nút điều khiển
    mainPlayPauseBtn.addEventListener('click', () => {
        if (!isVolumeInitialized) { audioPlayer.volume = volumeBar.value / 100; isVolumeInitialized = true; }
        if (currentIndex === -1 && allSongsFlat.length > 0) window.playSongFromData(allSongsFlat[0]);
        else if (audioPlayer.src) audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
    });
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    // Đồng bộ click
    npFsPlayPauseBtn.addEventListener('click', () => mainPlayPauseBtn.click());
    npFsNextBtn.addEventListener('click', () => nextBtn.click());
    npFsPrevBtn.addEventListener('click', () => prevBtn.click());

    // Các nút trạng thái (logic và UI cập nhật cùng lúc)
    const toggleShuffle = () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        npFsShuffleBtn.classList.toggle('active', isShuffle);
        showNotification(isShuffle ? "Đã bật phát ngẫu nhiên" : "Đã tắt phát ngẫu nhiên");
    };
    shuffleBtn.addEventListener('click', toggleShuffle);
    npFsShuffleBtn.addEventListener('click', toggleShuffle);

    const toggleRepeat = () => {
        const modes = ['none', 'all', 'one'];
        const messages = { "all": "Lặp lại tất cả", "one": "Lặp lại một bài", "none": "Đã tắt lặp lại" };
        let currentModeIndex = modes.indexOf(repeatMode);
        repeatMode = modes[(currentModeIndex + 1) % modes.length];
        showNotification(messages[repeatMode]);

        const isActive = repeatMode !== 'none';
        const iconHTML = repeatMode === 'one' ? repeatOneIconSVG_HTML : repeatIconSVG_HTML;

        [repeatBtn, npFsRepeatBtn].forEach(btn => btn.classList.toggle('active', isActive));
        repeatBtn.innerHTML = iconHTML;
        npFsRepeatBtn.innerHTML = iconHTML.replace('width="20" height="20"', 'width="24" height="24"');
    };
    repeatBtn.addEventListener('click', toggleRepeat);
    npFsRepeatBtn.addEventListener('click', toggleRepeat);

    likeBtn.addEventListener('click', () => {
        if (currentIndex === -1) return;
        const song = currentQueue[currentIndex];
        song.isFavorite = !song.isFavorite;
        likeBtn.classList.toggle('active', song.isFavorite);
        showNotification(song.isFavorite ? "Đã thêm vào bài hát yêu thích" : "Đã xóa khỏi bài hát yêu thích");
    });

    const toggleMute = () => audioPlayer.muted = !audioPlayer.muted;
    volumeBtn.addEventListener('click', toggleMute);
    npFsVolumeBtn.addEventListener('click', toggleMute);

    // Listeners cho Audio Element
    audioPlayer.addEventListener('play', () => {
        mainPlayPauseBtn.innerHTML = pauseIconSVG;
        npFsPlayPauseBtn.innerHTML = pauseIconSVG.replace('width="24" height="24"', 'width="60" height="60"');
    });
    audioPlayer.addEventListener('pause', () => {
        mainPlayPauseBtn.innerHTML = playIconSVG;
        npFsPlayPauseBtn.innerHTML = playIconSVG.replace('width="24" height="24"', 'width="60" height="60"');
    });
    audioPlayer.addEventListener('volumechange', () => {
        const isActive = !audioPlayer.muted && audioPlayer.volume > 0;
        [volumeBtn, npFsVolumeBtn].forEach(btn => btn.classList.toggle('active', isActive));
        if (!audioPlayer.muted) {
            const newVolume = audioPlayer.volume;
            [volumeBar, npFsVolumeBar].forEach(bar => bar.value = newVolume * 100);
            lastVolume = newVolume;
        } else {
            [volumeBar, npFsVolumeBar].forEach(bar => bar.value = 0);
        }
    });
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime || 0;
        [progressBar, npFsProgressBar].forEach(bar => bar.value = currentTime);
        [currentTimeEl, npFsCurrentTime].forEach(el => el.textContent = window.formatTime(currentTime));
    });
    audioPlayer.addEventListener('loadedmetadata', () => {
        const duration = audioPlayer.duration || 0;
        [progressBar, npFsProgressBar].forEach(bar => bar.max = duration);
        [totalTimeEl, npFsTotalTime].forEach(el => el.textContent = window.formatTime(duration));
    });
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 'one') playSongByIndex(currentIndex);
        else if (repeatMode === 'none' && !isShuffle && currentIndex === currentQueue.length - 1) {
            document.title = "MyMusic Player";
            updateFavicon("img/favicon.png");
        } else playNext();
    });

    // Listeners cho các thanh trượt
    const handleProgressInput = (e) => { if (audioPlayer.src) audioPlayer.currentTime = e.target.value; };
    progressBar.addEventListener('input', handleProgressInput);
    npFsProgressBar.addEventListener('input', handleProgressInput);

    const handleVolumeInput = (e) => {
        audioPlayer.muted = false;
        audioPlayer.volume = e.target.value / 100;
    };
    volumeBar.addEventListener('input', handleVolumeInput);
    npFsVolumeBar.addEventListener('input', handleVolumeInput);

    // --- LOGIC SIDEBAR TOGGLE ---
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggleBtn && sidebar) { /* ... giữ nguyên logic sidebar ... */ }

    console.log("Player DOMContentLoaded End");
});

console.log("player.js loaded");