// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Vui lòng nhập tên người dùng'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Vui lòng nhập một địa chỉ email hợp lệ']
    },
    // --- BẮT ĐẦU THÊM MỚI ---
    avatarUrl: {
        type: String,
        default: 'img/avatar.png' // Đặt một ảnh đại diện mặc định
    },

    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    // Thêm các trường khác nếu bạn muốn, ví dụ:
    // avatarUrl: { type: String, default: 'img/default-avatar.png' },
    // likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    // playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
     // --- THÊM TRƯỜNG MỚI ---
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song' // Tham chiếu đến model 'Song'
    }],
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Middleware: Mã hóa mật khẩu TRƯỚC KHI lưu vào DB
userSchema.pre('save', async function(next) {
    // Chỉ chạy hàm này nếu mật khẩu đã được thay đổi (hoặc là người dùng mới)
    if (!this.isModified('password')) {
        return next();
    }
    // "Salt" là một chuỗi ngẫu nhiên để tăng cường bảo mật, 12 là độ phức tạp
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Thêm một method vào model để so sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);