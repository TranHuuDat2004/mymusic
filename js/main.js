// main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main DOMContentLoaded Start");

    const mainMusicContainer = document.getElementById('main-music-content');
    const playlistUl = document.getElementById('playlist-links-list');

    // --- Render các section nhạc từ dữ liệu ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && mainMusicContainer) {
        // ... (Code renderMusicSections của bạn, đảm bảo nó dùng window.createSongCard) ...
        renderMusicSections(ALL_MUSIC_SECTIONS, mainMusicContainer);
    } else {
        console.error("Không tìm thấy dữ liệu ALL_MUSIC_SECTIONS hoặc container chính.");
    }

    // --- Tạo link playlist động trong sidebar (Gọi hàm từ utils.js) ---
    if (typeof ALL_MUSIC_SECTIONS !== 'undefined' && playlistUl && typeof window.renderPlaylistLinks === 'function') {
        window.renderPlaylistLinks(ALL_MUSIC_SECTIONS, playlistUl);

        // Gắn listener cho smooth scroll SAU KHI TẠO LINK (Gọi hàm từ utils.js)
        if (typeof window.attachSmoothScrollListeners === 'function') {
             // Chỉ gắn smooth scroll trên trang index vì nó có các section tương ứng
             window.attachSmoothScrollListeners('#playlist-links-list li a', '.main-content');
        } else {
             console.error("Hàm attachSmoothScrollListeners không tồn tại.");
        }

    } else {
         console.error("Lỗi: Không tìm thấy dữ liệu nhạc, ul playlist hoặc hàm renderPlaylistLinks.");
    }

    // --- Hàm render các section nhạc (vẫn cần ở đây vì nó đặc thù cho index.html) ---
     function renderMusicSections(sectionsData, containerElement) {
        // ... (Code hàm renderMusicSections như trước, gọi window.createSongCard) ...
        if (!containerElement || !sectionsData) return;

         // Xóa H1 cũ nếu cần
         const existingH1 = containerElement.querySelector('h1');
         if(existingH1) containerElement.removeChild(existingH1);

         // Render tiêu đề chào mừng
         const welcomeTitle = document.createElement('h1');
         welcomeTitle.textContent = 'Chào Trần Hữu Đạt'; // Hoặc lấy tên người dùng
         containerElement.appendChild(welcomeTitle);


        sectionsData.forEach(section => {
            const sectionElement = document.createElement('section');
            sectionElement.id = section.id; // Gán ID
            sectionElement.classList.add('content-section');

            const titleElement = document.createElement('h2');
            titleElement.textContent = section.title;

            const cardGridElement = document.createElement('div');
            cardGridElement.classList.add('card-grid');

            if (section.songs && section.songs.length > 0) {
                section.songs.forEach(song => {
                    if (typeof window.createSongCard === 'function') {
                        const card = window.createSongCard(song);
                        cardGridElement.appendChild(card);
                    } else {
                         console.error("Hàm createSongCard không tồn tại khi render section.");
                    }
                });
            } else {
                const noSongsMessage = document.createElement('p');
                noSongsMessage.textContent = 'Chưa có bài hát nào trong mục này.';
                cardGridElement.appendChild(noSongsMessage);
            }

            sectionElement.appendChild(titleElement);
            sectionElement.appendChild(cardGridElement);
            containerElement.appendChild(sectionElement);
        });
     }
     

    console.log("Main DOMContentLoaded End");
});

console.log("main.js loaded"); // Để kiểm tra thứ tự load