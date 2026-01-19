import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import reportSS1 from "@/assets/Report SS.jpg";
import reportSS2 from "@/assets/Report SS 2.jpg";
import reportSS3 from "@/assets/Report SS 3.jpg";
import { PRODUCTS, formatPrice } from "@/config/pricing";

const reportSlides = [
    {
        img: reportSS1,
        title: "📋 Daftar Isi Lengkap",
        desc: "100+ halaman analisis terstruktur yang mudah dipahami dan diikuti",
        highlight: "Struktur Rapi & Komprehensif"
    },
    {
        img: reportSS2,
        title: "⚡ Langkah Praktis Sesuai Authority",
        desc: "Panduan spesifik berdasarkan cara unikmu membuat keputusan terbaik",
        highlight: "Personalisasi Berdasarkan Desainmu"
    },
    {
        img: reportSS3,
        title: "🎯 Strategi Kehidupan Personal",
        desc: "Cara memanfaatkan kekuatan unikmu di karir, relasi, dan keseharian",
        highlight: "Actionable & Praktis"
    },
];

interface ReportPreviewSectionProps {
    onOpenChartModal?: () => void;
    hideCta?: boolean;
}

export const ReportPreviewSection = ({ onOpenChartModal, hideCta = false }: ReportPreviewSectionProps) => {
    const [slideIndex, setSlideIndex] = useState(0);

    return (
        <section className="py-20 px-4 bg-secondary/20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <FileText className="w-4 h-4" />
                        Lihat Isi Laporan
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gradient-fire mb-4">
                        Apa yang Kamu Dapat dalam Laporan 100+ Halaman?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Bukan sekadar teori — ini adalah panduan praktis yang dipersonalisasi khusus berdasarkan chart Human Design kamu.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Screenshot Carousel */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl border border-accent/30 shadow-2xl">
                            <img
                                src={reportSlides[slideIndex].img}
                                alt={reportSlides[slideIndex].title}
                                className="w-full h-auto"
                                loading="lazy"
                            />
                        </div>
                        {/* Navigation */}
                        <button
                            aria-label="Previous slide"
                            onClick={() => setSlideIndex((prev) => (prev === 0 ? reportSlides.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            aria-label="Next slide"
                            onClick={() => setSlideIndex((prev) => (prev === reportSlides.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {reportSlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSlideIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-colors ${idx === slideIndex ? 'bg-accent' : 'bg-muted-foreground/30'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                            {reportSlides[slideIndex].highlight}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                            {reportSlides[slideIndex].title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {reportSlides[slideIndex].desc}
                        </p>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                <span>Analisis mendalam yang bisa langsung dipraktikkan</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                <span>Dipersonalisasi berdasarkan data kelahiranmu</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm">✓</span>
                                <span>Dikirim ke email dalam 24 jam</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-wrap items-center gap-4">
                            <span className="text-3xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</span>
                            <span className="text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</span>
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-medium">
                                -{Math.round(((PRODUCTS.FULL_REPORT.original_price - PRODUCTS.FULL_REPORT.price) / PRODUCTS.FULL_REPORT.original_price) * 100)}%
                            </span>
                        </div>

                        {!hideCta && (
                            <>
                                <Button
                                    size="lg"
                                    className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg px-8 py-6 mt-4"
                                    onClick={() => {
                                        if (onOpenChartModal) {
                                            onOpenChartModal();
                                        } else {
                                            const calculator = document.getElementById('calculator');
                                            calculator?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Buat Chart & Pesan Sekarang →
                                </Button>
                                <p className="text-muted-foreground text-sm space-y-1">
                                    <span>Buat chart gratis, lalu pesan laporan lengkap yang dipersonalisasi.</span>
                                    <span className="block text-accent/80 font-medium">✨ Bergabunglah dengan 12 orang yang sudah memesan kejelasan untuk hidup mereka minggu ini.</span>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
