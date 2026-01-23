/**
 * Human Design Chart Constants
 * Extracted from ChartResult.tsx for reusability
 */

// Planet symbols mapping for display
export const planetSymbols: Record<string, string> = {
    Sun: "☉",
    Earth: "⊕",
    Moon: "☾",
    North_Node: "Ω",
    South_Node: "☋",
    Mercury: "☿",
    Venus: "♀",
    Mars: "♂",
    Jupiter: "♃",
    Saturn: "♄",
    Uranus: "♅",
    Neptune: "♆",
    Pluto: "♇",
};

// Format planet name for display
export const formatPlanetName = (name: string): string => {
    return name.replace("_", " ");
};

// Planet descriptions for tooltips
export const planetDescriptions: Record<string, { title: string; description: string }> = {
    Sun: {
        title: "Matahari ☉",
        description: "Inti dari identitasmu. Mewakili 70% dari energi dan tema hidup utamamu.",
    },
    Earth: {
        title: "Bumi ⊕",
        description: "Grounding dan stabilitas. Bagaimana kamu membumi dan menyeimbangkan energi Matahari.",
    },
    Moon: {
        title: "Bulan ☾",
        description: "Dorongan dan motivasi. Apa yang mendorongmu maju dalam hidup.",
    },
    North_Node: {
        title: "North Node Ω",
        description: "Arah masa depan. Lingkungan dan orang yang membawa pertumbuhan.",
    },
    South_Node: {
        title: "South Node ☋",
        description: "Pengalaman masa lalu. Apa yang sudah kamu kuasai dan bawa dari kehidupan sebelumnya.",
    },
    Mercury: {
        title: "Merkurius ☿",
        description: "Komunikasi dan pikiran. Bagaimana kamu berpikir dan menyampaikan ide.",
    },
    Venus: {
        title: "Venus ♀",
        description: "Nilai dan moral. Apa yang kamu hargai dan bagaimana kamu berhubungan dengan orang lain.",
    },
    Mars: {
        title: "Mars ♂",
        description: "Energi dan ketidakdewasaan. Dimana kamu perlu tumbuh dan berkembang.",
    },
    Jupiter: {
        title: "Jupiter ♃",
        description: "Hukum dan keberuntungan. Dimana kamu menemukan ekspansi dan peluang.",
    },
    Saturn: {
        title: "Saturnus ♄",
        description: "Disiplin dan batasan. Dimana kamu perlu struktur dan tanggung jawab.",
    },
    Uranus: {
        title: "Uranus ♅",
        description: "Keunikan dan inovasi. Tema yang tidak biasa dalam hidupmu.",
    },
    Neptune: {
        title: "Neptunus ♆",
        description: "Ilusi dan spiritualitas. Dimana kamu perlu kejelasan dan kesadaran.",
    },
    Pluto: {
        title: "Pluto ♇",
        description: "Transformasi dan kebenaran. Dimana kamu mengalami perubahan mendalam.",
    },
};

// Variable descriptions for tooltips
export const variableDescriptions: Record<string, { title: string; description: string }> = {
    Digestion: {
        title: "Digestion (Design - Otak)",
        description:
            "Cara terbaik bagi tubuhmu untuk mencerna makanan dan informasi. Arrow kiri = Aktif/Spesifik, Arrow kanan = Pasif/Umum.",
    },
    Environment: {
        title: "Environment (Design - Tubuh)",
        description: "Lingkungan fisik yang mendukung kesejahteraanmu. Arrow kiri = Selektif, Arrow kanan = Variabel.",
    },
    Motivation: {
        title: "Motivation (Personality - Pikiran)",
        description: "Motivasi sejatimu dalam berpikir. Arrow kiri = Strategis/Fokus, Arrow kanan = Reseptif/Terbuka.",
    },
    Perspective: {
        title: "Perspective (Personality - Pandangan)",
        description: "Cara unikmu melihat dan memahami dunia. Arrow kiri = Fokus, Arrow kanan = Periferal.",
    },
};

// Human Design Type descriptions
export const typeDescriptions: Record<string, string> = {
    Generator:
        "Kamu adalah sumber energi kehidupan dunia. Kamu memiliki daya tahan yang luar biasa, dan dirancang untuk membangun sesuatu yang besar dan bermakna. Kuncinya adalah menggunakan energimu hanya untuk hal-hal yang benar-benar memicu antusiasme di dalam dirimu.",
    "Manifesting Generator":
        "Kamu adalah tipe energi yang paling cepat dan efisien. Dirancang untuk menangani banyak hal sekaligus, kamu memiliki kemampuan unik untuk menemukan jalan pintas dan mewujudkan berbagai ide menjadi kenyataan dalam waktu singkat.",
    Projector:
        "Kamu tidak lahir untuk bekerja keras secara fisik, melainkan untuk melihat pola dan potensi yang tidak dilihat orang lain. Kamu adalah kompas bagi orang di sekitarmu, yang hadir untuk membimbing dan mengarahkan orang lain menuju kesuksesan.",
    Manifestor:
        "Kamu adalah pemantik perubahan. Kamu memiliki kekuatan alami untuk memulai sesuatu secara mandiri, kamu tidak perlu menunggu izin atau bantuan orang lain untuk bergerak. Kehadiranmu berfungsi untuk membuka pintu baru dan menginspirasi pergerakan besar.",
    Reflector:
        "Kamu adalah tipe yang paling langka, berfungsi sebagai cermin objektif bagi lingkungan sekitarmu. Kamu memiliki kemampuan luar biasa untuk merasakan kesehatan dan keharmonisan suatu tempat, memberikan perspektif yang sangat dalam tentang kondisi dunia di sekelilingmu.",
};

// Strategy descriptions
export const strategyDescriptions: Record<string, string> = {
    "To Respond":
        "Jangan memaksakan aksi. Biarkan dunia memberikan sinyal atau peluang, lalu bertindaklah hanya saat energimu merespon tanda tersebut secara alami.",
    "Wait to Respond":
        "Jangan memaksakan aksi. Biarkan dunia memberikan sinyal atau peluang, lalu bertindaklah hanya saat energimu merespon tanda tersebut secara alami.",
    "Wait for the Invitation":
        "Efektivitasmu muncul saat kamu diakui. Tunggu undangan atau apresiasi tulus dari orang lain sebelum kamu membagikan bimbingan dan arahanmu.",
    "To Inform":
        "Amankan langkahmu dengan berkomunikasi. Beritahu orang-orang di sekitarmu tentang rencana besarmu agar jalanmu bebas dari hambatan dan resistensi.",
    Inform:
        "Amankan langkahmu dengan berkomunikasi. Beritahu orang-orang di sekitarmu tentang rencana besarmu agar jalanmu bebas dari hambatan dan resistensi.",
    "Wait a Lunar Cycle": "Beri dirimu 28 hari untuk merasakan kejelasan sebelum keputusan besar.",
};

// Authority descriptions
export const authorityDescriptions: Record<string, string> = {
    Sacral:
        'Gunakan gut feeling atau respon fisik spontan dari perutmu. Percayai jawaban instan seperti "uh-huh" (ya) atau "un-un" (tidak) saat ini juga.',
    Emotional:
        "Hindari keputusan impulsif. Kejelasan sejati datang saat gelombang emosimu sudah tenang. Jangan memutuskan sesuatu di puncak rasa senang maupun sedih.",
    "Solar Plexus":
        "Hindari keputusan impulsif. Kejelasan sejati datang saat gelombang emosimu sudah tenang. Jangan memutuskan sesuatu di puncak rasa senang maupun sedih.",
    Splenic:
        "Percayai insting instan demi keamanan dan kesehatanmu. Jawaban terbaik muncul dalam sekejap—perhatikan peringatan halus dari tubuhmu tanpa perlu berpikir lama.",
    Spleen:
        "Percayai insting instan demi keamanan dan kesehatanmu. Jawaban terbaik muncul dalam sekejap—perhatikan peringatan halus dari tubuhmu tanpa perlu berpikir lama.",
    "Ego Manifested": "Dengarkan apa yang benar-benar kamu inginkan dari hatimu.",
    "Ego Projected": "Bicarakan keinginanmu dan dengarkan apa yang keluar dari mulutmu.",
    "Self Projected":
        "Suarakan pilihanmu kepada orang lain. Kamu akan menemukan kebenaran melalui apa yang keluar dari mulutmu, bukan melalui apa yang kamu pikirkan di kepala.",
    "Self-Projected":
        "Suarakan pilihanmu kepada orang lain. Kamu akan menemukan kebenaran melalui apa yang keluar dari mulutmu, bukan melalui apa yang kamu pikirkan di kepala.",
    Mental: "Diskusikan dengan orang terpercaya dan perhatikan lingkunganmu.",
    None: "Kamu adalah Reflector - tunggu satu siklus bulan penuh sebelum keputusan besar.",
    Lunar:
        "Biarkan waktu yang memberikan jawaban. Berikan dirimu jeda satu siklus bulan penuh (28 hari) untuk mendapatkan kejernihan total sebelum mengambil komitmen besar.",
};

// Report slides for preview carousel
import reportSS1 from "@/assets/Report SS.webp";
import reportSS2 from "@/assets/Report SS 2.webp";
import reportSS3 from "@/assets/Report SS 3.webp";

export const reportSlides = [
    { img: reportSS1, title: "Daftar Isi Lengkap", desc: "100+ halaman strukturnya jelas, mudah diikuti dari awal hingga akhir" },
    { img: reportSS2, title: "Langkah Praktis Sesuai Authority", desc: "Panduan spesifik berdasarkan cara kamu membuat keputusan terbaik" },
    { img: reportSS3, title: "Strategi Personal Kehidupan", desc: "Cara memanfaatkan kekuatan unikmu di karir, relasi, dan keseharian" },
];
