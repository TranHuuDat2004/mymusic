// js/player.js (Phiên bản hoàn chỉnh, đã dọn dẹp và sửa lỗi)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Player DOMContentLoaded Start");

    // --- 1. TẠO VÀ CHÈN HTML CỦA PLAYER BAR ---
    const playerContainer = document.getElementById('player-bar-container');
    if (!playerContainer) {
        console.warn("Không tìm thấy #player-bar-container. Player sẽ không được tải.");
        return;
    }

    const playerBarHTML = `
        <div class="song-info">
            <img src="img/favicon.png" alt="Now Playing" id="now-playing-art">
            <div class="text-details">
                <h4 id="now-playing-title">Chưa có nhạc</h4>
                <p id="now-playing-artist">Chọn một bài hát</p>
            </div>
        </div>
        <div class="player-controls">
            <div class="buttons">
                <button id="shuffle-btn" title="Ngẫu nhiên">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="icon-shuffle"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
                </button>
                <button id="prev-btn" title="Trước">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="icon-prev"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                </button>
                <button class="play-pause-btn" id="main-play-pause-btn" title="Phát">
                    <svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg>
                </button>
                <button id="next-btn" title="Tiếp theo">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="icon-next"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
                </button>
                <button id="repeat-btn" title="Lặp lại">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>
                </button>
            </div>
            <div class="progress-bar-container">
                <span id="current-time">0:00</span>
                <input type="range" id="progress-bar" min="0" max="100" value="0" title="Thanh tiến trình">
                <span id="total-time">0:00</span>
            </div>
        </div>
        <div class="other-controls">
            <button title="Âm lượng"><svg viewBox="0 0 24 24" width="18" height="18" class="icon-volume"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></button>
            <div class="volume-bar-container"><input type="range" id="volume-bar" min="0" max="100" value="70" title="Thanh âm lượng"></div>
        </div>
    `;
    playerContainer.className = 'player-bar';
    playerContainer.innerHTML = playerBarHTML;

    // --- 2. LẤY CÁC PHẦN TỬ DOM ---
    const audioPlayer = document.getElementById('audio-player');
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

    // --- 3. QUẢN LÝ TRẠNG THÁI PLAYER ---
    let allSongsFlat = [];
    let currentQueue = [];
    let currentIndex = -1;
    let isShuffle = false;
    let repeatMode = 'none'; // 'none', 'all', 'one'

    // Nạp tất cả bài hát từ dữ liệu global
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && Array.isArray(ALL_MUSIC_SECTIONS)) {
        allSongsFlat = ALL_MUSIC_SECTIONS.flatMap(section => section.songs);
        console.log(`Đã tải ${allSongsFlat.length} bài hát.`);
    } else {
        console.error("Dữ liệu ALL_MUSIC_SECTIONS không tồn tại hoặc không hợp lệ.");
    }

    // Các hằng số Icon SVG
    const playIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg>';
    const pauseIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
    // Biến SVG mới chứa toàn bộ thẻ SVG
const repeatIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg>';
const repeatOneIconSVG_HTML = '<svg viewBox="0 0 24 24" width="20" height="20" class="icon-repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zM13 15V9h-1l-2 1v1h1.5v4H13z"></path></svg>';

    // --- 4. HỆ THỐNG NOTIFICATION ---
    let notificationTimeout;
    const notificationContainer = document.getElementById('notification-container');
    function showNotification(message) {
        if (!notificationContainer) {
            console.log("Notification:", message); // Fallback nếu không có container
            return;
        }
        clearTimeout(notificationTimeout);
        notificationContainer.textContent = message;
        notificationContainer.classList.add('active');
        notificationTimeout = setTimeout(() => {
            notificationContainer.classList.remove('active');
        }, 2000); // Hiển thị trong 2 giây
    }

    // --- 5. CÁC HÀM XỬ LÝ PLAYER ---
    function updatePlayPauseIcon(isPlaying) {
        mainPlayPauseBtn.innerHTML = isPlaying ? pauseIconSVG : playIconSVG;
    }

    function playSongByIndex(index) {
        if (index < 0 || index >= currentQueue.length) {
            console.error("Index bài hát không hợp lệ.", index, currentQueue);
            updatePlayPauseIcon(false);
            return;
        }

        currentIndex = index;
        const songData = currentQueue[currentIndex];

        nowPlayingTitle.textContent = songData.title || "Không có tiêu đề";
        nowPlayingArtist.textContent = songData.artistData || "Nghệ sĩ không xác định";
        nowPlayingArt.src = songData.artUrl || "img/favicon.png";
        audioPlayer.src = songData.audioSrc;
        
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error(`Lỗi khi phát "${songData.title}":`, error);
                nowPlayingTitle.textContent = "Lỗi tải nhạc";
                updatePlayPauseIcon(false);
            });
        }
    }

    window.playSongFromData = (clickedSong) => {
        currentQueue = [...allSongsFlat];
        const index = currentQueue.findIndex(song => song.audioSrc === clickedSong.audioSrc);
        
        if (index === -1) {
            console.error("Không tìm thấy bài hát được click trong danh sách gốc.", clickedSong);
            return;
        }

        if (isShuffle) {
            const firstSong = currentQueue.splice(index, 1)[0];
            for (let i = currentQueue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentQueue[i], currentQueue[j]] = [currentQueue[j], currentQueue[i]];
            }
            currentQueue.unshift(firstSong);
            playSongByIndex(0);
        } else {
            playSongByIndex(index);
        }
    };

    window.addCardClickListener = (cardElement) => {
        if (!cardElement) return;
        const handleCardClick = () => {
            const clickedSong = allSongsFlat.find(song => song.audioSrc === cardElement.dataset.src);
            if (clickedSong) {
                window.playSongFromData(clickedSong);
            } else {
                console.warn("Card không có data-src hợp lệ hoặc không tìm thấy trong allSongsFlat.");
            }
        };
        cardElement.addEventListener('click', handleCardClick);
    };

    // --- 6. CÁC HÀM ĐIỀU KHIỂN (NEXT, PREV) ---
    function playNext() {
        if (currentQueue.length === 0) return;
        
        let nextIndex;
        if (isShuffle) {
            if (currentQueue.length <= 1) {
                nextIndex = 0;
            } else {
                do {
                    nextIndex = Math.floor(Math.random() * currentQueue.length);
                } while (nextIndex === currentIndex);
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
        
        if (isShuffle) {
             playNext();
        } else {
             const prevIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
             playSongByIndex(prevIndex);
        }
    }

    // --- 7. GẮN CÁC LISTENER ---
    mainPlayPauseBtn.addEventListener('click', () => {
        if (currentIndex === -1) {
            if (allSongsFlat.length > 0) {
                console.log("Chưa có nhạc, phát bài đầu tiên.");
                window.playSongFromData(allSongsFlat[0]);
            }
            return;
        }
        audioPlayer.paused ? audioPlayer.play().catch(e => console.error("Lỗi play:", e)) : audioPlayer.pause();
    });

    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        showNotification(isShuffle ? "Đã bật phát ngẫu nhiên" : "Đã tắt phát ngẫu nhiên");
    });

    // Listener đã sửa
repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'none') {
        repeatMode = 'all';
        repeatBtn.classList.add('active');
        showNotification("Lặp lại tất cả");
        // Không cần thay đổi icon ở chế độ này
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        // Thay đổi toàn bộ nội dung SVG
        repeatBtn.innerHTML = repeatOneIconSVG_HTML;
        showNotification("Lặp lại một bài");
    } else { // repeatMode === 'one'
        repeatMode = 'none';
        repeatBtn.classList.remove('active');
        // Trả lại icon mặc định
        repeatBtn.innerHTML = repeatIconSVG_HTML;
        showNotification("Đã tắt lặp lại");
    }
});

    // Listener cho Audio Element
    audioPlayer.addEventListener('play', () => updatePlayPauseIcon(true));
    audioPlayer.addEventListener('pause', () => updatePlayPauseIcon(false));
    audioPlayer.addEventListener('error', (e) => {
        console.error("Lỗi Audio Element:", audioPlayer.error);
        nowPlayingTitle.textContent = "Lỗi tải nhạc";
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        progressBar.max = audioPlayer.duration || 0;
        totalTimeEl.textContent = window.formatTime(audioPlayer.duration || 0);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        progressBar.value = audioPlayer.currentTime || 0;
        currentTimeEl.textContent = window.formatTime(audioPlayer.currentTime || 0);
    });

    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            playSongByIndex(currentIndex);
        } else {
            if (!isShuffle && repeatMode === 'none' && currentIndex === currentQueue.length - 1) {
                updatePlayPauseIcon(false);
                progressBar.value = progressBar.max;
                return;
            }
            playNext();
        }
    });

    // Listener cho các thanh trượt
    progressBar.addEventListener('input', () => {
        if (audioPlayer.src) audioPlayer.currentTime = progressBar.value;
    });

    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value / 100;
    });
    audioPlayer.volume = volumeBar.value / 100;


    // --- LOGIC SIDEBAR TOGGLE (GIỮ NGUYÊN) ---
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            sidebar.classList.toggle('active');
            toggleSidebarOverlay(sidebar.classList.contains('active'));
        });
    }

    document.addEventListener('click', (event) => {
        if (sidebar && sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggleBtn) {
            sidebar.classList.remove('active');
            toggleSidebarOverlay(false);
        }
    });

    function toggleSidebarOverlay(show) {
        let overlay = document.querySelector('.sidebar-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('sidebar-overlay');
                overlay.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 999;`;
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => {
                    if (sidebar) sidebar.classList.remove('active');
                    toggleSidebarOverlay(false);
                });
            }
        } else {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }
    }
    
    console.log("Player DOMContentLoaded End");
});

console.log("player.js loaded");