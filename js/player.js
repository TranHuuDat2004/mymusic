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

        // Tạm dừng bài hát hiện tại nếu đang phát bài khác
        // if (!audioPlayer.paused && currentSongSrc !== songData.src) {
        //     audioPlayer.pause();
        // }

        audioPlayer.src = songData.src;
        const playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Đang phát:", songData.title);
                // Cập nhật UI thanh player bar
                nowPlayingTitle.textContent = songData.title || "Không có tiêu đề";
                nowPlayingArtist.textContent = songData.artist || "Nghệ sĩ không xác định";
                nowPlayingArt.src = songData.art || "img/favicon.png"; // Ảnh mặc định
                currentSongSrc = songData.src;
                updatePlayPauseIcon(true);
            }).catch(error => {
                console.error(`Lỗi khi phát "${songData.title}":`, error);
                // Cập nhật UI báo lỗi
                nowPlayingTitle.textContent = "Lỗi phát nhạc";
                nowPlayingArtist.textContent = songData.title || "";
                nowPlayingArt.src = "img/favicon.png"; // Ảnh mặc định
                updatePlayPauseIcon(false);
            });
        }
    }

     // --- Hàm gắn listener cho card (expose ra global) ---
     function addCardClickListenerImplementation(cardElement) {
        if (!cardElement) return;
        // Gỡ listener cũ nếu có (đề phòng trường hợp gọi lại)
        // cardElement.removeEventListener('click', handleCardClick); // Cần lưu trữ hàm handle

        // Tạo hàm xử lý riêng để có thể gỡ nếu cần
        const handleCardClick = () => {
            const songData = {
                src: cardElement.dataset.src,
                title: cardElement.dataset.title,
                artist: cardElement.dataset.artist,
                art: cardElement.dataset.art
            };
            if (songData.src) {
                // Gọi hàm phát nhạc đã được expose
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

    // Nút Play/Pause chính
    mainPlayPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src) {
            console.log("Chưa có nhạc để phát/tạm dừng.");
            // Có thể thêm logic phát bài đầu tiên ở đây nếu muốn
            return;
        }
        if (audioPlayer.paused) {
            audioPlayer.play().catch(error => console.error("Lỗi khi play():", error));
        } else {
            audioPlayer.pause();
        }
        // Icon sẽ tự cập nhật qua event 'play'/'pause' của audioPlayer
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

    audioPlayer.addEventListener('ended', () => {
        updatePlayPauseIcon(false);
        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";
        // Logic phát bài tiếp theo có thể thêm ở đây
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
        if(audioPlayer.src && !isNaN(audioPlayer.duration)) { // Chỉ cho seek khi có nhạc và duration hợp lệ
             audioPlayer.currentTime = progressBar.value;
        }
    });

    // Thanh Volume
    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value / 100;
    });
    // Set initial volume
    audioPlayer.volume = volumeBar.value / 100;


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

    // Hàm quản lý overlay
    function toggleSidebarOverlay(show) {
        let overlay = document.querySelector('.sidebar-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('sidebar-overlay');
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 999; /* Dưới sidebar */
                `;
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => { // Click overlay để đóng sidebar
                    if(sidebar) sidebar.classList.remove('active');
                    toggleSidebarOverlay(false); // Gọi lại để xóa overlay
                });
            }
        } else {
            if (overlay) {
                 // **Sửa lỗi removeChild:** Kiểm tra trước khi xóa
                 if (overlay.parentNode === document.body) {
                     document.body.removeChild(overlay);
                 } else {
                     // console.warn("Overlay không phải là con của body khi cố gắng xóa.");
                 }
            }
        }
    }
     // --- SỬA LỖI removeChild TẠI ĐÂY ---
     // Tìm dòng 124 cũ của bạn và đảm bảo logic xóa overlay sử dụng hàm toggleSidebarOverlay(false)
     // hoặc kiểm tra trực tiếp như trong hàm toggleSidebarOverlay.

    console.log("Player DOMContentLoaded End"); // Kiểm tra
});

console.log("player.js loaded"); // Để kiểm tra thứ tự load