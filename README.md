# MyMusic Player v2.0.0

<p align="center">
  <img src="screenshot/logo.png" alt="MyMusic Player Logo" width="150"/>
</p>

<p align="center">
  <strong>Một trình phát nhạc trực tuyến hiện đại được xây dựng với Node.js, Express, MongoDB và EJS.</strong>
  <br>
  <em>A modern web-based music player built with Node.js, Express, MongoDB, and EJS.</em>
</p>

<p align="center">
  <a href="https://github.com/TranHuuDat2004/mymusic/stargazers"><img src="https://img.shields.io/github/stars/TranHuuDat2004/mymusic?style=for-the-badge&logo=github&color=1DB954" alt="Stars"></a>
  <a href="https://github.com/TranHuuDat2004/mymusic/network/members"><img src="https://img.shields.io/github/forks/TranHuuDat2004/mymusic?style=for-the-badge&logo=github&color=1DB954" alt="Forks"></a>
  <a href="https://github.com/TranHuuDat2004/mymusic/issues"><img src="https://img.shields.io/github/issues/TranHuuDat2004/mymusic?style=for-the-badge&logo=github&color=orange" alt="Issues"></a>
  <a href="https://github.com/TranHuuDat2004/mymusic/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TranHuuDat2004/mymusic?style=for-the-badge&color=blue" alt="License"></a>
</p>


---

<details>
<summary><strong>🇻🇳 Giới thiệu (Tiếng Việt)</strong></summary>

**MyMusic Player** là một ứng dụng web full-stack, đóng vai trò là một trình phát nhạc trực tuyến với giao diện hiện đại, lấy cảm hứng từ các nền tảng phổ biến như Spotify. Dự án này không chỉ là một sản phẩm để nghe nhạc mà còn là một minh chứng (proof-of-concept) về việc xây dựng một ứng dụng web hoàn chỉnh từ đầu đến cuối, bao gồm backend, database, API, và hệ thống xác thực người dùng.

### ✨ Tính năng nổi bật (v2.0.0)

- **Giao diện người dùng hiện đại:** Thiết kế đáp ứng (responsive), hoạt động mượt mà trên cả máy tính và thiết bị di động.
- **Trình phát nhạc đầy đủ chức năng:** Bao gồm phát/dừng, thanh tiến trình, điều chỉnh âm lượng, phát ngẫu nhiên (shuffle), và các chế độ lặp lại.
- **Quản lý dữ liệu động:** Toàn bộ bài hát, nghệ sĩ, và playlist được quản lý thông qua cơ sở dữ liệu MongoDB.
- **Hệ thống người dùng:**
  - Đăng ký và Đăng nhập tài khoản.
  - Mã hóa mật khẩu an toàn phía server.
  - Xác thực bằng JSON Web Tokens (JWT).
- **Cá nhân hóa:**
  - Tính năng "Bài hát đã thích".
  - Trang Cài đặt tài khoản cho phép đổi thông tin, avatar, và mật khẩu.
- **Tương tác động:** Tìm kiếm, thêm vào danh sách yêu thích, và các thao tác khác diễn ra nhanh chóng thông qua việc gọi API mà không cần tải lại trang.

### 🛠️ Công nghệ sử dụng

| Lĩnh vực      | Công nghệ                                 |
| :------------- | :---------------------------------------- |
| **Backend**    | Node.js, Express.js                       |
| **Database**   | MongoDB (với Mongoose ODM)                |
| **Frontend**   | HTML5, CSS3, JavaScript (ES6+)            |
| **View Engine**| EJS (Embedded JavaScript templating)      |
| **Xác thực**   | JSON Web Tokens (JWT), bcrypt.js          |
| **Upload File**| Multer                                    |
| **Môi trường** | dotenv, nodemon                           |

</details>

<br>

<details open>
<summary><strong>🇬🇧 / 🇺🇸 Introduction (English)</strong></summary>

**MyMusic Player** is a full-stack web application that serves as a modern online music player, with an interface inspired by popular platforms like Spotify. This project is not only a product for listening to music but also a proof-of-concept for building a complete web application from scratch, including a backend, database, API, and user authentication system.

### ✨ Key Features (v2.0.0)

- **Modern User Interface:** A responsive design that works smoothly on both desktop and mobile devices.
- **Fully-Functional Music Player:** Includes play/pause, progress bar, volume control, shuffle, and repeat modes.
- **Dynamic Data Management:** All songs, artists, and playlists are dynamically managed through a MongoDB database.
- **User System:**
  - Account Registration and Login.
  - Secure server-side password hashing.
  - Authentication using JSON Web Tokens (JWT).
- **Personalization:**
  - "Liked Songs" feature for each user.
  - Account Settings page to change profile information, avatar, and password.
- **Dynamic Interactions:** Searching, liking songs, and other actions are handled quickly via API calls without page reloads.

### 🛠️ Technology Stack

| Area           | Technologies                              |
| :------------- | :---------------------------------------- |
| **Backend**    | Node.js, Express.js                       |
| **Database**   | MongoDB (with Mongoose ODM)               |
| **Frontend**   | HTML5, CSS3, JavaScript (ES6+)            |
| **View Engine**| EJS (Embedded JavaScript templating)      |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js      |
| **File Uploads** | Multer                                    |
| **Environment**| dotenv, nodemon                           |

</details>

---

## 🚀 Bắt đầu (Getting Started)

<details>
<summary><strong>Click để xem hướng dẫn cài đặt (Click to view installation guide)</strong></summary>
<br>

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau.

### Điều kiện tiên quyết (Prerequisites)

- [Node.js](https://nodejs.org/) (phiên bản 16.x trở lên)
- [MongoDB](https://www.mongodb.com/try/download/community) (cài đặt cục bộ) hoặc một tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (khuyến khích)

### Cài đặt (Installation)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TranHuuDat2004/mymusic.git
    cd mymusic
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```
    *   Thay `your_mongodb_connection_string` bằng chuỗi kết nối MongoDB của bạn.
    *   Thay `your_super_secret_jwt_key` bằng một chuỗi bí mật dài và ngẫu nhiên.

4.  **Import initial data (Optional):**
    Nếu bạn muốn có sẵn dữ liệu nhạc, bạn có thể chạy script import.
    ```bash
    node importData.js
    ```

5.  **Start the server:**
    ```bash
    npm start
    ```
    Hoặc để chạy với nodemon cho việc phát triển:
    ```bash
    npm run dev
    ```

6.  Mở trình duyệt và truy cập `http://localhost:5001`.

</details>

---



### 🖼️ Screenshots

| **Card View** | **List View** |  **Playlist View**  |
| :---: | :---: |:---: |
| ![Card View](screenshot/card_view.jpg) | ![List View](screenshot/list_view.jpg) | ![Playlist View](screenshot/playlist_view.jpg) |
| **Card View (iPadOS)** | **Fullscreen Player** | **Media Session (iPadOS)** |
| ![Fullscreen View](screenshot/card_view_iPadOS.png) | ![Fullscreen View](screenshot/fullscreen_view.PNG)  | ![Media Session Widget](screenshot/media_session_view.png) |


## 📄 Giấy phép (License)

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a>
<br />
Tác phẩm này được cấp phép theo <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Giấy phép Quốc tế Creative Commons Ghi công - Phi thương mại 4.0</a>.

---

This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.

## 🤝 Đóng góp (Contributing)

Mọi đóng góp đều được chào đón! Nếu bạn muốn đóng góp cho dự án, vui lòng fork repository và tạo một Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### 🧑‍💻 Developer

This project was developed by **Trần Hữu Đạt**.

*   **GitHub Profile:** [@TranHuuDat2004](https://github.com/TranHuuDat2004)
*   **Portfolio:** [tranhuudat2004.github.io](https://tranhuudat2004.github.io/)

---

<p align="center">
  Thank you for taking the time to learn about MyMusic Player!
</p>