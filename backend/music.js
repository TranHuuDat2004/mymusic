// data/music.js

module.exports  = [
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
                audioSrc: "audio/nu-cuoi.mp3",
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
        id: "ElectronicEDM", // ID cho thể loại mới
        title: "Electronic & EDM", // Tên hiển thị
        songs: [
            {
                id: "edm_a_moment_apart",
                title: "A Moment Apart",
                artistData: "ODESZA",
                displayArtist: { name: "ODESZA", id: "odesza" }, // Tạo id mới cho ODESZA
                artUrl: "img/A Moment Apart.png",
                audioSrc: "audio/ODESZA - A Moment Apart.mp3",
                isFavorite: false,
                plays: "12.345.678"
            },
            // --- BẮT ĐẦU CÁC BÀI HÁT MỚI ---
            {
                id: "edm_faded",
                title: "Faded",
                artistData: "Alan Walker",
                displayArtist: { name: "Alan Walker", id: "alanwalker" },
                artUrl: "img/faded.png",
                audioSrc: "audio/Alan Walker - Faded (Lyrics).mp3",
                isFavorite: false,
                plays: "1.812.345.678" // ~1.8B
            },
            {
                id: "edm_lily",
                title: "Lily",
                artistData: "Alan Walker, K-391 & Emelie Hollow",
                displayArtist: { name: "Alan Walker", id: "alanwalker" },
                artUrl: "img/lily.jpg",
                audioSrc: "audio/Alan Walker, K-391 & Emelie Hollow - Lily (Lyrics).mp3",
                isFavorite: true,
                plays: "1.523.456.789" // ~1.5B
            },
            {
                id: "edm_spectre",
                title: "The Spectre",
                artistData: "Alan Walker",
                displayArtist: { name: "Alan Walker", id: "alanwalker" },
                artUrl: "img/spectre.jpg",
                audioSrc: "audio/Alan Walker - The Spectre (Lyrics).mp3",
                isFavorite: false,
                plays: "980.123.456" // ~980M
            },
            {
                id: "edm_all_falls_down",
                title: "All Falls Down",
                artistData: "Alan Walker ft. Noah Cyrus",
                displayArtist: { name: "Alan Walker", id: "alanwalker" },
                artUrl: "img/Alan_Walker_All_Falls_Down.jpg",
                audioSrc: "audio/Alan Walker - All Falls Down (feat. Noah Cyrus with Digital Farm Animals).mp3",
                isFavorite: false,
                plays: "550.987.123" // ~550M
            },
            {
                id: "edm_ignite",
                title: "Ignite",
                artistData: "K-391 & Alan Walker",
                displayArtist: { name: "K-391", id: "k391" },
                artUrl: "img/K-391-Ignite.png",
                audioSrc: "audio/K-391 & Alan Walker - Ignite (feat. Julie Bergan & Seungri).mp3",
                isFavorite: false,
                plays: "750.333.222" // ~750M
            },
            {
                id: "edm_on_on",
                title: "On & On",
                artistData: "Cartoon ft. Daniel Levi",
                displayArtist: { name: "Cartoon", id: "cartoon" },
                artUrl: "img/on&on.png",
                audioSrc: "audio/Cartoon, Jéja - On & On (Lyrics) feat. Daniel Levi.mp3",
                isFavorite: true,
                plays: "480.777.888" // ~480M
            },
            {
                id: "edm_way_back_home",
                title: "Way Back Home",
                artistData: "SHAUN ft. Conor Maynard (Sam Feldt Edit)",
                displayArtist: { name: "SHAUN", id: "shaun" },
                artUrl: "img/Way Back Home.jpg",
                audioSrc: "audio/SHAUN feat. Conor Maynard - Way Back Home (Lyrics) Sam Feldt Edit.mp3",
                isFavorite: false,
                plays: "420.123.999" // ~420M
            },
            {
                id: "vpop_ngau_hung",
                title: "Ngẫu Hứng",
                artistData: "Hoaprox",
                displayArtist: { name: "Hoaprox", id: "hoaprox" },
                artUrl: "img/ngau-hung.PNG",
                audioSrc: "audio/WITH YOU (NGẪU HỨNG) - HOAPROX, NICK STRAND & MIO - OFFICIAL MV.mp3",
                isFavorite: false,
                plays: "150.456.789" // ~150M
            },
            {
                id: "vpop_that_girl",
                title: "That Girl",
                artistData: "Olly Murs",
                displayArtist: { name: "Olly Murs", id: "ollymurs" },
                artUrl: "img/that girl.png",
                audioSrc: "audio/[Vietsub + Kara] That Girl - Olly Murs (lyrics) - Tik Tok.mp3",
                isFavorite: false,
                plays: "120.987.654" // ~120M
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
    // Dán khối này vào trong mảng ALL_MUSIC_SECTIONS của file data/music.js

    {
        id: "HonkaiStarRailOST",
        title: "Honkai: Star Rail", // Tên hiển thị cho playlist/section
        songs: [
            {
                id: "hsr_if_i_can_stop",
                title: "If I Can Stop One Heart From Breaking",
                artistData: "Robin, HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" }, // Tái sử dụng id của HOYO-MiX
                artUrl: "img/robin3.png", // Dựa trên file robin.png
                audioSrc: "audio/If I Can Stop One Heart From Breaking.mp3", // Dựa trên tên file
                isFavorite: false,
                plays: "9.876.543"
            },
            {
                id: "hsr_hope_is_a_thing",
                title: "Hope Is the Thing With Feathers",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/robin.png", // Dựa trên file robin2.png
                audioSrc: "audio/Hope Is the Thing With Feathers.mp3",
                isFavorite: false,
                plays: "8.765.432"
            },
            {
                id: "hsr_sway_to_my_beat",
                title: "Sway to My Beat in Cosmos",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/robin.png", // Dựa trên file robin3.png
                audioSrc: "audio/Sway to My Beat in Cosmos.mp3",
                isFavorite: false,
                plays: "7.654.321"
            },
            {
                id: "hsr_had_i_not_seen",
                title: "Had I Not Seen the Sun",
                artistData: "HOYO-MiX",
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/robin2.png", // Tạm thời dùng chung ảnh bìa, bạn có thể thay đổi
                audioSrc: "audio/Had I Not Seen the Sun.mp3",
                isFavorite: false,
                plays: "6.543.210"
            },
            {
                id: "edm_proi_proi",
                title: "Proi Proi",
                artistData: "HOYO-MiX", // Giả định tác giả là HOYO-MiX
                displayArtist: { name: "HOYO-MiX", id: "HOYOMiX" },
                artUrl: "img/proi proi.png", // Dựa trên file proi proi.png
                audioSrc: "audio/Proi Proi.mp3",
                isFavorite: false,
                plays: "5.432.109"
            },
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
    },

    {
        id: "CIRotY",
        title: "Chicken Invaders - Revenge of the Yolk",
        songs: [
            {
                id: "ci_roty_1", title: "Main Theme - Coq Au Ran", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 01 - Revenge of the Yolk - Main Theme - Coq Au Ran.mp3",
                plays: "1.234.567"
            },
            {
                id: "ci_roty_2", title: "Mission 1 - Bird In A Daze", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 02 - Revenge of the Yolk - Mission 1 - Bird In A Daze.mp3",
                plays: "987.654"
            },
            {
                id: "ci_roty_3", title: "Mission 2 - Taking The Pizz", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 03 - Revenge of the Yolk - Mission 2 - Taking The Pizz.mp3",
                plays: "876.543"
            },
            {
                id: "ci_roty_4", title: "Mission 3 - 633 Squawkdron", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 04 - Revenge of the Yolk - Mission 3 - 633 Squawkdron.mp3",
                plays: "765.432"
            },
            {
                id: "ci_roty_5", title: "Boss Fight - Zimmer's Frame", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 05 - Revenge of the Yolk - Boss Fight - Zimmer's Frame.mp3",
                plays: "1.123.456"
            },
            {
                id: "ci_roty_6", title: "Mission Success - Chicken Chaser", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 06 - Revenge of the Yolk - Mission Success - Chicken Chaser.mp3",
                plays: "654.321"
            },
            {
                id: "ci_roty_7", title: "Yolk-Star Theme - The Imperial Strut", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 07 - Revenge of the Yolk - Yolk-Star Theme - The Imperial Strut.mp3",
                plays: "1.012.345"
            },
            {
                id: "ci_roty_8", title: "Game Over - Totally Burgered", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 08 - Revenge of the Yolk - Game Over - Totally Burgered.mp3",
                plays: "543.210"
            },
            {
                id: "ci_roty_9", title: "Victory - Stuffed Chicken", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_roty.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 09 - Revenge of the Yolk - Victory - Stuffed Chicken.mp3",
                plays: "998.765"
            }
        ]
    },
    {
        id: "CIUO",
        title: "Chicken Invaders - Ultimate Omelette",
        songs: [
            {
                id: "ci_uo_10", title: "Main Theme - A Spatchcocked Universe", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 10 - Ultimate Omelette - Main Theme - A Spatchcocked Universe.mp3",
                plays: "2.345.678"
            },
            {
                id: "ci_uo_11", title: "Mission 1 - The Big Nuggets", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 11 - Ultimate Omelette - Mission 1 - The Big Nuggets.mp3",
                plays: "1.987.654"
            },
            {
                id: "ci_uo_12", title: "Mission 2 - The Dark Brood", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 12 - Ultimate Omelette - Mission 2 - The Dark Brood.mp3",
                plays: "1.876.543"
            },
            {
                id: "ci_uo_13", title: "Mission 3 - To Birdly Go", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 13 - Ultimate Omelette - Mission 3 - To Birdly Go.mp3",
                plays: "1.765.432"
            },
            {
                id: "ci_uo_14", title: "Boss Fight - Mission Improbable", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 14 - Ultimate Omelette - Boss Fight - Mission Improbable.mp3",
                plays: "2.123.456"
            },
            {
                id: "ci_uo_15", title: "Mission Success - Rooster Booster", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 15 - Ultimate Omelette - Mission Success - Rooster Booster.mp3",
                plays: "1.654.321"
            },
            {
                id: "ci_uo_16", title: "Egg Cannon Theme - Dark Side Of The Farce", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 16 - Ultimate Omelette - Egg Cannon Theme - Dark Side Of The Farce.mp3",
                plays: "2.012.345"
            },
            {
                id: "ci_uo_17", title: "Invaders - A Long Time Ago", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 17 - Ultimate Omelette - Invaders - A Long Time Ago.mp3",
                plays: "1.543.210"
            },
            {
                id: "ci_uo_18", title: "Game Over - Well, Cluck", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 18 - Ultimate Omelette - Game Over - Well, Cluck.mp3",
                plays: "1.432.109"
            },
            {
                id: "ci_uo_19", title: "Suspense - Fowl Play", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 19 - Ultimate Omelette - Suspense - Fowl Play.mp3",
                plays: "1.321.098"
            },
            {
                id: "ci_uo_20", title: "Victory - Plucked 'Em", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_uo.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 20 - Ultimate Omelette - Victory - Plucked 'Em.mp3",
                plays: "1.888.777"
            }
        ]
    },
    {
        id: "CICotDS",
        title: "Chicken Invaders - Cluck of the Dark Side",
        songs: [
            {
                id: "ci_cotds_21", title: "Main Theme - A Pollo 13", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 21 - Cluck of the Dark Side - Main Theme - A Pollo 13.mp3",
                plays: "3.456.789"
            },
            {
                id: "ci_cotds_22", title: "Mission 1 - A Poultry Excuse", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 22 - Cluck of the Dark Side - Mission 1 - A Poultry Excuse.mp3",
                plays: "2.876.543"
            },
            {
                id: "ci_cotds_23", title: "Mission 2 - A Henterprizing Venture", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 23 - Cluck of the Dark Side - Mission 2 - A Henterprizing Venture.mp3",
                plays: "2.765.432"
            },
            {
                id: "ci_cotds_24", title: "Mission 3 - Spitting Feathers", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 24 - Cluck of the Dark Side - Mission 3 - Spitting Feathers.mp3",
                plays: "2.654.321"
            },
            {
                id: "ci_cotds_25", title: "Boss Fight - The Bad Egg", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 25 - Cluck of the Dark Side - Boss Fight - The Bad Egg.mp3",
                plays: "3.123.456"
            },
            {
                id: "ci_cotds_26", title: "Mission Success - Fanfare To Victory", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 26 - Cluck of the Dark Side - Mission Success - Fanfare To Victory.mp3",
                plays: "2.543.210"
            },
            {
                id: "ci_cotds_27", title: "Henterprise Theme - Cluck Around, Find Out!", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 27 - Cluck of the Dark Side - Henterprise Theme - Cluck Around, Find Out!.mp3",
                plays: "3.012.345"
            },
            {
                id: "ci_cotds_28", title: "Game Over - Who Gives A Cluck", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 28 - Cluck of the Dark Side - Game Over - Who Gives A Cluck.mp3",
                plays: "2.432.109"
            },
            {
                id: "ci_cotds_29", title: "Victory - Go Large!", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_cotds.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 29 - Cluck of the Dark Side - Victory - Go Large!.mp3",
                plays: "2.998.765"
            }
        ]
    },
    {
        id: "CIUniverse",
        title: "Chicken Invaders - Universe",
        songs: [
            {
                id: "ci_uni_30", title: "Main Theme (Intense mix) - The Hero's Plume", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 30 - Universe - Main Theme (Intense mix) - The Hero's Plume.mp3",
                plays: "4.567.890"
            },
            {
                id: "ci_uni_31", title: "Main Theme (Ambient mix) - Perusing The Chicken Menu", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 31 - Universe - Main Theme (Ambient mix) - Perusing The Chicken Menu.mp3",
                plays: "3.987.654"
            },
            {
                id: "ci_uni_32", title: "Mission 1 - Hugo The Great", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 32 - Universe - Mission 1 - Hugo The Great.mp3",
                plays: "3.876.543"
            },
            {
                id: "ci_uni_33", title: "Mission 2 - Squawk Factor 5", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 33 - Universe - Mission 2 - Squawk Factor 5.mp3",
                plays: "3.765.432"
            },
            {
                id: "ci_uni_34", title: "Mission 3 - The Chicken Has Landed", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 34 - Universe - Mission 3 - The Chicken Has Landed.mp3",
                plays: "3.654.321"
            },
            {
                id: "ci_uni_35", title: "Mission 4 - Picard-y Bird", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 35 - Universe - Mission 4 - Picard-y Bird.mp3",
                plays: "3.543.210"
            },
            {
                id: "ci_uni_36", title: "Boss Fight - Chilli Wings", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 36 - Universe - Boss Fight - Chilli Wings.mp3",
                plays: "4.123.456"
            },
            {
                id: "ci_uni_37", title: "120th Anniversary - Also Cluck Zarathustra", artistData: "2dB Music Production",
                displayArtist: { name: "2dB Music Production", id: "2db-music" },
                artUrl: "img/ci_cover_universe.jpg", audioSrc: "audio/Chicken Invaders Soundtrack - 37 - Universe - 120th Anniversary - Also Cluck Zarathustra.mp3",
                plays: "5.678.901"
            }
        ]
    }
    // Dán toàn bộ khối mã này vào trong mảng ALL_MUSIC_SECTIONS của file data/music.js


];

// Nếu dùng ES Modules: export { ALL_MUSIC_SECTIONS };