// data/music.js

const ALL_MUSIC_SECTIONS = [
    {
        id: "Vpop",
        title: "Nhạc Việt Nam",
        songs: [
            // {
            //     id: "fav1",
            //     title: "Bạc Phận",
            //     artistData: "Jack, K-ICM",
            //     displayArtist: { name: "Jack, K-ICM", id: "jack" },
            //     artUrl: "img/bac-phan.jpg",
            //     audioSrc: "audio/bac-phan.mp3",
            //     isFavorite: true,
            //     plays: "416.583.209" // Giữ lại giá trị cũ nếu bạn thích
            // },
            // {
            //     id: "fav2",
            //     title: "Sóng Gió",
            //     artistData: "Jack, K-ICM",
            //     displayArtist: { name: "Jack, K-ICM", id: "jack" },
            //     artUrl: "img/song-gio.png",
            //     audioSrc: "audio/song-gio.mp3",
            //     isFavorite: true,
            //     plays: "550.123.456" // Random
            // },
            {
                id: "fav3",
                title: "Thay Lòng",
                artistData: "Nal",
                displayArtist: { name: "Nal", id: "nal" },
                artUrl: "img/nal.png",
                audioSrc: "audio/thay-long-nal.mp3",
                isFavorite: false, // Ví dụ
                plays: "40.789.123" // Random
            },
            {
                id: "fav4",
                title: "Making My Way",
                artistData: "Sơn Tùng M-TP",
                displayArtist: { name: "Sơn Tùng MTP", id: "son-tung-mtp" },
                artUrl: "img/making-my-way.jpg",
                audioSrc: "audio/making-my-way.mp3",
                isFavorite: false, // Ví dụ
                plays: "85.321.678" // Random
            }

        ]
    },
    {
        id: "VpopRemix",
        title: "Nhạc Remix Cực Căng",
        songs: [

            {
                id: "fav5",
                title: "Tái Sinh Remix",
                artistData: "Tùng Dương",
                displayArtist: { name: "Tùng Dương", id: "tung-duong" },
                artUrl: "img/tai-sinh-remix.webp",
                audioSrc: "audio/tai-sinh-remix.mp3",
                isFavorite: false, // Ví dụ
                plays: "8.321.678" // Random
            },
            {
                id: "fav6",
                title: "Ải hồng nhan Remix",
                artistData: "Cần Vinh, Lee Ken",
                displayArtist: { name: "Cần Vinh, Lee Ken", id: "can-vinh" },
                artUrl: "img/ai-hong-nhan.jpg",
                audioSrc: "audio/ai-hong-nhan-remix.mp3",
                isFavorite: false, // Ví dụ
                plays: "8.456.798" // Random
            },
            {
                id: "fav7",
                title: "Nên Chờ Hay Nên Quên Remix",
                artistData: "Cần Vinh, Lee Ken",
                displayArtist: { name: "Chu Thúy Quỳnh", id: "chu-thuy-quynh" },
                artUrl: "img/Nên Chờ Hay Nên Quên Remix.png",
                audioSrc: "audio/Nên Chờ Hay Nên Quên Remix.mp3",
                isFavorite: false, // Ví dụ
                plays: "2.456.789" // Random
            },
            {
                id: "vpop_trucxinh",
                title: "Trúc Xinh",
                artistData: "Minh Vương M4U ft. Việt (ACV Remix)",
                displayArtist: { name: "Minh Vương M4U ft. Việt", id: "minhvuong-m4u-viet" },
                artUrl: "img/Trúc xinh.png", // Tên file từ ảnh bạn cung cấp
                audioSrc: "audio/Trúc xinh.mp3", // Tên file MP3 tương ứng
                isFavorite: false,
                plays: "1.234.567"
            },
            {
                id: "vpop_tralaithanhxuan",
                title: "Trả Lại Thanh Xuân Cho Em",
                artistData: "H2K (H2O Remix)",
                displayArtist: { name: "H2K", id: "h2k" },
                artUrl: "img/Trả Lại Thanh Xuân Cho Em.png",
                audioSrc: "audio/Trả Lại Thanh Xuân Cho Em.mp3",
                isFavorite: false,
                plays: "2.345.678"
            },
            {
                id: "vpop_ruoumung",
                title: "Rượu Mừng Hóa Người Dưng",
                artistData: "TLong (H2O Remix)",
                displayArtist: { name: "TLong", id: "tlong" },
                artUrl: "img/Rượu mừng hóa người dưng.png",
                audioSrc: "audio/Rượu mừng hóa người dưng.mp3",
                isFavorite: false,
                plays: "987.654"
            },
            {
                id: "vpop_nucuoi1820",
                title: "Nụ Cười 18 20",
                artistData: "Đoàn Hiếu (ACV Remix)",
                displayArtist: { name: "Đoàn Hiếu", id: "doan-hieu" },
                artUrl: "img/Nụ cười 18 20.png",
                audioSrc: "audio/Nụ-Cười-18-20.mp3",
                isFavorite: false,
                plays: "1.876.543"
            },
            {
                id: "vpop_mayremix",
                title: "Mây (Remix)", // File list có "Mây Remix"
                artistData: "Jank & Sỹ Tây (Orinn Remix)",
                displayArtist: { name: "Jank & Sỹ Tây", id: "jank-sy-tay" },
                artUrl: "img/Mây Remix.png", // Giả sử tên file art là Mây Remix.png
                audioSrc: "audio/Mây Remix.mp3",
                isFavorite: false,
                plays: "2.109.876"
            },
            {
                id: "vpop_ketheoduoianhsang",
                title: "Kẻ Theo Đuổi Ánh Sáng",
                artistData: "Huy Vạc X Tiến Nguyễn (Orinn Remix)",
                displayArtist: { name: "Huy Vạc X Tiến Nguyễn", id: "huyvac-tiennguyen" },
                // File list là "Kẻ Theo Đuổi Ánh Sáng (Orinn Remix) - ....png"
                // Tôi sẽ chuẩn hóa tên file art và audio để đơn giản
                artUrl: "img/Kẻ Theo Đuổi Ánh Sáng.png",
                audioSrc: "audio/Kẻ Theo Đuổi Ánh Sáng.mp3",
                isFavorite: false,
                plays: "3.401.298"
            },
            {
                id: "vpop_dunglonhecoanhday",
                title: "Đừng Lo Nhé Có Anh Đây",
                artistData: "Thiên Tú (Orinn Remix)",
                displayArtist: { name: "Thiên Tú", id: "thien-tu" },
                artUrl: "img/Đừng lo nhé có anh đây.png",
                audioSrc: "audio/Đừng lo nhé có anh đây.mp3",
                isFavorite: false,
                plays: "2.567.111"
            },
            {
                id: "vpop_dauconday",
                title: "Đâu Còn Đây",
                artistData: "Lee Ken X Nal (Orinn Remix)",
                displayArtist: { name: "Lee Ken X Nal", id: "leeken-nal" },
                artUrl: "img/Đâu Còn Đây.png",
                audioSrc: "audio/Đâu-Còn-Đây.mp3",
                isFavorite: false,
                plays: "1.999.000"
            }
        ]
    },
    {
        id: "lycorisrecoil", // ID cho thể loại
        title: "Lycoris Recoil OST", // Tên hiển thị cho thể loại
        songs: [
            {
                id: "lyco_alive", // ID bài hát duy nhất
                title: "ALIVE",
                artistData: "ClariS",
                displayArtist: { name: "ClariS", id: "claris" },
                artUrl: "img/ALIVE.png", // Giả sử file ALIVE.PNG của bạn tên là vậy
                audioSrc: "audio/ALIVE.mp3", // Đường dẫn tới file MP3
                isFavorite: false,
                plays: "15.234.567" // Random
            },
            {
                id: "lyco_tower",
                title: "Tower of Flower", // Tên gốc là 花の塔 (Hana no Tou)
                artistData: "Sayuri",
                displayArtist: { name: "Sayuri", id: "sayuri" },
                artUrl: "img/Tower of Flower.png", // Ảnh bìa giả định, bạn cần có file này
                audioSrc: "audio/Tower of Flower.mp3",
                isFavorite: false,
                plays: "22.987.654" // Random
            },
            {
                id: "lyco_alive_inst",
                title: "ALIVE (Instrumental)",
                artistData: "ClariS", // Hoặc tên nhà soạn nhạc Shuhei Mutsuki
                displayArtist: { name: "ClariS", id: "claris" }, // Hoặc { name: "Shuhei Mutsuki", id: "shuhei-mutsuki"}
                artUrl: "img/ALIVE-Instrumental.jpg", // Thường dùng chung art với bản gốc
                audioSrc: "audio/ALIVE-Instrumental.mp3",
                isFavorite: false,
                plays: "5.876.123" // Random
            },

            {
                id: "lyco_tower_inst",
                title: "Tower of Flower (Instrumental)",
                artistData: "Sayuri", // Hoặc tên nhà soạn nhạc Ryo Eguchi
                displayArtist: { name: "Sayuri", id: "sayuri" }, // Hoặc { name: "Ryo Eguchi", id: "ryo-eguchi" }
                artUrl: "img/Tower of Flower instrumental.jpg", // Thường dùng chung art với bản gốc
                audioSrc: "audio/Tower of Flower instrumental.mp3",
                isFavorite: false,
                plays: "8.123.456" // Random
            }
        ]
    },
    {
        id: "Mahiru",
        title: "Thiên sứ nhà bên - Mahiru",
        songs: [
            {
                id: "mahiru1",
                title: "小さな恋のうた",
                artistData: "椎名真昼 (CV: 石見舞菜香)",
                displayArtist: { name: "椎名真昼 (CV: 石見舞菜香)", id: "MahiruShiina" },
                artUrl: "img/mahiru1.png",
                audioSrc: "audio/mahiru_ed1.mp3",
                isFavorite: true,
                plays: "4.258.910" // Random
            },
            {
                id: "mahiru2",
                title: "愛唄",
                artistData: "椎名真昼 (CV: 石見舞菜香)",
                displayArtist: { name: "椎名真昼 (CV: 石見舞菜香)", id: "MahiruShiina" },
                artUrl: "img/mahiru2.png",
                audioSrc: "audio/mahiru_ed2.mp3",
                isFavorite: true,
                plays: "3.789.552" // Random
            },
            {
                id: "mahiru3",
                title: "君に届け",
                artistData: "椎名真昼 (CV: 石見舞菜香)",
                displayArtist: { name: "椎名真昼 (CV: 石見舞菜香)", id: "MahiruShiina" },
                artUrl: "img/mahiru3.png",
                audioSrc: "audio/mahiru_ed3.mp3",
                isFavorite: true,
                plays: "5.102.304" // Random
            },
            {
                id: "mahiru4",
                title: "君に届け - Instrumental",
                artistData: "Instrumental",
                displayArtist: { name: "椎名真昼 (CV: 石見舞菜香)", id: "MahiruShiina" },
                artUrl: "img/mahiru4.png",
                audioSrc: "audio/mahiru_ed3_Instrumental.mp3",
                isFavorite: true,
                plays: "1.567.890" // Random
            },
            {
                id: "mahiru5",
                title: "ギフト - Pf Solo ver.",
                artistData: "Instrumental",
                displayArtist: { name: "椎名真昼 (CV: 石見舞菜香)", id: "MahiruShiina" },
                artUrl: "img/mahiru_gift.png",
                audioSrc: "audio/mahiru_gift.mp3",
                isFavorite: true,
                plays: "467.790" // Random
            },
            {
                id: "mahiru6",
                title: "君に届け - Piano.",
                artistData: "Instrumental",
                displayArtist: { name: "Instrumental", id: "MahiruShiina" },
                artUrl: "img/mahiru5.png",
                audioSrc: "audio/mahiru_ed3_piano.mp3",
                isFavorite: true,
                plays: "167.123" // Random
            },
            {
                id: "mahiru7",
                title: "Little Love Song",
                artistData: "Ru's Piano Ru味春捲",
                displayArtist: { name: "Ru's Piano Ru味春捲", id: "MahiruShiina" },
                artUrl: "img/mahiru6.png",
                audioSrc: "audio/Little_Love_Song.mp3",
                isFavorite: true,
                plays: "1.134.892" // Random
            }
        ]
    },
    {
        id: "SummerPockets",
        title: "Summer Pockets - OST & Vocal",
        songs: [
            {
                id: "sp1",
                title: "アルカレイド (Alkaleido)",
                artistData: "鈴木このみ (Konomi Suzuki)",
                displayArtist: { name: "Konomi Suzuki", id: "KonomiSuzuki" },
                artUrl: "img/summer_pockets_op.png",
                audioSrc: "audio/summer_pockets_op.mp3",
                isFavorite: true,
                plays: "4.481.234" // Random
            },
            {
                id: "sp2",
                title: "Lasting Moment",
                artistData: "鈴木このみ (Konomi Suzuki)",
                displayArtist: { name: "Konomi Suzuki", id: "KonomiSuzuki" },
                artUrl: "img/Tsumugi.png",
                audioSrc: "audio/summer_pockets_ed.mp3",
                isFavorite: false, // Ví dụ
                plays: "5.356.789" // Random
            },
            {
                id: "sp3",
                title: "羽のゆりかご",
                artistData: "水谷瑠奈 (NanosizeMir)",
                displayArtist: { name: "水谷瑠奈 (NanosizeMir)", id: "RunaMizutani" },
                artUrl: "img/Hane no Yurikago.png",
                audioSrc: "audio/Hane no Yurikago.mp3",
                isFavorite: false, // Ví dụ
                plays: "2.987.654" // Random
            },
            {
                id: "sp4",
                title: "Sea, You & Me",
                artistData: "紬ヴェンダース (CV: 岩井映美里)",
                displayArtist: { name: "紬ヴェンダース", id: "TsumugiWenders" },
                artUrl: "img/Tsumugi.png",
                audioSrc: "audio/Tsumugi.mp3",
                isFavorite: true, // Ví dụ
                plays: "1.205.333" // Random
            },
            {
                id: "sp5",
                title: "Hamu 20th Anniversary", // Có thể đổi tên thành "Summer Pockets Theme (Hamu 20th Ver.)"
                artistData: "Instrumental",
                displayArtist: { name: "Key Sound Label", id: "KeySoundLabel" },
                artUrl: "img/key20th.png",
                audioSrc: "audio/summer_pockets_op_20th_Key.mp3",
                isFavorite: false, // Ví dụ
                plays: "987.654" // Random
            },
            {
                id: "sp6",
                title: "アスタロア (Asterlore)",
                artistData: "riya (eufonius)",
                displayArtist: { name: "riya (eufonius)", id: "riyaEufonius" },
                artUrl: "img/Summer_Pockets_Asterlore.png",
                audioSrc: "audio/Summer_Pockets_Asterlore.mp3",
                isFavorite: true, // Ví dụ
                plays: "3.015.888" // Random
            },
            {
                id: "sp7",
                title: "羽のゆりかご - Instrumental",
                artistData: "水谷瑠奈 (NanosizeMir)",
                displayArtist: { name: "水谷瑠奈 (NanosizeMir)", id: "RunaMizutani" },
                artUrl: "img/Hane no Yurikago Instrumental.png",
                audioSrc: "audio/Hane no Yurikago Instrumental.mp3",
                isFavorite: false, // Ví dụ
                plays: "223.654" // Random
            }
        ]
    },
    {
        id: "GenshinImpactOST",
        title: "Genshin Impact - Original Soundtrack",
        songs: [
            {
                id: "gi1",
                title: "Hanachirusato",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/hanachirusato.png",
                audioSrc: "audio/hanachirusato.mp3",
                isFavorite: true,
                plays: "3.105.721"
            },
            {
                id: "gi2",
                title: "Fragile Fantasy",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/fragile_fantasy.png",
                audioSrc: "audio/fragile_fantasy.mp3",
                isFavorite: false,
                plays: "2.876.543"
            },
            {
                id: "gi3",
                title: "Genshin Impact Main Theme",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/genshin_impact_main_theme.png",
                audioSrc: "audio/genshin_impact_main_theme.mp3",
                isFavorite: true,
                plays: "10.543.210"
            },
            {
                id: "gi4",
                title: "Rapid as Wildfires",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/rapid_as_wildfires.png",
                audioSrc: "audio/rapid_as_wildfires.mp3",
                isFavorite: false,
                plays: "1.987.321"
            },
            {
                id: "gi5",
                title: "Fleeting Colors in Flight",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/fleeting_colors_in_flight.png",
                audioSrc: "audio/fleeting_colors_in_flight.mp3",
                isFavorite: true,
                plays: "4.001.888"
            },
            {
                id: "gi6",
                title: "Immaculate Ardency",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/immaculate_ardency.png",
                audioSrc: "audio/immaculate_ardency.mp3",
                isFavorite: false,
                plays: "2.345.678"
            },
            {
                id: "gi7",
                title: "A Memory Fancy", // Giữ title dễ đọc
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/a_memory_fancy.png", // Giữ nguyên tên file từ ảnh
                audioSrc: "audio/a_memory_fancy.mp3", // Giữ nguyên tên file từ ảnh
                isFavorite: true,
                plays: "1.500.900"
            }
        ]
    },
    {
        id: "BlueArchiveOST",
        title: "Blue Archive - Original Soundtrack",
        songs: [
            {
                id: "ba1",
                title: "Memories Of Kindness",
                artistData: "NEXON Games", // Hoặc "Blue Archive Sound Team" nếu bạn muốn cụ thể hơn
                displayArtist: { name: "NEXON Games", id: "NEXONGames" },
                artUrl: "img/memories_of_kindness.png",
                audioSrc: "audio/memories_of_kindness.mp3",
                isFavorite: true,
                plays: "2.501.337"
            },
            {
                id: "ba2",
                title: "Luminous Memory",
                artistData: "NEXON Games",
                displayArtist: { name: "NEXON Games", id: "NEXONGames" },
                artUrl: "img/Luminous_Memory.png",
                audioSrc: "audio/Luminous Memory.mp3",
                isFavorite: false,
                plays: "1.987.654"
            },
            {
                id: "ba3",
                title: "Seishun No Archive",
                artistData: "NEXON Games",
                displayArtist: { name: "NEXON Games", id: "NEXONGames" },
                artUrl: "img/Seishun_No_Archive.png",
                audioSrc: "audio/Seishun_No_Archive.mp3",
                isFavorite: true,
                plays: "3.015.888"
            },
            {
                id: "ba4",
                title: "Seishun No Archive (Instrumental)", // Thêm (Instrumental) vào title
                artistData: "NEXON Games",
                displayArtist: { name: "NEXON Games", id: "NEXONGames" },
                artUrl: "img/Seishun_No_Archive.png", // Dùng chung art với bản gốc
                audioSrc: "audio/Seishun_No_Archive Instrumental.mp3", // Tên file có dấu cách
                isFavorite: false,
                plays: "1.203.405"
            },
            {
                id: "ba5",
                title: "Constant Moderato Anime",
                artistData: "NEXON Games",
                displayArtist: { name: "NEXON Games", id: "NEXONGames" },
                artUrl: "img/Constant_Moderato_Anime.png",
                audioSrc: "audio/Constant_Moderato_Anime.mp3",
                isFavorite: true,
                plays: "2.777.999"
            }
        ]
    }
];

// Nếu dùng ES Modules: export { ALL_MUSIC_SECTIONS };