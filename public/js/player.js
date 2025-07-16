// public/js/player.js (Phiên bản đầy đủ và đã sửa lỗi)

console.log("player.js đã được tải");

// --- BIẾN TOÀN CỤC VÀ TRẠNG THÁI ---
let currentQueue = [];
let currentIndex = -1;
let isShuffle = false;
let repeatMode = 'none'; // 'none', 'all', 'one'
let lastVolume = 0.7;

// --- CÁC HÀM TIỆN ÍCH ---

// Hiển thị thông báo ngắn
function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;
    clearTimeout(notificationContainer.timeoutId);
    notificationContainer.textContent = message;
    notificationContainer.classList.add('active');
    notificationContainer.timeoutId = setTimeout(() => {
        notificationContainer.classList.remove('active');
    }, 2500);
}

// Format thời gian từ giây sang định dạng MM:SS
window.formatTime = function(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Cập nhật favicon của trình duyệt
function updateFavicon(iconUrl) {
    const oldLink = document.querySelector("link[rel*='icon']");
    if (oldLink) {
        oldLink.href = iconUrl;
    } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = iconUrl;
        document.head.appendChild(newLink);
    }
}


// --- CÁC HÀM XỬ LÝ PLAYER CHÍNH ---

// Phát một bài hát dựa vào vị trí (index) trong hàng đợi (currentQueue)
function playSongByIndex(index) {
    if (index < 0 || index >= currentQueue.length) {
        console.warn("Vị trí bài hát không hợp lệ, dừng phát nhạc.");
        return;
    }

    currentIndex = index;
    const songData = currentQueue[currentIndex];

    // Cập nhật thông tin cho Media Session API (cho lockscreen, thanh thông báo)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songData.title,
            artist: songData.artistData || songData.artistName,
            album: 'MyMusic Player',
            artwork: [{ src: songData.artUrl, sizes: '512x512', type: 'image/png' }]
        });
    }

    // Cập nhật giao diện
    document.title = `${songData.title} - ${songData.artistData || songData.artistName}`;
    updateFavicon(songData.artUrl || "/img/favicon.png");

    // Lấy các element một lần nữa để chắc chắn
    const audioPlayer = document.getElementById('audio-player');
    document.getElementById('now-playing-title').textContent = songData.title;
    document.getElementById('now-playing-artist').textContent = songData.artistData || songData.artistName;
    document.getElementById('now-playing-art').src = songData.artUrl;
    document.getElementById('np-fullscreen-title').textContent = songData.title;
    document.getElementById('np-fullscreen-artist').textContent = songData.artistData || songData.artistName;
    document.getElementById('np-fullscreen-art').src = songData.artUrl;
    
    // Gán nguồn và phát nhạc
    audioPlayer.src = songData.audioSrc;
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Lỗi khi phát nhạc:", error);
            showNotification(`Lỗi: Không thể phát ${songData.title}`);
        });
    }
}

// Xử lý khi một bài hát được chọn để phát
window.playSongFromData = function(clickedSong, playlistContext = null) {
    currentQueue = (playlistContext && playlistContext.length > 0) ? [...playlistContext] : [clickedSong];
    
    currentQueue.forEach(song => {
        if (!song.artistData && song.artistName) {
            song.artistData = song.artistName;
        }
    });

    const indexToPlay = currentQueue.findIndex(song => song.audioSrc === clickedSong.audioSrc);

    if (isShuffle && currentQueue.length > 1) {
        const firstSong = currentQueue.splice(indexToPlay, 1)[0];
        currentQueue.sort(() => Math.random() - 0.5);
        currentQueue.unshift(firstSong);
        playSongByIndex(0);
    } else {
        playSongByIndex(indexToPlay);
    }
}

// Gắn sự kiện click cho một card bài hát
function addCardClickListener(cardElement) {
    if (!cardElement) return;

    cardElement.addEventListener('click', () => {
        const songData = {
            audioSrc: cardElement.dataset.src,
            title: cardElement.dataset.title,
            artistName: cardElement.dataset.artist,
            artUrl: cardElement.dataset.art,
            isFavorite: false
        };

        if (!songData.audioSrc) {
            console.error("Card không có data-src. Không thể phát nhạc.", cardElement);
            return;
        }

        const cardGrid = cardElement.closest('.card-grid');
        let playlistContext = [];
        if (cardGrid) {
            const allCardsInSection = cardGrid.querySelectorAll('.card');
            allCardsInSection.forEach(card => {
                playlistContext.push({
                    audioSrc: card.dataset.src,
                    title: card.dataset.title,
                    artistName: card.dataset.artist,
                    artUrl: card.dataset.art,
                    artistData: card.dataset.artist
                });
            });
        }
        
        window.playSongFromData(songData, playlistContext);
    });
}


// --- KHỞI TẠO PLAYER KHI DOM ĐÃ SẴN SÀNG ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM đã tải xong. Bắt đầu khởi tạo player.");

    // --- 1. CHÈN HTML CHO PLAYER ---
    const playerContainer = document.getElementById('player-bar-container');
    const fullscreenPlayerContainer = document.getElementById('now-playing-fullscreen-container');

    if (!playerContainer || !fullscreenPlayerContainer) {
        console.error("Không tìm thấy container cho player. Dừng khởi tạo.");
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

     // <<<<<<<<<<<< THÊM LẠI ĐOẠN NÀY >>>>>>>>>>>>>
    fullscreenPlayerContainer.innerHTML = `
        <div class="np-fullscreen" id="now-playing-fullscreen">
            <button class="np-close-btn" id="np-close-btn" title="Đóng"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button>
            <div class="np-art-wrapper"><img src="/img/favicon.png" alt="Album Art" id="np-fullscreen-art"></div>
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
        </div>
    `;
    // <<<<<<<<<<<< KẾT THÚC PHẦN THÊM LẠI >>>>>>>>>>>>>

    // --- 2. LẤY CÁC PHẦN TỬ DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const mainPlayPauseBtn = document.getElementById('main-play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const volumeBar = document.getElementById('volume-bar');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const songInfoDiv = playerContainer.querySelector('.song-info');

    const playIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg>';
    const pauseIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
    const repeatIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>';
    const repeatOneIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zM13 15V9h-1l-2 1v1h1.5v4H13z"></path></svg>';

    // --- 3. GẮN SỰ KIỆN CHO CÁC NÚT ĐIỀU KHIỂN PLAYER ---
    
    function playNext() {
        if (currentQueue.length === 0) return;
        let nextIndex = currentIndex;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * currentQueue.length);
            if (currentQueue.length > 1 && nextIndex === currentIndex) {
                playNext(); // Đệ quy để tránh lặp lại bài cũ
                return;
            }
        } else {
            nextIndex = (currentIndex + 1) % currentQueue.length;
        }
        playSongByIndex(nextIndex);
    }

    function playPrev() {
        if (currentQueue.length === 0) return;
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
            return;
        }
        let prevIndex = isShuffle 
            ? Math.floor(Math.random() * currentQueue.length)
            : (currentIndex - 1 + currentQueue.length) % currentQueue.length;
        playSongByIndex(prevIndex);
    }

    mainPlayPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src) {
            if (currentQueue.length > 0) playSongByIndex(0);
            else showNotification("Vui lòng chọn một bài hát");
            return;
        }
        audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
    });

    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        showNotification(isShuffle ? "Đã bật phát ngẫu nhiên" : "Đã tắt phát ngẫu nhiên");
    });

    repeatBtn.addEventListener('click', () => {
        const modes = ['none', 'all', 'one'];
        const messages = { "all": "Lặp lại tất cả", "one": "Lặp lại một bài", "none": "Đã tắt lặp lại" };
        let currentModeIndex = modes.indexOf(repeatMode);
        repeatMode = modes[(currentModeIndex + 1) % modes.length];
        
        showNotification(messages[repeatMode]);
        repeatBtn.classList.toggle('active', repeatMode !== 'none');
        repeatBtn.innerHTML = repeatMode === 'one' ? repeatOneIconSVG_HTML : repeatIconSVG_HTML;
    });

    volumeBar.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
        audioPlayer.muted = (e.target.value == 0);
    });

    audioPlayer.addEventListener('volumechange', () => {
        volumeBar.value = audioPlayer.muted ? 0 : audioPlayer.volume * 100;
    });

    progressBar.addEventListener('input', (e) => {
        if (audioPlayer.src) {
            audioPlayer.currentTime = e.target.value;
        }
    });

    audioPlayer.addEventListener('play', () => mainPlayPauseBtn.innerHTML = pauseIconSVG);
    audioPlayer.addEventListener('pause', () => mainPlayPauseBtn.innerHTML = playIconSVG);

    audioPlayer.addEventListener('timeupdate', () => {
        if (isNaN(audioPlayer.duration)) return;
        progressBar.value = audioPlayer.currentTime;
        currentTimeEl.textContent = window.formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        progressBar.max = audioPlayer.duration;
        totalTimeEl.textContent = window.formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            playSongByIndex(currentIndex);
        } else if (repeatMode === 'none' && !isShuffle && currentIndex === currentQueue.length - 1) {
            // Hàng đợi đã kết thúc, dừng lại
            mainPlayPauseBtn.innerHTML = playIconSVG;
            document.title = "MyMusic Player";
            updateFavicon("/img/favicon.png");
        } else {
            playNext();
        }
    });

    // --- 4. GẮN SỰ KIỆN CHO CÁC CARD BÀI HÁT TRÊN TRANG ---
    console.log("Bắt đầu tìm và gắn listener cho các card bài hát.");
    const songCards = document.querySelectorAll('.card');
    console.log(`Tìm thấy ${songCards.length} card.`);

    if (songCards.length > 0) {
        songCards.forEach(card => {
            addCardClickListener(card);
        });
        console.log("Đã gắn xong listener cho các card.");
    } else {
        console.warn("Không tìm thấy card bài hát nào trên trang.");
    }

    console.log("Player đã khởi tạo hoàn tất.");
});