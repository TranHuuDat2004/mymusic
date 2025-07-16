// public/js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorBox = document.getElementById('error-box');
    const submitButton = registerForm.querySelector('button[type="submit"]');

    if (!registerForm) {
        console.error("Không tìm thấy form đăng ký.");
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn form tải lại trang theo cách mặc định

        // 1. Lấy dữ liệu từ các input
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 2. Xóa thông báo lỗi cũ và vô hiệu hóa nút bấm
        errorBox.textContent = '';
        errorBox.style.display = 'none';
        submitButton.disabled = true;
        submitButton.textContent = 'ĐANG XỬ LÝ...';

        // 3. Kiểm tra dữ liệu phía client
        if (!username || !email || !password || !confirmPassword) {
            showError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (password.length < 6) {
            showError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        // 4. Gửi request đến API
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
            });
            
            // Đọc dữ liệu JSON từ phản hồi
            const data = await response.json();

            // 5. Xử lý kết quả
            if (!response.ok) {
                // Nếu server trả về lỗi (ví dụ: status 400, 401, 500)
                // `data.message` là thông báo lỗi từ backend
                throw new Error(data.message || 'Đã có lỗi không xác định xảy ra.');
            }

            // Đăng ký thành công!
            console.log('Đăng ký thành công:', data);

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
        submitButton.textContent = 'ĐĂNG KÝ';
    }
});