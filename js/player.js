// player.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Player DOMContentLoaded Start"); // Kiểm tra

    // Lấy các phần tử DOM cốt lõi của player
    const audioPlayer = document.getElementById('audio-player');
    const mainPlayPauseBtn = document.getElementById('main-play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const volumeBar = document.getElementById('volume-bar');
    const nowPlayingArt = document.getElementById('now-playing-art');
    const nowPlayingTitle = document.getElementById('now-playing-title');
    const nowPlayingArtist = document.getElementById('now-playing-artist');

    // Kiểm tra xem các phần tử player có tồn tại không
    if (!audioPlayer || !mainPlayPauseBtn || !progressBar || !currentTimeEl || !totalTimeEl || !volumeBar || !nowPlayingArt || !nowPlayingTitle || !nowPlayingArtist) {
        console.error("Lỗi: Một hoặc nhiều phần tử DOM của player không tìm thấy!");
        return; // Không thể tiếp tục nếu thiếu phần tử cốt lõi
    }

    const playIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-play"><path d="M8 5v14l11-7z"></path></svg>';
    const pauseIconSVG = '<svg viewBox="0 0 24 24" width="24" height="24" class="icon-pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';

    let currentSongSrc = null; // Theo dõi bài hát hiện tại

    // --- BẮT ĐẦU: Logic phát ngẫu nhiên khi hết bài ---

    // 1. Tạo một danh sách phẳng chứa tất cả các bài hát từ ALL_MUSIC_SECTIONS
    let allSongsFlat = [];
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && Array.isArray(ALL_MUSIC_SECTIONS)) {
        allSongsFlat = ALL_MUSIC_SECTIONS.flatMap(section => section.songs);
        console.log(`Đã tải ${allSongsFlat.length} bài hát để phát ngẫu nhiên.`);
    } else {
        console.error("Biến ALL_MUSIC_SECTIONS không tồn tại hoặc không phải là một mảng. Hãy đảm bảo file data/music.js được tải trước player.js.");
    }

    // 2. Hàm để chọn và phát bài hát ngẫu nhiên tiếp theo
    function playNextRandomSong() {
        if (allSongsFlat.length === 0) {
            console.warn("Không có bài hát nào để phát tiếp theo.");
            updatePlayPauseIcon(false); // Dừng lại nếu không có bài hát
            return;
        }

        let nextSong;
        // Nếu có nhiều hơn 1 bài, đảm bảo không phát lại bài cũ
        if (allSongsFlat.length > 1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * allSongsFlat.length);
                nextSong = allSongsFlat[randomIndex];
            } while (nextSong.audioSrc === currentSongSrc);
        } else {
            // Nếu chỉ có 1 bài, phát lại chính nó
            nextSong = allSongsFlat[0];
        }

        // 3. Chuẩn bị dữ liệu và gọi hàm phát nhạc
        const songDataToPlay = {
            src: nextSong.audioSrc,
            title: nextSong.title,
            artist: nextSong.artistData, // Lấy từ artistData
            art: nextSong.artUrl
        };

        playSongImplementation(songDataToPlay);
    }

    // --- KẾT THÚC: Logic phát ngẫu nhiên khi hết bài ---


    // --- Các hàm xử lý Player ---

    function updatePlayPauseIcon(isPlaying) {
        mainPlayPauseBtn.innerHTML = isPlaying ? pauseIconSVG : playIconSVG;
        mainPlayPauseBtn.title = isPlaying ? "Tạm dừng" : "Phát";
    }

    function playSongImplementation(songData) {
        if (!songData || !songData.src) {
            console.warn("Dữ liệu bài hát không hợp lệ hoặc thiếu src.");
            return;
        }
        console.log("Chuẩn bị phát:", songData);

        audioPlayer.src = songData.src;
        const playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Đang phát:", songData.title);
                // Cập nhật UI thanh player bar
                nowPlayingTitle.textContent = songData.title || "Không có tiêu đề";
                nowPlayingArtist.textContent = songData.artist || "Nghệ sĩ không xác định";
                nowPlayingArt.src = songData.art || "img/favicon.png"; // Ảnh mặc định
                currentSongSrc = songData.src; // Cập nhật bài hát hiện tại
                updatePlayPauseIcon(true);
            }).catch(error => {
                console.error(`Lỗi khi phát "${songData.title}":`, error);
                // Cập nhật UI báo lỗi
                nowPlayingTitle.textContent = "Đang tải nhạc";
                nowPlayingArtist.textContent = songData.title || "";
                nowPlayingArt.src = "img/favicon.png"; // Ảnh mặc định
                updatePlayPauseIcon(false);
            });
        }
    }

     // --- Hàm gắn listener cho card (expose ra global) ---
     function addCardClickListenerImplementation(cardElement) {
        if (!cardElement) return;

        const handleCardClick = () => {
            const songData = {
                src: cardElement.dataset.src,
                title: cardElement.dataset.title,
                artist: cardElement.dataset.artist,
                art: cardElement.dataset.art
            };
            if (songData.src) {
                window.playSongFromData(songData);
            } else {
                console.warn("Card này không có data-src để phát.");
            }
        };
        cardElement.addEventListener('click', handleCardClick);
    }

    // --- EXPOSE CÁC HÀM RA GLOBAL ---
    window.playSongFromData = playSongImplementation;
    window.addCardClickListener = addCardClickListenerImplementation;
    //------------------------------------

    // --- Gắn các listener cho Player Controls ---

    mainPlayPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src) {
            console.log("Chưa có nhạc, sẽ phát một bài ngẫu nhiên.");
            playNextRandomSong(); // Nếu chưa có nhạc, nhấn play sẽ phát bài ngẫu nhiên đầu tiên
            return;
        }
        if (audioPlayer.paused) {
            audioPlayer.play().catch(error => console.error("Lỗi khi play():", error));
        } else {
            audioPlayer.pause();
        }
    });

    // Sự kiện của Audio Element
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            progressBar.max = audioPlayer.duration;
            totalTimeEl.textContent = window.formatTime(audioPlayer.duration); // Dùng hàm global từ utils.js
        } else {
             totalTimeEl.textContent = "N/A";
        }
         progressBar.value = 0; // Reset progress bar
         currentTimeEl.textContent = "0:00";
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.currentTime)) {
             progressBar.value = audioPlayer.currentTime;
             currentTimeEl.textContent = window.formatTime(audioPlayer.currentTime); // Dùng hàm global từ utils.js
        }
    });

    audioPlayer.addEventListener('play', () => {
        updatePlayPauseIcon(true);
    });

    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseIcon(false);
    });

    // THAY ĐỔI TẠI ĐÂY: Sửa lại sự kiện 'ended'
    audioPlayer.addEventListener('ended', () => {
        console.log("Bài hát kết thúc. Tự động phát bài ngẫu nhiên tiếp theo...");
        playNextRandomSong(); // Gọi hàm phát ngẫu nhiên
    });

    audioPlayer.addEventListener('error', (e) => {
         console.error("Lỗi Audio Element:", audioPlayer.error);
         nowPlayingTitle.textContent = "Lỗi tải nhạc";
         nowPlayingArtist.textContent = "";
         nowPlayingArt.src = "img/favicon.png";
         updatePlayPauseIcon(false);
    });


    // Thanh Progress
    progressBar.addEventListener('input', () => {
        if(audioPlayer.src && !isNaN(audioPlayer.duration)) {
             audioPlayer.currentTime = progressBar.value;
        }
    });

    // Thanh Volume
    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value / 100;
    });
    audioPlayer.volume = volumeBar.value / 100;


    // --- Logic Sidebar Toggle (Giữ nguyên) ---
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
        if (sidebar && sidebar.classList.contains('active') &&
            !sidebar.contains(event.target) &&
            event.target !== menuToggleBtn) {
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
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 999;
                `;
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => {
                    if(sidebar) sidebar.classList.remove('active');
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