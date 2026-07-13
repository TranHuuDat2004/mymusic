// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorBox = document.getElementById('error-box');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    if (!loginForm) {
        console.error("Không tìm thấy form đăng nhập.");
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn form tải lại trang theo cách mặc định

        // 1. Lấy dữ liệu từ các input
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // 2. Xóa thông báo lỗi cũ và vô hiệu hóa nút bấm
        errorBox.textContent = '';
        errorBox.style.display = 'none';
        submitButton.disabled = true;
        submitButton.textContent = 'ĐANG ĐĂNG NHẬP...';

        // 3. Kiểm tra dữ liệu phía client
        if (!email || !password) {
            showError('Vui lòng nhập đầy đủ email và mật khẩu.');
            return;
        }

        // 4. Gửi request đến API
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
            
            // Đọc dữ liệu JSON từ phản hồi
            const data = await response.json();

            // 5. Xử lý kết quả
            if (!response.ok) {
                // Nếu server trả về lỗi (ví dụ: status 401, 500)
                // `data.message` là thông báo lỗi từ backend
                throw new Error(data.message || 'Đã có lỗi không xác định xảy ra.');
            }
            
            // Đăng nhập thành công!
            console.log('Đăng nhập thành công:', data);

            // Lưu thông tin người dùng và token vào localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Chuyển hướng người dùng về trang chủ
            window.location.href = '/';

        } catch (error) {
            // Hiển thị lỗi bắt được từ `throw new Error`
            showError(error.message);
        }
    });

    // Hàm tiện ích để hiển thị lỗi và kích hoạt lại nút bấm
    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'ĐĂNG NHẬP';
    }
});