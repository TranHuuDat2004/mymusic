// Bạn có thể lưu trữ nhiều nghệ sĩ ở đây dưới dạng một mảng hoặc object
const ALL_MOCK_ARTISTS = {
    "son-tung-mtp": {
        id: "son-tung-mtp",
        name: "Sơn Tùng M-TP",
        avatarUrl: "img/sontung.jpg", // Ảnh thật hơn
        bannerUrl: "img/sontung.jpg", // Ảnh thật hơn
        monthlyListeners: "5,678,910",
        bio: "Sơn Tùng M-TP là một ca sĩ, nhạc sĩ và diễn viên nổi tiếng người Việt Nam. Anh được biết đến với nhiều bản hit đình đám và phong cách âm nhạc độc đáo, có sức ảnh hưởng lớn trong giới trẻ.",
        isFollowing: false,
        popularSongs: [
            // Duration sẽ được lấy tự động
            { id: "st1", title: "Hãy Trao Cho Anh", plays: "250M", albumArt: "img/hay-trao-cho-anh.jpg", audioSrc: "audio/song1.mp3" },
            { id: "st2", title: "Nơi Này Có Anh", plays: "300M", albumArt: "https://i.scdn.co/image/ab67616d00001e0200f3f39d581e9f5f7254d85e", audioSrc: "audio/song2.mp3" },
            { id: "st3", title: "Lạc Trôi", plays: "280M", albumArt: "https://i.scdn.co/image/ab67616d00001e02e1c6c8e46f1c62a2c8a8c0dd", audioSrc: "audio/song3.mp3" },
            { id: "st4", title: "Muộn Rồi Mà Sao Còn", plays: "150M", albumArt: "https://i.scdn.co/image/ab67616d00001e028b4b079073d007599021973a", audioSrc: "audio/song1.mp3" },
            { id: "st5", title: "Chạy Ngay Đi", plays: "180M", albumArt: "https://i.scdn.co/image/ab67616d00001e02a188a215155230485091916b", audioSrc: "audio/song2.mp3" },
        ],
        albums: [
            { id: "album_sky", title: "Sky Decade", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d0000b2739fce1fee727103139699e10d", songs: [] }, // Placeholder art
            { id: "album_chungta", title: "Chúng Ta", year: "2020", artUrl: "https://i.scdn.co/image/ab67616d0000b273cc94f7a56d0e0884835b76f5", songs: [] }, // Placeholder art
        ],
        singles: [
            { id: "single_makingmyway", title: "Making My Way", year: "2023", artUrl: "https://i.scdn.co/image/ab67616d0000b27362c8a02e940cd758a6230a1a", audioSrc: "audio/song1.mp3" },
        ]
    },
    "jack": {
        id: "jack",
        name: "Jack - J97",
        avatarUrl: "img/jack_avatar.jpg", // Giả định
        bannerUrl: "img/jack_banner.jpg", // Giả định
        monthlyListeners: "3,450,200",
        bio: "Jack (J97), tên thật là Trịnh Trần Phương Tuấn, là một ca sĩ, nhạc sĩ và rapper người Việt Nam. Anh nổi tiếng với những ca khúc mang âm hưởng dân gian kết hợp hiện đại.",
        isFollowing: true, // Ví dụ
        popularSongs: [
            { id: "j1", title: "Sóng Gió", plays: "400M", albumArt: "https://i.scdn.co/image/ab67616d00001e02689810a3d5582610490f5468", audioSrc: "audio/jack_songgio.mp3" },
            { id: "j2", title: "Hồng Nhan", plays: "350M", albumArt: "https://i.scdn.co/image/ab67616d00001e02d79f3560f8310e41f81ebf7c", audioSrc: "audio/jack_hongnhan.mp3" },
            { id: "j3", title: "Là 1 Thằng Con Trai", plays: "200M", albumArt: "https://i.scdn.co/image/ab67616d00001e02f5163035c3bab7c5c264c240", audioSrc: "audio/jack_la1thangcontrai.mp3" },
            { id: "j4", title: "Hoa Hải Đường", plays: "180M", albumArt: "https://i.scdn.co/image/ab67616d00001e02c1a00a9f0a9e0a1b0a5c0a3e", audioSrc: "audio/jack_hoahaiduong.mp3" },
            { id: "j5", title: "Thiên Lý Ơi", plays: "50M", albumArt: "https://i.scdn.co/image/ab67616d00001e02478c2157c9809288261972d9", audioSrc: "audio/jack_thienlyoi.mp3" },
        ],
        albums: [
            { id: "album_j_noalbumyet", title: "Collection Hits", year: "2023", artUrl: "https://via.placeholder.com/200/FFCCAA/000?text=Jack+Hits", songs: [] },
        ],
        singles: [
            { id: "single_j_ngoidaykhoc", title: "Ngôi Sao Cô Đơn", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d00001e023066a7a6e4e8e46e8e0d6e6e", audioSrc: "audio/jack_ngoisaocodon.mp3" },
            { id: "single_j_cuoituan", title: "Cuối Cùng Thì", year: "2023", artUrl: "https://i.scdn.co/image/ab67616d00001e0211c72d03c4a37b52fa907b0e", audioSrc: "audio/jack_cuoicungthi.mp3" },
        ]
    },

    "nal": {
        id: "nal",
        name: "Nal",
        avatarUrl: "img/nal_avatar.jpg", // Giả định
        bannerUrl: "img/nal_banner.jpg", // Giả định
        monthlyListeners: "2,100,500",
        bio: "Nal, tên thật là Hồ Phi Nal, là một ca sĩ trẻ nổi lên từ các ca khúc mang giai điệu bắt tai, gần gũi và lời ca mộc mạc, thường được lan truyền rộng rãi trên mạng xã hội.",
        isFollowing: false,
        popularSongs: [
            { id: "n1", title: "Rồi Tới Luôn", plays: "150M", albumArt: "https://i.scdn.co/image/ab67616d00001e0212f9535a7840990f62b49f49", audioSrc: "audio/nal_roitoiluon.mp3" },
            { id: "n2", title: "Thương Nhau Tới Bến", plays: "80M", albumArt: "https://i.scdn.co/image/ab67616d00001e02f9c0b5e0a8d8c0a0c0b0c0b0", audioSrc: "audio/nal_thuongnhautoiben.mp3" }, // Placeholder art
            { id: "n3", title: "Yêu Là Cưới", plays: "70M", albumArt: "https://i.scdn.co/image/ab67616d00001e02a0a0a0a0a0a0a0a0a0a0a0a0", audioSrc: "audio/nal_yeulacuoi.mp3" }, // Placeholder art
            { id: "n4", title: "Ghệ Đẹp", plays: "60M", albumArt: "https://via.placeholder.com/40/EEEEEE/000?text=GD", audioSrc: "audio/nal_ghedep.mp3" },
        ],
        albums: [], // Nal thường ra single
        singles: [
            { id: "single_n_dongtienthaylong", title: "Đồng Tiền Thay Lòng", year: "2022", artUrl: "https://via.placeholder.com/200/ABCDEF/000?text=DTTL", audioSrc: "audio/nal_dongtienthaylong.mp3" },
            { id: "single_n_codonquadenoi", title: "Cô Đơn Quá Để Nói", year: "2023", artUrl: "https://via.placeholder.com/200/FEDCBA/000?text=CDQDN", audioSrc: "audio/nal_codonquadenoi.mp3" },
        ]
    },

    "hoangthuyLinh": {
        id: "hoangthuylinh",
        name: "Hoàng Thuỳ Linh",
        avatarUrl: "img/htl_avatar.jpg", // Giả định
        bannerUrl: "img/htl_banner.jpg", // Giả định
        monthlyListeners: "4,200,800",
        bio: "Hoàng Thuỳ Linh là một nữ ca sĩ và diễn viên người Việt Nam. Âm nhạc của cô mang đậm màu sắc văn hóa dân gian đương đại, với nhiều MV được đầu tư công phu và ý nghĩa.",
        isFollowing: true,
        popularSongs: [
            { id: "htl1", title: "See Tình", plays: "220M", albumArt: "https://i.scdn.co/image/ab67616d00001e02293b8c062a9e6c0f8a2d8c1e", audioSrc: "audio/htl_seetinh.mp3" },
            { id: "htl2", title: "Để Mị Nói Cho Mà Nghe", plays: "180M", albumArt: "https://i.scdn.co/image/ab67616d00001e028f8f8f8f8f8f8f8f8f8f8f8f", audioSrc: "audio/htl_deminoichomanghe.mp3" }, // Placeholder art
            { id: "htl3", title: "Kẻ Cắp Gặp Bà Già", plays: "150M", albumArt: "https://i.scdn.co/image/ab67616d00001e02c0c0c0c0c0c0c0c0c0c0c0c0", audioSrc: "audio/htl_kecapgapbagia.mp3" }, // Placeholder art
            { id: "htl4", title: "Bo Xì Bo", plays: "100M", albumArt: "https://i.scdn.co/image/ab67616d00001e02d0d0d0d0d0d0d0d0d0d0d0d0", audioSrc: "audio/htl_boxibo.mp3" }, // Placeholder art
        ],
        albums: [
            { id: "album_htl_link", title: "LINK", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d0000b273293b8c062a9e6c0f8a2d8c1e", songs: [] },
            { id: "album_htl_hoang", title: "Hoàng", year: "2019", artUrl: "https://i.scdn.co/image/ab67616d0000b273e0e0e0e0e0e0e0e0e0e0e0e0", songs: [] }, // Placeholder art
        ],
        singles: [
             { id: "single_htl_gieoque", title: "Gieo Quẻ", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d00001e02b1b1b1b1b1b1b1b1b1b1b1b1", audioSrc: "audio/htl_gieoque.mp3" }, // Placeholder art
        ]
    },
    "MahiruShiina": {
        id: "MahiruShiina",
        name: "Shinna Mahiru",
        avatarUrl: "img/mahiru4.png", // Giả định
        bannerUrl: "img/mahiru1.png", // Giả định
        monthlyListeners: "1,200,800",
        bio: "Shinna Mahiru là một ca sĩ và nhạc sĩ nổi tiếng trong cộng đồng âm nhạc Nhật Bản. Cô được biết đến với giọng hát ngọt ngào và phong cách âm nhạc độc đáo.",
        isFollowing: true,
        popularSongs: [
            { id: "mahiru1", title: "小さな恋のうた", plays: "220M", albumArt: "img/mahiru1.png", audioSrc: "audio/mahiru_ed1.mp3" },
            { id: "mahiru2", title: "愛唄", plays: "180M", albumArt: "img/mahiru2.png", audioSrc: "audio/mahiru_ed2.mp3" }, // Placeholder art
            { id: "mahiru3", title: "君に届け", plays: "150M", albumArt: "img/mahiru3.png", audioSrc: "audio/mahiru_ed3.mp3" }, // Placeholder art
            { id: "mahiru4", title: "君に届け - Instrumental", plays: "100M", albumArt: "img/mahiru4.png", audioSrc: "audio/mahiru_ed3_Instrumental.mp3" }, // Placeholder art
            { id: "mahiru5", title: "ギフト - Pf Solo ver.", plays: "100M", albumArt: "img/mahiru_gift.png", audioSrc: "audio/mahiru_gift.mp3" }, // Placeholder art
        ],
        albums: [
            { id: "album_htl_link", title: "LINK", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d0000b273293b8c062a9e6c0f8a2d8c1e", songs: [] },
            { id: "album_htl_hoang", title: "Hoàng", year: "2019", artUrl: "https://i.scdn.co/image/ab67616d0000b273e0e0e0e0e0e0e0e0e0e0e0e0", songs: [] }, // Placeholder art
        ],
        singles: [
             { id: "single_htl_gieoque", title: "Gieo Quẻ", year: "2022", artUrl: "https://i.scdn.co/image/ab67616d00001e02b1b1b1b1b1b1b1b1b1b1b1b1", audioSrc: "audio/htl_gieoque.mp3" }, // Placeholder art
        ]
    }
    // Thêm các nghệ sĩ khác ở đây với key là artistId
};

