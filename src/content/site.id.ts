/**
 * Bahasa Indonesia, as English line → Indonesian line. content/locale.ts
 * swaps every string in site.ts that has an entry here; links, images and
 * names come from site.ts, so the two versions can't disagree.
 *
 * - The key must match the English in site.ts exactly. When you change an
 *   English line, change its key here too: `npm run i18n:check` lists every
 *   English line with no entry (and entries no line uses any more).
 * - A line that stays the same in Indonesian (a tool, a product) goes in
 *   `unchanged` below instead.
 * - "TODO:" placeholders are left out: they stay English until they're real.
 * - **Bold** markers and {reply} slots must stay in the translation.
 * - Numbers are written the Indonesian way (7.000+, 99,9%, 4,5): the same
 *   figures as the English, only the separators differ.
 * - Tone: "saya / Anda". Terms Indonesian developers use in English
 *   (codebase, wireframe, design system, fake GPS…) stay in English.
 *
 * Drafted by Claude (2026-11-16) for the owner to review.
 */
export const id: Record<string, string> = {
  /* ---- Site, navigation ---- */
  "Flutter developer, front-end developer and UI/UX designer": "Flutter developer, front-end developer, dan UI/UX designer",
  "Juliansyah designs and builds Flutter apps and web front-ends from Pangkalpinang, Indonesia (UTC+7): UI/UX design, Flutter, React and Next.js, from first sketch to shipped release.":
    "Juliansyah merancang dan membangun aplikasi Flutter dan front-end web dari Pangkalpinang, Indonesia (UTC+7): desain UI/UX, Flutter, React, dan Next.js, dari sketsa pertama hingga rilis.",
  Work: "Karya",
  About: "Tentang",
  Playground: "Eksperimen",
  Contact: "Kontak",
  "Hire me": "Hubungi saya",
  "Email me": "Kirim email",
  "Open menu": "Buka menu",
  "Close menu": "Tutup menu",
  Main: "Utama",
  "Accent color": "Warna aksen",
  Language: "Bahasa",

  /* ---- Hero ---- */
  "Hi, I'm": "Halo, saya",
  "Your Technology Partner": "Mitra Teknologi Anda",
  "I Engineer Digital Products That Solve Real Problems.": "Saya Membangun Produk Digital yang Menyelesaikan Masalah Nyata.",
  "I'm a software engineer with a strong eye for design and a product-driven mindset. I turn complex challenges into intuitive, functional digital experiences that help businesses work better.":
    "Saya software engineer dengan kepekaan desain yang kuat dan pola pikir yang berfokus pada produk. Saya mengubah tantangan yang rumit menjadi pengalaman digital yang intuitif dan fungsional, yang membantu bisnis bekerja lebih baik.",
  "Let's Work Together": "Mari Bekerja Sama",
  "Explore My Work": "Lihat Karya Saya",
  // The dashboard mock (sample data, hidden from screen readers).
  Dashboard: "Dasbor",
  Projects: "Proyek",
  Components: "Komponen",
  Mobile: "Seluler",
  Customers: "Pelanggan",
  Reports: "Laporan",
  Tokens: "Token",
  Messages: "Pesan",
  New: "Baru",
  "Product tour · 2 min": "Tur produk · 2 mnt",
  Dark: "Gelap",
  Light: "Terang",
  Documentation: "Dokumentasi",
  "Good evening, visitor": "Selamat malam, pengunjung",
  "people use my apps": "orang memakai aplikasi saya",
  "Presensi PKP, PKP Smart and more": "Presensi PKP, PKP Smart, dan lainnya",
  "Organisations I've worked with": "Organisasi yang pernah bekerja sama dengan saya",
  "Conversion rate": "Tingkat konversi",
  "3.8%": "3,8%",
  "Avg. session": "Rata-rata sesi",
  "4m 12s": "4 mnt 12 dtk",
  "Tickets resolved": "Tiket selesai",
  "1,204": "1.204",

  /* ---- Track record ---- */
  "Track record": "Rekam jejak",
  "Proven in Production.": "Teruji di Produksi.",
  "Apps I've built and shipped for government, education and enterprise teams, live with real users. Your project gets the same standard.":
    "Aplikasi yang saya bangun dan rilis untuk tim pemerintahan, pendidikan, dan perusahaan, dipakai oleh pengguna sungguhan. Proyek Anda mendapat standar yang sama.",
  "View work": "Lihat karya",
  "Learn more": "Selengkapnya",
  "App users": "Pengguna aplikasi",
  "99.9%": "99,9%",
  "Crash-free sessions": "Sesi bebas crash",
  "Client organisations": "Organisasi klien",
  "Years of experience": "Tahun pengalaman",

  /* ---- Selected work ---- */
  "Selected work": "Karya pilihan",
  "Case Studies, Not Just Screenshots.": "Studi Kasus, Bukan Sekadar Screenshot.",
  "Mobile apps, web apps and UI/UX projects. Open any card for the full story: the problem, my role, the decisions and the result.":
    "Aplikasi mobile, aplikasi web, dan proyek UI/UX. Buka kartu mana saja untuk cerita lengkapnya: masalahnya, peran saya, keputusan yang diambil, dan hasilnya.",
  "Read the case study": "Baca studi kasusnya",
  "app screens": "layar aplikasi",
  "Pause the screens": "Jeda pergantian layar",
  "Play the screens": "Putar pergantian layar",
  Role: "Peran",
  Year: "Tahun",
  "Built with": "Dibangun dengan",
  on: "di",
  ratings: "penilaian",

  /* ---- Presensi PKP ---- */
  "GPS-verified check-ins replaced paper sign-in sheets for a city government.": "Presensi terverifikasi GPS menggantikan daftar hadir kertas di sebuah pemerintah kota.",
  "The official attendance app for the Pangkalpinang city government. Civil servants check in with GPS and a selfie, request leave and review their history. Every late minute is on record, and bonus cuts are based on it.":
    "Aplikasi presensi resmi Pemerintah Kota Pangkalpinang. Pegawai melakukan presensi dengan GPS dan swafoto, mengajukan cuti, dan melihat riwayatnya. Setiap menit keterlambatan tercatat, dan potongan tunjangan dihitung dari catatan itu.",
  "UI/UX designer and Flutter developer": "UI/UX designer dan Flutter developer",
  "Live in production": "Aktif digunakan",
  "7,000+": "7.000+",
  "active employees": "pegawai aktif",
  "4.5": "4,5",
  "Home screen: today's clock, the check-in window and upcoming events": "Layar beranda: jam hari ini, rentang waktu presensi, dan agenda mendatang",
  "Attendance history: the month's totals and each day's check-in and check-out times": "Riwayat presensi: rekap bulan ini serta jam masuk dan jam pulang setiap hari",
  "Sign-in screen: employee ID (NIK or NIP) and password": "Layar masuk: nomor pegawai (NIK atau NIP) dan kata sandi",
  "First launch: choosing Bahasa Indonesia or English": "Pembukaan pertama: memilih Bahasa Indonesia atau English",
  "Attendance used to be signed on paper. Someone who arrived late could still write down an on-time arrival, and some staff filled in the whole five-day week in one go.":
    "Dulu presensi ditandatangani di atas kertas. Pegawai yang datang terlambat tetap bisa menulis jam datang tepat waktu, dan sebagian pegawai mengisi lima hari kerja sekaligus.",
  "The record matters more now: the bonus is cut by how late someone is and by every absence. BKPSDMD, the city's civil service agency, needed attendance it could trust.":
    "Kini catatan itu makin penting: tunjangan dipotong sesuai lamanya keterlambatan dan setiap ketidakhadiran. BKPSDMD, badan kepegawaian kota, membutuhkan data presensi yang bisa dipercaya.",
  "Paper sheet": "Daftar hadir kertas",
  "The time is whatever the person writes down.": "Jamnya sesuai apa pun yang ditulis pegawai.",
  "The time comes from the **server**, so changing the phone's clock does nothing.": "Jamnya diambil dari **server**, jadi mengubah jam di ponsel tidak berpengaruh.",
  "A whole week can be filled in at one sitting.": "Satu minggu penuh bisa diisi sekaligus.",
  "Each check-in happens **on the day**, inside the office geofence, with a selfie. Fake GPS is refused.":
    "Setiap presensi dilakukan **di hari itu juga**, di dalam geofence kantor, dengan swafoto. Fake GPS ditolak.",
  "Nobody can tell how late anyone really was.": "Tidak ada yang tahu seberapa terlambat seseorang sebenarnya.",
  "Lateness is counted **to the minute**, and bonus cuts follow the record.": "Keterlambatan dihitung **sampai ke menit**, dan potongan tunjangan mengikuti catatan itu.",
  "I designed the app and built it in **Flutter** for Android, iPhone and iPad, from one codebase.":
    "Saya merancang aplikasinya dan membangunnya dengan **Flutter** untuk Android, iPhone, dan iPad, dari satu codebase.",
  "A team of six: a project manager, two backend developers, two cyber security specialists, and me on **UI/UX design** and the **Flutter** app":
    "Tim berenam: satu project manager, dua backend developer, dua spesialis keamanan siber, dan saya di **desain UI/UX** serta aplikasi **Flutter**",
  "**Clean Architecture** with **BLoC**: data, domain and presentation in every feature": "**Clean Architecture** dengan **BLoC**: lapisan data, domain, dan presentation di setiap fitur",
  "**Firebase**: **Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging**":
    "**Firebase**: **Crashlytics**, **Performance Monitoring**, **Analytics**, dan **Cloud Messaging**",
  "Responsive layouts for **phones and tablets**, iPad included": "Tata letak responsif untuk **ponsel dan tablet**, termasuk iPad",
  "Check-in only inside the office geofence, shown on an OpenStreetMap view": "Presensi hanya di dalam geofence kantor, ditampilkan di peta OpenStreetMap",
  "Fake-GPS and mock-location detection": "Deteksi fake GPS dan mock location",
  "Photo capture at check-in as a second identity check": "Foto saat presensi sebagai pemeriksaan identitas kedua",
  "Leave and permit requests with attachments": "Pengajuan cuti dan izin dengan lampiran",
  "Attendance history on a calendar": "Riwayat presensi dalam kalender",
  "Discovery: listening to BKPSDMD": "Discovery: mendengarkan BKPSDMD",
  "I listened to BKPSDMD, the city's civil service agency, about what the paper sheets got wrong: late arrivals written down as on time, and whole weeks filled in at once.":
    "Saya mendengarkan BKPSDMD, badan kepegawaian kota, tentang kelemahan daftar hadir kertas: kedatangan terlambat ditulis tepat waktu, dan satu minggu diisi sekaligus.",
  Design: "Desain",
  "I designed the check-in, leave and history flows myself, so the screens went straight into the Flutter build with no hand-off.":
    "Saya merancang sendiri alur presensi, cuti, dan riwayat, sehingga layar-layarnya langsung masuk ke build Flutter tanpa serah terima.",
  Development: "Pengembangan",
  "**Flutter** with **Clean Architecture** and **BLoC**, and **Firebase Crashlytics**, **Performance Monitoring**, **Analytics** and **Cloud Messaging**, so problems in the field show up on a dashboard. Released on Google Play and the App Store; version 1.0.9 fixed the four crashes Crashlytics ranked highest.":
    "**Flutter** dengan **Clean Architecture** dan **BLoC**, ditambah **Firebase Crashlytics**, **Performance Monitoring**, **Analytics**, dan **Cloud Messaging**, sehingga masalah di lapangan langsung terlihat di dashboard. Dirilis di Google Play dan App Store; versi 1.0.9 memperbaiki empat crash dengan peringkat tertinggi di Crashlytics.",
  Architecture: "Arsitektur",
  Platforms: "Platform",
  Quality: "Kualitas",
  "104 tests": "104 tes",
  "Server time, not the phone's clock": "Jam server, bukan jam ponsel",
  "Timestamps come from the server, so changing the device clock can't move a check-in.": "Waktu presensi diambil dari server, jadi mengubah jam perangkat tidak bisa menggeser presensi.",
  "Refuse fake GPS": "Tolak fake GPS",
  "Mock-location and spoofing attempts are detected and blocked, so a check-in means the person was really there.":
    "Upaya mock location dan pemalsuan lokasi dideteksi dan diblokir, jadi presensi berarti pegawainya benar-benar ada di sana.",
  "Let Crashlytics set the priorities": "Biarkan Crashlytics menentukan prioritas",
  "**Crashlytics** ranks every crash by how many people it hits. The top one, a Retry button on the location dialog that did nothing, reached up to 64 users on version 1.0.8. Version 1.0.9 fixed the top four.":
    "**Crashlytics** mengurutkan setiap crash berdasarkan jumlah orang yang terdampak. Yang teratas, tombol Retry di dialog lokasi yang tidak berfungsi, dialami hingga 64 pengguna di versi 1.0.8. Versi 1.0.9 memperbaiki empat teratas.",
  "A rare camera crash on Android 13, seen by 2 users, waits for a later release.": "Crash kamera yang jarang terjadi di Android 13, dialami 2 pengguna, menunggu rilis berikutnya.",
  "Clean Architecture with BLoC": "Clean Architecture dengan BLoC",
  "Each feature splits **data, domain and presentation**, and every call returns a result or a typed failure, so the attendance rules are tested without a device: **104 tests**, BLoCs included.":
    "Setiap fitur dipisah menjadi **data, domain, dan presentation**, dan setiap pemanggilan mengembalikan hasil atau kegagalan bertipe, sehingga aturan presensi diuji tanpa perangkat: **104 tes**, termasuk BLoC.",
  "A bounded layout on tablets": "Tata letak yang dibatasi di tablet",
  "On an **iPad**, content stops at a readable width instead of stretching edge to edge, and system text size is capped at 1.3× so large fonts don't break the layout.":
    "Di **iPad**, konten berhenti di lebar yang nyaman dibaca alih-alih melebar dari tepi ke tepi, dan ukuran teks sistem dibatasi 1,3× agar huruf besar tidak merusak tata letak.",
  "The home screen on a tablet: the same cards as on the phone, held to a readable width in the middle of the screen":
    "Layar beranda di tablet: kartu yang sama seperti di ponsel, dijaga pada lebar yang nyaman dibaca di tengah layar",
  "The same home screen on a phone and a tablet, from one codebase": "Layar beranda yang sama di ponsel dan tablet, dari satu codebase",
  "Check-in screen: the work unit, today's check-in time and the latest allowed time, and the button to take a photo and check in":
    "Layar presensi: unit kerja, jam masuk hari ini dan batas waktu terakhir, serta tombol untuk mengambil foto dan presensi",
  "Today's schedule": "Jadwal hari ini",
  "Check-in camera with a frame to line up the face": "Kamera presensi dengan bingkai untuk memosisikan wajah",
  "Selfie at check-in": "Swafoto saat presensi",
  "Check-in successful, with the recorded check-in time": "Presensi berhasil, dengan jam masuk yang tercatat",
  Recorded: "Tercatat",
  "Check-in refused: the phone is 248 metres outside the office radius": "Presensi ditolak: ponsel berada 248 meter di luar radius kantor",
  "Refused outside the radius": "Ditolak di luar radius",
  "Attendance detail: check-in and check-out times, the photo taken at each, and where each was recorded":
    "Detail presensi: jam masuk dan jam pulang, foto yang diambil di masing-masing, dan lokasi pencatatannya",
  "Photos and places on record": "Foto dan lokasi tercatat",
  "Leave request form: leave type, dates, reason and a required supporting document": "Formulir pengajuan cuti: jenis cuti, tanggal, alasan, dan dokumen pendukung yang wajib",
  "Leave with a document": "Cuti dengan dokumen",
  "Attendance is now recorded on the day, where people actually work, with lateness counted **to the minute**, and bonus cuts follow that record.":
    "Kini presensi tercatat di hari itu juga, di tempat pegawai benar-benar bekerja, dengan keterlambatan dihitung **sampai ke menit**, dan potongan tunjangan mengikuti catatan itu.",
  "4.5★": "4,5★",
  "on Google Play, from 28 ratings": "di Google Play, dari 28 penilaian",
  "99.89%": "99,89%",
  "crash-free sessions on Android": "sesi bebas crash di Android",
  "devices from one codebase: Android, iPhone and iPad": "perangkat dari satu codebase: Android, iPhone, dan iPad",

  /* ---- Alindo ---- */
  "Redesigned an IT company's website so visitors see what it does from the first screen.":
    "Mendesain ulang situs perusahaan IT agar pengunjung langsung tahu apa yang dikerjakannya sejak layar pertama.",
  "A redesign of the company website for Alindo, an IT company offering six services and six products, from web and mobile apps to AI and cloud. I worked alone, from UX and visual design in Figma to the HTML, Tailwind and JavaScript build.":
    "Desain ulang situs perusahaan Alindo, perusahaan IT dengan enam layanan dan enam produk, dari aplikasi web dan mobile hingga AI dan cloud. Saya mengerjakannya sendiri, dari desain UX dan visual di Figma hingga build HTML, Tailwind, dan JavaScript.",
  "UI/UX designer and front-end developer": "UI/UX designer dan front-end developer",
  "Alindo company website, homepage": "Situs perusahaan Alindo, halaman beranda",
  "Alindo · HTML and Tailwind": "Alindo · HTML dan Tailwind",
  "Alindo homepage: the headline “Engineering Digital Solutions for a Better Tomorrow” above four reasons to choose Alindo":
    "Beranda Alindo: judul “Engineering Digital Solutions for a Better Tomorrow” di atas empat alasan memilih Alindo",
  "Alindo offers six services and six products, from web and mobile apps to AI, cloud and cyber security. The website had to explain all of that to a first-time visitor, give every service and product its own page, show the clients and partners behind it, and lead to a project enquiry.":
    "Alindo menawarkan enam layanan dan enam produk, dari aplikasi web dan mobile hingga AI, cloud, dan keamanan siber. Situsnya harus menjelaskan semua itu kepada pengunjung baru, memberi setiap layanan dan produk halamannya sendiri, menampilkan klien dan mitra di baliknya, dan mengarahkan ke permintaan proyek.",
  "I worked alone, from UX and visual design in Figma to slicing the design and building it in HTML, CSS and JavaScript.":
    "Saya mengerjakannya sendiri, dari desain UX dan visual di Figma hingga slicing desain dan membangunnya dengan HTML, CSS, dan JavaScript.",
  "Site map and wireframes for every page": "Peta situs dan wireframe untuk setiap halaman",
  "Visual design in Figma, in the brand's navy and orange": "Desain visual di Figma, dengan warna navy dan oranye milik brand",
  "A page for each of the six services and six products, plus about, contact and the portfolio":
    "Satu halaman untuk setiap layanan dan produk (enam dan enam), ditambah halaman tentang, kontak, dan portofolio",
  "Slicing the design into assets: logo, icons and illustrations": "Slicing desain menjadi aset: logo, ikon, dan ilustrasi",
  "Responsive HTML with Tailwind CSS, from phone to desktop": "HTML responsif dengan Tailwind CSS, dari ponsel hingga desktop",
  "A mega menu for the six products, a mobile menu and a navbar that changes on scroll, in plain JavaScript":
    "Mega menu untuk enam produk, menu mobile, dan navbar yang berubah saat di-scroll, dengan JavaScript murni",
  "Scroll animations with GSAP and ScrollTrigger": "Animasi scroll dengan GSAP dan ScrollTrigger",
  "Labelled sections and menus for screen readers, and lazy-loaded images": "Bagian dan menu berlabel untuk pembaca layar, serta gambar yang dimuat secara lazy",
  Structure: "Struktur",
  "Mapped the site around Alindo's offer: a homepage that runs from why choose us through the six services, clients, partners and technology alliance to a call to start a project, then a page for each service and product.":
    "Menyusun peta situs berdasarkan penawaran Alindo: beranda yang mengalir dari alasan memilih Alindo, enam layanan, klien, mitra, dan aliansi teknologi, hingga ajakan memulai proyek, lalu satu halaman untuk setiap layanan dan produk.",
  "Designed every page in Figma in the brand's navy and orange, with the Outfit typeface.": "Mendesain setiap halaman di Figma dengan warna navy dan oranye milik brand, memakai typeface Outfit.",
  Build: "Pengembangan",
  "Sliced the design into HTML with Tailwind, wrote the interactions in plain JavaScript and the motion with GSAP, with Claude as an AI assistant.":
    "Melakukan slicing desain ke HTML dengan Tailwind, menulis interaksinya dengan JavaScript murni dan animasinya dengan GSAP, dibantu Claude sebagai asisten AI.",
  "One message above the fold": "Satu pesan di layar pertama",
  "The headline, both next steps (start a project, see the products) and four reasons to choose Alindo all fit on the first screen, so a visitor knows what the company does without scrolling.":
    "Judul, kedua langkah berikutnya (mulai proyek, lihat produk), dan empat alasan memilih Alindo muat di layar pertama, jadi pengunjung tahu apa yang dikerjakan perusahaan tanpa perlu scroll.",
  "Plain HTML and Tailwind, no framework": "HTML murni dan Tailwind, tanpa framework",
  "Static pages with no build step, so the site can be hosted anywhere and handed over as files.": "Halaman statis tanpa langkah build, jadi situsnya bisa di-hosting di mana saja dan diserahkan dalam bentuk file.",
  "Tailwind's CDN script builds the styles in the browser on every visit. A compiled CSS file would load faster.":
    "Skrip CDN Tailwind menyusun style di browser setiap kali halaman dibuka. File CSS yang sudah dikompilasi akan dimuat lebih cepat.",
  "One shared script for the site chrome": "Satu skrip bersama untuk kerangka situs",
  "The navbar, mobile menu and mega menu live in one file that every page loads, while each page loads only its own animations.":
    "Navbar, menu mobile, dan mega menu ada di satu file yang dimuat semua halaman, sementara setiap halaman hanya memuat animasinya sendiri.",
  "Motion that follows the scroll": "Animasi yang mengikuti scroll",
  "GSAP's ScrollTrigger brings each section in as it reaches the screen: the reasons to choose Alindo, a split reveal for About, a dark reveal for the services and a scatter for the client logos.":
    "ScrollTrigger dari GSAP memunculkan setiap bagian saat masuk ke layar: alasan memilih Alindo, split reveal untuk About, dark reveal untuk layanan, dan efek scatter untuk logo klien.",
  "Lighthouse performance, desktop": "Performa Lighthouse, desktop",
  Performance: "Performa",
  Accessibility: "Aksesibilitas",
  "Best Practices": "Praktik Terbaik",
  "out of 100": "dari 100",

  /* ---- Malinau ---- */
  "Modernised a regency's official portal, from one screen of icon links to a home for its services, news and announcements.":
    "Memodernisasi portal resmi sebuah kabupaten, dari satu layar ikon tautan menjadi rumah bagi layanan, berita, dan pengumumannya.",
  "A new official portal for Malinau Regency in North Kalimantan, in Indonesian and English. It replaced a single screen of icon links with a site for public services, news, announcements, events and documents, in the brand colours the regency asked for, with Dayak patterns through the design.":
    "Portal resmi baru untuk Kabupaten Malinau di Kalimantan Utara, dalam bahasa Indonesia dan Inggris. Portal ini menggantikan satu layar berisi ikon tautan dengan situs untuk layanan publik, berita, pengumuman, kegiatan, dan dokumen, dalam warna brand yang diminta kabupaten, dengan motif Dayak di seluruh desainnya.",
  "public services linked from the homepage": "layanan publik yang ditautkan dari beranda",
  "Malinau Regency Portal, homepage": "Portal Kabupaten Malinau, halaman beranda",
  "Malinau Regency Portal · Next.js": "Portal Kabupaten Malinau · Next.js",
  "Malinau Regency Portal homepage: “Welcome to Malinau Regency Portal” over a photo of a man in Dayak ceremonial dress, above the four values Indah, Tertib, Makmur and Unggul":
    "Beranda Portal Kabupaten Malinau: “Welcome to Malinau Regency Portal” di atas foto seorang pria berpakaian adat Dayak, di atas empat nilai Indah, Tertib, Makmur, dan Unggul",
  "Malinau Regency's old homepage was a single screen of eleven icon links over a photo. In February 2025 one of them still pointed to COVID-19 information, and services, news and data each sat behind an icon of its own.":
    "Beranda lama Kabupaten Malinau hanya satu layar berisi sebelas ikon tautan di atas sebuah foto. Pada Februari 2025 salah satunya masih mengarah ke informasi COVID-19, dan layanan, berita, serta data masing-masing ada di balik ikonnya sendiri.",
  "The aim was to modernise it: one portal where residents find public services, news and announcements, in the brand colours the regency asked for, and recognisably Malinau's.":
    "Tujuannya memodernisasi portal itu: satu portal tempat warga menemukan layanan publik, berita, dan pengumuman, dalam warna brand yang diminta kabupaten, dan langsung terasa khas Malinau.",
  "The old homepage, February 2025": "Beranda lama, Februari 2025",
  "The new portal": "Portal baru",
  "One screen of eleven icon links over a photo": "Satu layar berisi sebelas ikon tautan di atas sebuah foto",
  "A full homepage: main services first, then news, announcements, gallery and video":
    "Beranda lengkap: layanan utama lebih dulu, lalu berita, pengumuman, galeri, dan video",
  "Each service behind its own icon": "Setiap layanan di balik ikonnya sendiri",
  "**13 public services** in one grid, the main ones in a carousel under the hero":
    "**13 layanan publik** dalam satu grid, layanan utamanya dalam carousel di bawah hero",
  "A COVID-19 link still on the front page in 2025": "Tautan COVID-19 masih ada di halaman depan pada 2025",
  "Latest announcements with their dates and documents": "Pengumuman terbaru lengkap dengan tanggal dan dokumennya",
  "The old Malinau homepage: eleven icon links, among them Informasi Covid-19, over a photo of Dayak dancers":
    "Beranda lama Malinau: sebelas ikon tautan, di antaranya Informasi Covid-19, di atas foto penari Dayak",
  "Before: malinau.go.id in February 2025 (Wayback Machine)": "Sebelum: malinau.go.id pada Februari 2025 (Wayback Machine)",
  "The new Malinau Regency Portal homepage": "Beranda baru Portal Kabupaten Malinau",
  "After: the new portal": "Sesudah: portal baru",
  "Indonesian and English versions, switched from the header": "Versi bahasa Indonesia dan Inggris, dipilih dari header",
  "Pages for the profile, news, events, announcements and the document repository":
    "Halaman profil, berita, kegiatan, pengumuman, dan repositori dokumen",
  "The brand colours the regency asked for": "Warna brand yang diminta kabupaten",
  "Navy **#003466** and orange **#FE7700** are set once as brand colours and carry the section titles, the panels and the main buttons, so every page reads as the regency's.":
    "Navy **#003466** dan oranye **#FE7700** ditetapkan sekali sebagai warna brand dan dipakai untuk judul bagian, panel, dan tombol utama, sehingga setiap halaman terasa milik kabupaten.",
  "Dayak patterns, used with restraint": "Motif Dayak, dipakai secukupnya",
  "Dayak ornaments frame the main services, sit in the corners of the regent's welcome and the announcements, and open the footer as a coloured band, so the portal looks like Malinau without getting in the way of the content.":
    "Ornamen Dayak membingkai layanan utama, mengisi sudut sambutan bupati dan pengumuman, serta membuka footer sebagai pita berwarna, sehingga portal terasa khas Malinau tanpa mengganggu konten.",
  "Services before news": "Layanan sebelum berita",
  "The main services sit straight under the hero, so someone who came for a service reaches it without scrolling past the latest news.":
    "Layanan utama berada tepat di bawah hero, sehingga orang yang datang untuk sebuah layanan langsung menemukannya tanpa melewati berita terbaru.",
  "Two languages": "Dua bahasa",
  "Every visitor can switch between Indonesian and English from the header.": "Setiap pengunjung bisa beralih antara bahasa Indonesia dan Inggris dari header.",
  "Main Services on the portal: Dayak ornaments in both top corners, the title in navy, the orange SAGET button in the header":
    "Layanan Utama di portal: ornamen Dayak di kedua sudut atas, judul berwarna navy, tombol SAGET oranye di header",
  "Dayak ornaments frame the main services; navy titles, the orange button in the header.":
    "Ornamen Dayak membingkai layanan utama; judul navy, tombol oranye di header.",
  "The portal's footer, opened by a band of Dayak pattern in yellow, teal and grey": "Footer portal, dibuka oleh pita motif Dayak berwarna kuning, toska, dan abu-abu",
  "A band of Dayak pattern opens the footer.": "Pita motif Dayak membuka footer.",
  "Visit the live site": "Kunjungi situsnya",
  "Brand and pattern": "Brand dan motif",
  "I was the front-end developer: I built what residents see and use, in Next.js, from the homepage to the news, events and document pages.":
    "Saya front-end developer-nya: saya membangun semua yang dilihat dan dipakai warga dengan Next.js, dari beranda hingga halaman berita, kegiatan, dan dokumen.",
  "The homepage in Next.js: main services first, then news, announcements, gallery and video":
    "Beranda dengan Next.js: layanan utama lebih dulu, lalu berita, pengumuman, galeri, dan video",
  "The regency's navy and orange set once as brand colours, and the Dayak ornaments placed in the layout":
    "Navy dan oranye milik kabupaten ditetapkan sekali sebagai warna brand, dan ornamen Dayak ditempatkan di layout",
  "Responsive layouts with Tailwind CSS, from phone to desktop": "Layout responsif dengan Tailwind CSS, dari ponsel hingga desktop",
  "Built the homepage so the main services sit straight under the hero, before news, announcements, the gallery and video.":
    "Membangun beranda sehingga layanan utama berada tepat di bawah hero, sebelum berita, pengumuman, galeri, dan video.",
  "Set the regency's navy and orange once as brand colours and placed the Dayak ornaments where they frame content without competing with it.":
    "Menetapkan navy dan oranye milik kabupaten sekali sebagai warna brand dan menempatkan ornamen Dayak di tempat yang membingkai konten tanpa bersaing dengannya.",
  "Languages and content": "Bahasa dan konten",
  "Indonesian and English routes in Next.js; photos and documents load from the regency's own CDN.":
    "Rute bahasa Indonesia dan Inggris di Next.js; foto dan dokumen dimuat dari CDN milik kabupaten sendiri.",
  "Live since 2025 at malinau.go.id, it's where the regency now publishes its news, announcements and documents, in Indonesian and English, with its services one click from the homepage.":
    "Aktif sejak 2025 di malinau.go.id, portal ini kini menjadi tempat kabupaten menerbitkan berita, pengumuman, dan dokumennya, dalam bahasa Indonesia dan Inggris, dengan layanannya satu klik dari beranda.",
  "Brand navy": "Navy brand",
  "Brand orange": "Oranye brand",

  /* ---- Case study headings ---- */
  "All work": "Semua karya",
  "The problem": "Masalahnya",
  "Before and after": "Sebelum dan sesudah",
  "My role": "Peran saya",
  Screens: "Tampilan layar",
  "Get the app": "Dapatkan aplikasinya",
  Download: "Unduh",
  "the App Store": "App Store",
  Process: "Proses",
  "Key decisions": "Keputusan penting",
  "Trade-off": "Konsekuensinya",
  Result: "Hasil",
  Links: "Tautan",
  "Next project": "Proyek berikutnya",
  "Case study": "Studi kasus",

  /* ---- How I work ---- */
  "How I work": "Cara saya bekerja",
  "From First Sketch to Live App.": "Dari Sketsa Pertama hingga Aplikasi Live.",
  "No hand-off between designer and developer: the person you brief is the person who ships it.":
    "Tanpa serah terima antara desainer dan developer: orang yang Anda beri arahan adalah orang yang merilisnya.",
  "Start a project": "Mulai proyek",
  "See my work": "Lihat karya saya",
  Step: "Langkah",
  Discover: "Riset",
  "A call about your users, your goals and your deadline. You get a written scope before any work starts.":
    "Diskusi tentang pengguna, tujuan, dan tenggat Anda. Anda menerima ruang lingkup tertulis sebelum pekerjaan dimulai.",
  "Wireframes first, then Figma screens built on a design system, so you can click through the app before any code exists.":
    "Wireframe dulu, lalu layar Figma yang dibangun di atas design system, jadi Anda bisa mencoba alur aplikasinya sebelum ada satu baris kode pun.",
  "Flutter for mobile, React and Next.js for the web, built from the same design tokens, with test builds along the way.":
    "Flutter untuk mobile, React dan Next.js untuk web, dibangun dari design token yang sama, dengan build uji coba di sepanjang jalan.",
  Launch: "Rilis",
  "Testing on real devices, release to the stores or the server, and support after go-live.": "Pengujian di perangkat sungguhan, rilis ke store atau server, dan dukungan setelah live.",

  /* ---- About ---- */
  "From Design to Production, Under One Roof.": "Dari Desain hingga Produksi, dalam Satu Atap.",
  "Juliansyah, smiling, in a green batik shirt against an orange background": "Juliansyah tersenyum, mengenakan kemeja batik hijau dengan latar oranye",
  "Find me online": "Temukan saya di internet",
  "Who I am": "Tentang saya",
  "A designer who codes. I design apps, then build them myself, for mobile and the web.":
    "Desainer yang juga menulis kode. Saya merancang aplikasi, lalu membangunnya sendiri, untuk mobile dan web.",
  "Cross-platform mobile apps": "Aplikasi mobile lintas platform",
  "One codebase for Android and iOS, on an architecture your team can keep extending.": "Satu codebase untuk Android dan iOS, dengan arsitektur yang bisa terus dikembangkan tim Anda.",
  "UI/UX and design systems": "UI/UX dan design system",
  "Flows, wireframes and prototypes, plus the tokens and components that keep design and code in sync.":
    "Alur, wireframe, dan prototipe, ditambah token dan komponen yang menjaga desain dan kode tetap selaras.",
  "Type-safe web apps": "Aplikasi web type-safe",
  "Fast, accessible sites and web apps, built straight from the design with no hand-off gap.":
    "Situs dan aplikasi web yang cepat dan aksesibel, dibangun langsung dari desainnya tanpa celah serah terima.",
  "Motion and interaction": "Animasi dan interaksi",
  "Transitions and micro-interactions that explain what just happened.": "Transisi dan micro-interaction yang menjelaskan apa yang baru saja terjadi.",
  "Flutter animations": "Animasi Flutter",
  "Performance and accessibility": "Performa dan aksesibilitas",
  "Core Web Vitals budgets and WCAG AA from the first commit, checked before launch.": "Target Core Web Vitals dan WCAG AA sejak commit pertama, diperiksa sebelum rilis.",

  /* ---- Playground ---- */
  "Small experiments, built for fun.": "Eksperimen kecil, dibuat untuk bersenang-senang.",
  "Motion studies and interface ideas I build between projects. Go ahead and play.": "Studi animasi dan ide antarmuka yang saya buat di sela proyek. Silakan dicoba.",
  Open: "Buka",
  "Load experiment": "Muat eksperimen",
  Source: "Kode sumber",

  /* ---- Kind words ---- */
  "Kind words": "Kata mereka",
  "Trusted by the Teams I've Built For.": "Dipercaya oleh Tim yang Pernah Bekerja dengan Saya.",
  "Clients on what working together was like, quoted with their permission.": "Klien bercerita tentang pengalaman bekerja sama, dikutip dengan izin mereka.",

  /* ---- Contact ---- */
  "Tell me what you're building.": "Ceritakan apa yang sedang Anda bangun.",
  "One message is enough to start: what you're making, who it's for and when you need it.":
    "Satu pesan sudah cukup untuk memulai: apa yang Anda buat, untuk siapa, dan kapan Anda membutuhkannya.",
  "Project enquiry via your portfolio": "Pertanyaan proyek dari portofolio Anda",
  "Hi Juliansyah,\n\nWhat I'm building:\n\nWho it's for:\n\nWhen I need it:\n\n": "Halo Juliansyah,\n\nYang sedang saya bangun:\n\nUntuk siapa:\n\nKapan saya membutuhkannya:\n\n",
  "Copy email address": "Salin alamat email",
  Copy: "Salin",
  Copied: "Tersalin",
  "Email address copied": "Alamat email tersalin",
  "Address selected. Copy it from the menu.": "Alamat sudah dipilih. Salin dari menu.",
  "Address selected. Press ⌘C or Ctrl+C.": "Alamat sudah dipilih. Tekan ⌘C atau Ctrl+C.",
  "WhatsApp me": "Chat via WhatsApp",
  "Chat on WhatsApp": "Chat lewat WhatsApp",
  "Hi Juliansyah, I found you through your portfolio.\n\nWhat I'm building:\nWho it's for:\nWhen I need it:":
    "Halo Juliansyah, saya menemukan Anda lewat portofolio Anda.\n\nYang sedang saya bangun:\nUntuk siapa:\nKapan saya membutuhkannya:",
  "Hiring for a role?": "Sedang merekrut?",
  Résumé: "CV",
  "You talk to me directly.": "Anda langsung berbicara dengan saya.",
  Availability: "Ketersediaan",
  "Taking new projects now · open to remote work": "Menerima proyek baru · terbuka untuk kerja remote",
  "What happens next": "Langkah selanjutnya",
  "You send a few lines by email or WhatsApp, in English or Bahasa Indonesia.": "Anda mengirim beberapa kalimat lewat email atau WhatsApp, dalam bahasa Inggris atau Bahasa Indonesia.",
  "I reply with my questions {reply}.": "Saya membalas dengan pertanyaan saya {reply}.",
  "A short call, then a written scope before any work starts.": "Diskusi singkat, lalu ruang lingkup tertulis sebelum pekerjaan dimulai.",
  "within one working day": "dalam satu hari kerja",
  "Time zone": "Zona waktu",

  /* ---- Footer ---- */
  "About me": "Tentang saya",
  "View my résumé": "Lihat CV saya",
  "PDF on Google Drive": "PDF di Google Drive",
  "View code on": "Lihat kode di",
  "Email me at": "Kirim email ke",
  "Last updated": "Terakhir diperbarui",
  "Built with Next.js, React Three Fiber and GSAP. The particle portrait is generated from a photo of me.":
    "Dibangun dengan Next.js, React Three Fiber, dan GSAP. Potret partikelnya dibuat dari foto saya.",
  "All rights reserved.": "Hak cipta dilindungi.",

  /* ---- Interface ---- */
  "Skip to main content": "Langsung ke konten utama",
  "Juliansyah, home": "Juliansyah, beranda",
  "Play video": "Putar video",
  "Pause video": "Jeda video",
};

/** Lines that read the same in Indonesian (tools, product names), so the check doesn't ask for them. */
export const unchanged: string[] = [
  "Pangkalpinang, Indonesia",
  "Pangkalpinang, Bangka Belitung",
  "Pangkalpinang, Indonesia · UTC+7",
  "GitHub",
  "LinkedIn",
  "Dribbble",
  "Email",
  "Flutter developer · Front-end developer · UI/UX designer",
  "Flutter · Front-end · UI/UX",
  "Moondance Design System",
  "Analytics",
  "Hot",
  "AI",
  "12K+",
  "Web, UI/UX & mobile",
  "Platform",
  "Presensi PKP",
  "Presensi PKP · Flutter",
  "Google Play",
  "Tools",
  // Tools and stack
  "Flutter",
  "Dart",
  "BLoC",
  "Riverpod",
  "Firebase",
  "Figma",
  "Prototyping",
  "Design tokens",
  "Component libraries",
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Rive",
  "Lighthouse",
  "Front end",
  "Front-end developer",
  "Layout",
  "Tailwind CSS",
  "shadcn/ui",
  "SEO",
  "desktop",
  "mobile",
  "Core Web Vitals",
  "WCAG AA",
  "Clean Architecture",
  "GetIt",
  "Dio",
  "GoRouter",
  "Crashlytics",
  "Performance Monitoring",
  "Cloud Messaging",
  "Android",
  "iOS",
  "iPadOS",
  "bloc_test",
  "Codemagic CI",
];
