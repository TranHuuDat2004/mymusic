// js/footer.js (Phiên bản mới, được gọi theo yêu cầu)

function appendMainFooter() {
    // Tìm thẻ <main> trong trang hiện tại.
    const mainContentContainer = document.querySelector('.main-content');

    if (!mainContentContainer) {
        console.warn("Footer.js: Không tìm thấy thẻ <main> để chèn footer.");
        return;
    }
    
    // Nếu footer đã tồn tại, không chèn lại.
    if (mainContentContainer.querySelector('.main-content-footer')) {
        return;
    }

    const footerElement = document.createElement('footer');
    footerElement.classList.add('main-content-footer');
    
    // HTML của footer (giữ nguyên)
    footerElement.innerHTML = `
            <div class="footer-links-container">
            <div class="footer-column">
                <h4>Về MyMusic</h4>
                <ul>
                    <li><a href="about.html">Giới thiệu</a></li>
                    <li><a href="tutorial.html">Hướng dẫn sử dụng</a></li>
                    <li><a href="version.html">Lịch sử phiên bản</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Khám phá</h4>
                <ul>
                    <li><a href="library.html">Thư viện</a></li>
                    <li><a href="artists.html">Nghệ sĩ</a></li>
                    <li><a href="all_playlists.html">Tất cả Playlist</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Liên kết hữu ích</h4>
                <ul>
                    <li><a href="https://github.com/TranHuuDat2004/mymusic" target="_blank" rel="noopener noreferrer">Mã nguồn (GitHub)</a></li>
                    <li><a href="https://github.com/TranHuuDat2004/mymusic/issues">Báo cáo sự cố</a></li>
                </ul>
            </div>
            <div class="social-links-column">
                <!-- Thay # bằng link thật của bạn -->
                <a href="#" title="Instagram" class="social-icon">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.626c-3.141 0-3.483.011-4.71.069-2.734.124-3.877 1.267-3.999 3.999-.058 1.226-.069 1.565-.069 4.71s.011 3.483.069 4.71c.124 2.733 1.266 3.876 3.999 3.999 1.227.058 1.569.069 4.71.069s3.482-.011 4.71-.069c2.732-.123 3.876-1.266 3.999-3.999.058-1.226.069-1.565.069-4.71s-.011-3.483-.069-4.71c-.123-2.733-1.267-3.877-3.999-3.999-1.227-.058-1.569-.069-4.71-.069zM12 7.847a4.153 4.153 0 100 8.306 4.153 4.153 0 000-8.306zm0 6.68a2.527 2.527 0 110-5.054 2.527 2.527 0 010 5.054zm5.17-6.903a.96.96 0 100-1.92.96.96 0 000 1.92z"></path></svg>
                </a>
                <a href="#" title="Twitter" class="social-icon">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z"></path></svg>
                </a>
                <a href="#" title="Facebook" class="social-icon">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H6v4.44h3.5v12h5.5v-12h3.77l.22-4.44z"></path></svg>
                </a>
                <a href="#" title="GitHub" class="social-icon">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                </a>
                <a href="#" title="LinkedIn" class="social-icon">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.85 0-2.132 1.446-2.132 2.94v5.666H9.356V9.5h3.414v1.561h.048c.475-.896 1.635-1.842 3.365-1.842 3.605 0 4.27 2.373 4.27 5.457v6.776zM5.337 7.433c-1.144 0-2.063-.932-2.063-2.083 0-1.15.92-2.082 2.063-2.082 1.143 0 2.063.932 2.063 2.082 0 1.151-.92 2.083-2.063 2.083zm1.777 13.019H3.56V9.5h3.554v10.952zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg>
                </a>
            </div>
        </div>
        <hr class="footer-divider">
        <div class="footer-bottom">
            <div class="legal-links">
                <a href="legal.html">Pháp lý</a>
                <a href="privacy.html">Quyền riêng tư</a>
                <a href="cookie.html">Cookie</a>
            </div>
            <div class="copyright">
                <span>© ${new Date().getFullYear()} MyMusic by Tran Huu Dat</span>
            </div>
        </div>
    `; // Giữ nguyên nội dung HTML của footer
    
    // Chèn footer vào cuối cùng của thẻ <main>
    mainContentContainer.appendChild(footerElement);
}

// "Expose" hàm ra global scope để các file khác có thể gọi
window.appendMainFooter = appendMainFooter;