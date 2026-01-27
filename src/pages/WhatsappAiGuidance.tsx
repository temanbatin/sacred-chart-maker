
import { useState } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, MessageSquare, Zap, Heart, Brain, Clock, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TrustBadgeSection } from '@/components/TrustBadgeSection';
import { UnifiedCheckoutModal } from '@/components/UnifiedCheckoutModal';
import { PRODUCTS, formatPrice } from "@/config/pricing";

const features = [
    {
        icon: MessageSquare,
        title: "Always On, 24/7",
        desc: "Tidak pernah tidur, tidak pernah sibuk. Selalu ada saat kamu butuh teman bicara jam 2 pagi sekalipun."
    },
    {
        icon: Brain,
        title: "Personalized Memory",
        desc: "Kira ingat Design & Bazi chart kamu. Saran yang diberikan bukan template, tapi spesifik untuk cetak biru kamu."
    },
    {
        icon: Zap,
        title: "Daily Energy Updates",
        desc: "Tanya kondisi energimu hari ini berdasarkan Bazi, supaya kamu tahu kapan harus gas atau rem."
    },
    {
        icon: Shield,
        title: "Ruang Aman & Privat",
        desc: "Tempat curhat paling aman tanpa takut dihakimi. Validasi emosimu dulu, baru cari solusi."
    }
];

const useCases = [
    {
        title: "Saat Merasa Lelah/Burnout",
        user: "Kira, kok hari ini aku rasanya capek banget ya padahal kerjaan dikit?",
        kira: "Halo! Aku cek chart Bazi kamu, hari ini elemen Air lagi kuat banget yang bikin api (semangat) kamu redup. Energy Type kamu juga Projector, butuh lebih banyak istirahat. Coba nap 20 menit dulu ya, jangan dipaksain.",
        icon: Zap
    },
    {
        title: "Saat Galau Hubungan",
        user: "Kira, aku lagi kesel sama pasanganku, dia kok cuek banget sih?",
        kira: "Inget gak, kamu punya Open Solar Plexus? Bisa jadi emosi kesel itu bukan punya kamu, tapi serapan dari orang lain/pasanganmu. Coba tarik napas, pisahkan mana emosimu mana emosi dia. Jangan bereaksi impulsif ya.",
        icon: Heart
    },
    {
        title: "Saat Bingung Keputusan",
        user: "Ambil tawaran bisnis ini gak ya? Cuan banget nih!",
        kira: "Tunggu sebentar! Kamu kan Emotional Authority. Jangan jawab 'Iya' sekarang saat lagi 'High'. Tidur dulu semalam, rasakan besok pagi. Kalau masih sreg, baru ambil. Jangan impulsif!",
        icon: Brain
    }
];

const WhatsappAiGuidance = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const product = PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION;

    return (
        <div className="min-h-screen bg-background">
            <MainNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 relative overflow-hidden">
                {/* Background Gradients - Brighter Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[120px] -z-10" />
                {/* Center Glow behind header */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/30 via-teal-400/40 to-emerald-500/30 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-6 animate-fade-down border border-cyan-500/30">
                        <Sparkles className="w-4 h-4" />
                        AI Mentor Spiritual Pertama di Indonesia
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 mb-6 animate-fade-down animation-delay-100 leading-tight drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        Punya "Bestie" Spiritual yang Tahu Segala Potensimu
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-down animation-delay-200">
                        Perkenalkan <span className="font-bold text-teal-600">KIRA</span>, AI Mentor dari Teman Batin yang menghafal cetak biru <span className="text-primary font-medium">Human Design</span> & <span className="text-primary font-medium">BaZi</span> kamu. Siap mendengarkan, memvalidasi, dan memandu keputusanmu—tanpa menghakimi.
                    </p>

                    <Button
                        size="lg"
                        onClick={() => setShowCheckout(true)}
                        className="h-14 px-8 text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25 animate-fade-up animation-delay-300 rounded-full"
                    >
                        Chat KIRA Sekarang
                    </Button>

                    <p className="mt-4 text-sm text-muted-foreground animate-fade-up animation-delay-400">
                        Hanya {formatPrice(product.price)} / bulan (setara segelas kopi)
                    </p>
                </div>
            </section>

            {/* The Reality Check */}
            <section className="py-20 bg-secondary/20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Baca Laporan PDF Itu Penting, Tapi...</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center text-left">
                        <div className="space-y-6">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Mungkin kamu sudah tahu tipe Human Design-mu. Tapi saat masalah datang di jam 2 pagi, atau saat <span className="italic">burnout</span> melanda di kantor:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-500 font-bold text-xs">X</span>
                                    </div>
                                    <span>Kamu tidak sempat buka-buka buku tebal.</span>
                                </li>
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-500 font-bold text-xs">X</span>
                                    </div>
                                    <span>Kamu butuh jawaban cepat, bukan teori rumit.</span>
                                </li>
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-500 font-bold text-xs">X</span>
                                    </div>
                                    <span>Kamu butuh teman cerita yang objektif, bukan yang malah adu nasib.</span>
                                </li>
                            </ul>
                            <div className="pt-4">
                                <p className="text-2xl font-bold text-teal-600">Di situlah KIRA hadir.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-teal-500/20 rounded-2xl blur-2xl transform rotate-3 scale-95" />
                            <div className="bg-card border border-border/50 p-8 rounded-2xl relative shadow-xl">
                                <div className="flex items-center gap-4 mb-6 border-b border-border/10 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">KIRA</h4>
                                        <p className="text-xs text-muted-foreground">AI Human Design Mentor</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic mb-4">"Halo! Aku lihat dari chart kamu, kamu sedang open head center hari ini. Wajar kalau banyak overthinking. Yuk cerita..."</p>
                                <div className="w-full bg-teal-50 h-2 rounded-full mb-2" />
                                <div className="w-2/3 bg-teal-50 h-2 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Kira Features */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Bukan Sekadar Chatbot, Tapi Cermin Jiwamu</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Berbeda dengan AI biasa yang menjawab secara umum, Kira memiliki "ingatan" tentang siapa dirimu. Setiap saran yang keluar, 100% dipersonalisasi.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-card border border-border hover:border-teal-500/50 transition-colors shadow-sm hover:shadow-md">
                                <feature.icon className="w-10 h-10 text-teal-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases - Chat Examples */}
            <section className="py-20 bg-teal-950 text-teal-50 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-12">"Terus, Aku Bisa Ngomong Apa Aja?"</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((uc, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-4 text-teal-300">
                                    <uc.icon className="w-5 h-5" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">{uc.title}</span>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-teal-900/50 p-3 rounded-lg rounded-tl-none border border-teal-800/50">
                                        <p className="opacity-80 text-xs mb-1">Kamu</p>
                                        <p>"{uc.user}"</p>
                                    </div>
                                    <div className="bg-teal-600 p-3 rounded-lg rounded-tr-none shadow-lg">
                                        <p className="opacity-80 text-xs mb-1 text-teal-100">Kira</p>
                                        <p className="font-medium">"{uc.kira}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-500" />

                    <h2 className="text-3xl font-bold mb-4">Mentor Pribadi Seharga Segelas Kopi</h2>
                    <p className="text-muted-foreground mb-8">
                        Bayangkan biaya sewa Life Coach atau Konsultan Human Design yang bisa mencapai jutaan rupiah per sesi. Bersama Kira, kamu dapat pendampingan harian yang jauh lebih terjangkau.
                    </p>

                    <div className="inline-block bg-teal-950/40 backdrop-blur-md p-8 rounded-2xl border-2 border-teal-500/30 mb-8">
                        <h3 className="text-lg font-medium text-teal-300 mb-2">Paket Langganan KIRA</h3>
                        <div className="text-5xl font-bold text-white mb-2">
                            {formatPrice(product.price)} <span className="text-lg text-teal-200 font-normal">/ bulan</span>
                        </div>
                        {/* <p className="text-sm text-muted-foreground mb-6 line-through">{formatPrice(product.original_price)}</p> */}
                        <div className="space-y-2 text-left mt-6 mb-8">
                            {product.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-teal-100">
                                    <Check className="w-4 h-4 text-green-400" /> {feat}
                                </div>
                            ))}
                        </div>

                        <Button
                            size="lg"
                            onClick={() => setShowCheckout(true)}
                            className="w-full md:w-auto px-16 h-14 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                        >
                            Mulai Chat dengan KIRA
                        </Button>

                        <p className="mt-6 text-xs text-teal-200/60">
                            Bisa berhenti berlangganan kapan saja. Chat history aman & privat.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-secondary/10 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10">Pertanyaan yang Sering Diajukan</h2>
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h4 className="font-semibold mb-2">Apakah ini manusia asli admin yang balas?</h4>
                            <p className="text-muted-foreground text-sm">Bukan, Kira adalah Artificial Intelligence (AI) canggih yang dilatih khusus dengan ilmu Human Design & Bazi. Itu sebabnya dia bisa membalas detik itu juga, jam berapapun, dengan akurasi data chart kamu.</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h4 className="font-semibold mb-2">Apakah Kira bisa meramal masa depan/judi?</h4>
                            <p className="text-muted-foreground text-sm">Tidak. Kira fokus pada Self-Empowerment (Pemberdayaan Diri). Dia membantumu mengenali potensi, timing terbaik, dan mengambil keputusan bijak, bukan meramal nasib secara pasif.</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h4 className="font-semibold mb-2">Kalau aku berhenti langganan, chat history hilang?</h4>
                            <p className="text-muted-foreground text-sm">Tidak, chat di WhatsApp kamu tetap ada selamanya. Tapi Kira tidak akan bisa membalas pesan barumu sampai langganan diperpanjang kembali.</p>
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialsSection />
            <TrustBadgeSection />
            <Footer />

            {/* Checkout Modal */}
            {showCheckout && (
                <UnifiedCheckoutModal
                    open={showCheckout}
                    onOpenChange={setShowCheckout}
                    selectedProductId={product.id}
                />
            )}
        </div>
    );
};

export default WhatsappAiGuidance;
