// js/version.js

document.addEventListener('DOMContentLoaded', () => {
    // Vùng chứa để hiển thị lịch sử commit
    const container = document.getElementById('commit-history-container');
    
    // Kiểm tra xem container có tồn tại không
    if (!container) {
        console.error("Không tìm thấy #commit-history-container.");
        return;
    }

    // URL của GitHub API cho repo của bạn
    const owner = 'TranHuuDat2004';
    const repo = 'mymusic';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

    // Hàm để định dạng ngày tháng cho dễ đọc (ví dụ: "Ngày 27 tháng 10 năm 2023")
    function formatDate(isoString) {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'full',
            timeStyle: 'medium'
        }).format(date);
    }

    // Hàm bất đồng bộ để fetch dữ liệu
    async function fetchCommits() {
        try {
            // Gọi API
            const response = await fetch(apiUrl);

            // Xử lý lỗi nếu API không trả về thành công (ví dụ: repo không tồn tại, hết lượt truy cập API)
            if (!response.ok) {
                throw new Error(`Lỗi từ GitHub API: ${response.status} ${response.statusText}`);
            }

            // Chuyển đổi response sang JSON
            const commits = await response.json();

            // Xóa thông báo "Đang tải..."
            container.innerHTML = '';
            
            if (commits.length === 0) {
                 container.innerHTML = '<p>Không tìm thấy commit nào.</p>';
                 return;
            }

            // Lặp qua mỗi commit và tạo HTML
            commits.forEach(commitData => {
                const { commit, html_url, author } = commitData;

                // Tách message thành title và body (nếu có)
                const messageParts = commit.message.split('\n\n');
                const title = messageParts[0];
                const body = messageParts.slice(1).join('\n\n');

                // Tạo một card cho mỗi commit
                const commitEntry = document.createElement('div');
                commitEntry.className = 'commit-entry';

                // Tạo tiêu đề (thông điệp commit)
                const commitTitle = document.createElement('h3');
                commitTitle.textContent = title;

                // Tạo thông tin tác giả và ngày tháng
                const commitMeta = document.createElement('p');
                commitMeta.className = 'commit-meta';
                commitMeta.innerHTML = `
                    bởi <strong>${commit.author.name}</strong> vào ${formatDate(commit.author.date)}
                `;

                // Tạo phần body của commit (nếu có)
                let commitBody = null;
                if (body) {
                    commitBody = document.createElement('pre');
                    commitBody.className = 'commit-body';
                    commitBody.textContent = body;
                }

                // Tạo link để xem chi tiết trên GitHub
                const commitLink = document.createElement('a');
                commitLink.href = html_url;
                commitLink.textContent = 'Xem chi tiết trên GitHub';
                commitLink.target = '_blank'; // Mở trong tab mới
                commitLink.rel = 'noopener noreferrer';
                commitLink.className = 'commit-link';

                // Gắn các phần tử con vào card
                commitEntry.appendChild(commitTitle);
                commitEntry.appendChild(commitMeta);
                if (commitBody) {
                    commitEntry.appendChild(commitBody);
                }
                commitEntry.appendChild(commitLink);

                // Gắn card commit vào container chính
                container.appendChild(commitEntry);
            });

        } catch (error) {
            console.error('Không thể fetch commit từ GitHub:', error);
            container.innerHTML = `<p class="error-message">Đã xảy ra lỗi khi tải lịch sử phiên bản. Vui lòng thử lại sau. <br><small>${error.message}</small></p>`;
        }
    }

    // Gọi hàm để bắt đầu fetch
    fetchCommits();
});