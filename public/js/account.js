// public/js/account.js
document.addEventListener('DOMContentLoaded', () => {
    // --- KHAI BÁO BIẾN ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.account-content');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // --- BẢO VỆ ROUTE PHÍA CLIENT ---
    if (!userInfo || !userInfo.token) {
        window.location.href = '/login';
        return;
    }

    // --- LOGIC CHUYỂN TAB ---
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;

            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    // --- THÊM ĐOẠN NÀY ĐỂ ĐỌC HASH KHI TẢI TRANG ---
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) {
        const activeLink = document.querySelector(`.tab-link[data-tab="${currentHash}"]`);
        if (activeLink) {
            // Dùng .click() để kích hoạt cả logic thêm/xóa class 'active'
            activeLink.click();
        }
    }
    // --- KẾT THÚC PHẦN THÊM ---

    const accountForm = document.getElementById('account-form');



    const usernameInput = accountForm.querySelector('input[name="username"]');
    const emailInput = accountForm.querySelector('input[name="email"]');
    const userIdInput = document.getElementById('user-id-display'); // Thêm ID này vào EJS

    // --- BƯỚC 1: BẢO VỆ PHÍA CLIENT ---
    if (!userInfo || !userInfo.token) {
        // Nếu không có thông tin đăng nhập, không cho vào trang này
        window.location.href = '/login';
        return; // Dừng thực thi script
    }

    // --- BƯỚC 2: TẢI THÔNG TIN USER TỪ API ---
    async function fetchUserProfile() {
        try {
            // Gọi API mới để lấy profile
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            if (!response.ok) throw new Error('Không thể tải thông tin tài khoản.');

            const user = await response.json();

            // Điền thông tin vào form
            userIdInput.value = user._id;
            usernameInput.value = user.username;
            emailInput.value = user.email;

        } catch (error) {
            console.error("Lỗi tải profile:", error);
            // Có thể hiển thị lỗi trên trang
        }
    }

    // Gọi hàm tải profile ngay khi vào trang
    fetchUserProfile();

    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = accountForm.querySelector('input[name="username"]').value;
        const email = accountForm.querySelector('input[name="email"]').value;
        const submitButton = accountForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = 'Đang lưu...';

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
            window.showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", 'error');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ username, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Cập nhật thất bại.');
            }

            // Cập nhật thành công!
            window.showNotification('Cập nhật thông tin thành công!');

            // Cập nhật lại thông tin trong localStorage
            userInfo.username = data.username;
            userInfo.email = data.email;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Tải lại trang để sidebar cập nhật tên mới
            window.location.reload();

        } catch (error) {
            window.showNotification(`Lỗi: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Lưu thay đổi';
        }
    });

    // =======================================================
    // === BẮT ĐẦU: LOGIC CHO TAB ĐỔI AVATAR (HOÀN CHỈNH) ===
    // =======================================================
    const avatarForm = document.getElementById('avatar-form');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarFileInput = avatarForm.querySelector('input[type="file"]');
    const defaultAvatars = avatarForm.querySelectorAll('.default-avatars img');
    const defaultAvatarPathInput = avatarForm.querySelector('input[name="defaultAvatarPath"]');

    avatarFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => { avatarPreview.src = event.target.result; }
            reader.readAsDataURL(file);
            defaultAvatarPathInput.value = '';
            defaultAvatars.forEach(img => img.classList.remove('selected'));
        }
    });

    defaultAvatars.forEach(img => {
        img.addEventListener('click', () => {
            defaultAvatars.forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
            avatarPreview.src = img.src;
            defaultAvatarPathInput.value = img.dataset.path;
            avatarFileInput.value = '';
        });
    });

    avatarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = avatarForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Đang lưu...';

        const formData = new FormData(avatarForm);

        try {
            const response = await fetch('/api/user/change-avatar', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: formData
            });

            // Luôn đọc response dưới dạng JSON
            const data = await response.json();

            // Kiểm tra response.ok SAU KHI đã đọc json
            if (!response.ok) {
                // data.message là thông báo lỗi từ backend
                throw new Error(data.message || 'Cập nhật avatar thất bại.');
            }

            // Cập nhật thành công!
            // Cập nhật thành công!
            window.showNotification(data.message);

            // --- BẮT ĐẦU THAY ĐỔI QUAN TRỌNG ---

            // 1. Cập nhật lại ảnh trên sidebar ngay lập tức (bạn đã có)
            const sidebarAvatar = document.querySelector('.sidebar-profile .profile-avatar');
            if (sidebarAvatar) {
                sidebarAvatar.src = `/${data.avatarUrl}`;
            }

            // 2. Cập nhật lại object userInfo trong localStorage
            // Lấy lại userInfo từ localStorage để đảm bảo nó là mới nhất
            const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (currentUserInfo) {
                // Cập nhật trường avatarUrl
                currentUserInfo.avatarUrl = data.avatarUrl;
                // Lưu lại vào localStorage
                localStorage.setItem('userInfo', JSON.stringify(currentUserInfo));
                console.log("localStorage đã được cập nhật với avatar mới.");
            }

            // --- KẾT THÚC THAY ĐỔI QUAN TRỌNG ---


        } catch (error) {
            // KHỐI CATCH ĐÚNG SẼ NHƯ THẾ NÀY:
            console.error("Lỗi phía client khi đổi avatar:", error);
            window.showNotification(`Lỗi: ${error.message}`, `error`); // Chỉ dùng alert hoặc các hàm của client
            // TUYỆT ĐỐI KHÔNG CÓ `res.status(...)` ở đây
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Lưu Avatar';
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            window.showNotification(data.message);

            // --- BƯỚC QUAN TRỌNG ĐỂ ĐỒNG BỘ ---
            // Cập nhật lại userInfo trong localStorage với đường dẫn avatar mới
            userInfo.avatarUrl = data.avatarUrl;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Tải lại trang để sidebar đọc thông tin mới và hiển thị avatar mới
            window.location.reload();
        }
    });
    // =====================================================
    // === KẾT THÚC: LOGIC CHO TAB ĐỔI AVATAR ===
    // =====================================================


    // --- XỬ LÝ FORM ĐỔI MẬT KHẨU (HOÀN CHỈNH) ---
    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = passwordForm.querySelector('button[type="submit"]');

        const currentPassword = passwordForm.querySelector('input[name="currentPassword"]').value;
        const newPassword = passwordForm.querySelector('input[name="newPassword"]').value;
        const confirmNewPassword = passwordForm.querySelector('input[name="confirmNewPassword"]').value;

        if (newPassword !== confirmNewPassword) {
            window.showNotification('Mật khẩu mới không khớp!', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Đang đổi...';

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            window.showNotification(data.message);
            passwordForm.reset(); // Xóa các ô input sau khi đổi thành công

        } catch (error) {
            window.showNotification(`Lỗi: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Đổi Mật khẩu';
        }
    });


});