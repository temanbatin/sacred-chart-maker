
import { useState } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, Star, Shield, Clock, Compass, Zap, Flame, Calendar, CloudLightning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TrustBadgeSection } from '@/components/TrustBadgeSection';
import { UnifiedCheckoutModal } from '@/components/UnifiedCheckoutModal';
import { PRODUCTS, formatPrice } from "@/config/pricing";

const features = [
    {
        icon: Compass,
        title: "Analisis Day Master",
        desc: "Temukan elemen inti diri Anda (Kayu, Api, Tanah, Logam, atau Air) dan potensinya."
    },
    {
        icon: Zap,
        title: "Luck Pillars (Peruntungan)",
        desc: "Peta siklus keberuntungan 10 tahunan Anda. Kapan harus gas pol, kapan harus rem."
    },
    {
        icon: Flame,
        title: "Kekuatan & Kelemahan",
        desc: "Analisis keseimbangan 5 elemen untuk kesehatan, kekayaan, dan karir."
    },
    {
        icon: Calendar,
        title: "Forecast Tahunan",
        desc: "Strategi spesifik untuk menghadapi energi tahun berjalan."
    },
    {
        icon: CloudLightning,
        title: "Weather Report Hidup",
        desc: "Jika Human Design adalah Mesinnya, Bazi adalah Cuacanya. Ketahui kapan cuaca cerah untuk berlayar."
    }
];

const BaziReports = () => {
    const [showCheckout, setShowCheckout] = useState(false);

    const product = PRODUCTS.BAZI_ONLY;

    return (
        <div className="min-h-screen bg-background">
            <MainNavbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium mb-6 animate-fade-down">
                        <Flame className="w-4 h-4" />
                        New Product Release
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600 mb-6 animate-fade-down animation-delay-100">
                        Analisis Bazi: Weather & Fuel Report
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-down animation-delay-200">
                        Jika <span className="font-semibold text-primary">Human Design</span> adalah <span className="text-primary italic">Blueprint</span> (Cara kerja mesin diri Anda), maka <span className="font-semibold text-red-600">Bazi</span> adalah <span className="text-red-600 italic">Weather Forecast</span> & <span className="text-red-600 italic">Fuel Gauge</span> Anda.
                    </p>

                    <Button
                        size="lg"
                        onClick={() => setShowCheckout(true)}
                        className="h-14 px-8 text-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 animate-fade-up animation-delay-300"
                    >
                        Dapatkan Analisis Lengkap
                    </Button>

                    <p className="mt-4 text-sm text-muted-foreground animate-fade-up animation-delay-400">
                        <span className="font-medium text-foreground">Bundle Spesial:</span> Sudah termasuk Full Human Design Report (Hemat 60%)
                    </p>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* HD Card */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Compass className="w-24 h-24" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Human Design</h3>
                            <p className="text-sm font-mono text-primary mb-6">THE BLUEPRINT</p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-2"><Check className="w-5 h-5 text-primary" /> Siapa diri Anda sebenarnya</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-primary" /> Apa bakat alami (Gift) Anda</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-primary" /> Bagaimana cara mengambil keputusan</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-primary" /> Strategi berinteraksi dengan dunia</li>
                            </ul>
                        </div>

                        {/* Bazi Card */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-red-950/30 to-background border border-red-500/30 relative overflow-hidden shadow-lg shadow-red-500/5 group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Flame className="w-24 h-24 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-red-500">Bazi (Four Pillars)</h3>
                            <p className="text-sm font-mono text-red-400 mb-6">THE TIMING & RESOURCES</p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-2"><Check className="w-5 h-5 text-red-500" /> Kapan waktu terbaik bertindak</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-red-500" /> Potensi keberuntungan tahunan</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-red-500" /> Elemen penyeimbang hidup</li>
                                <li className="flex gap-2"><Check className="w-5 h-5 text-red-500" /> Kapasitas kekayaan & karir</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Apa yang Anda Dapatkan?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Paket komprehensif yang menggabungkan dua sistem kuno terbaik untuk navigasi kehidupan modern.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-card border border-border hover:border-red-500/50 transition-colors">
                                <feature.icon className="w-10 h-10 text-red-500 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.desc}</p>
                            </div>
                        ))}
                        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                            <Star className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">PLUS: Full Human Design Report</h3>
                            <p className="text-muted-foreground text-sm">Sudah termasuk laporan lengkap Human Design 100+ halaman senilai {formatPrice(PRODUCTS.FULL_REPORT.price)}.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section className="py-20 bg-secondary/10 px-4">
                <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                        BEST VALUE BUNDLE
                    </div>

                    <h2 className="text-3xl font-bold mb-6">Siap Mengetahui "Cuaca" Hidup Anda?</h2>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className="text-2xl text-muted-foreground line-through decoration-red-500/50">
                            {formatPrice(product.original_price)}
                        </span>
                        <span className="text-4xl md:text-5xl font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <ul className="max-w-md mx-auto space-y-3 mb-8 text-left">
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Bazi Life Analysis & Forecast</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Full Human Design Report (100+ Pages)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Lifetime Access</span>
                        </li>
                    </ul>

                    <Button
                        size="lg"
                        onClick={() => setShowCheckout(true)}
                        className="w-full md:w-auto px-12 h-14 text-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        Beli Bundle Sekarang
                    </Button>

                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" /> Secure Payment
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Instant Delivery
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
                    selectedProductId={product.id} // Bazi Product ID
                />
            )}
        </div>
    );
};

export default BaziReports;
