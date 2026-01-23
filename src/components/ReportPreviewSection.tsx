import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ClipboardList, Zap, Target, Check, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import reportSS1 from "@/assets/Report SS.jpg";
import reportSS2 from "@/assets/Report SS 2.jpg";
import reportSS3 from "@/assets/Report SS 3.jpg";
import { PRODUCTS, formatPrice } from "@/config/pricing";

const reportSlides = [
    {
        img: reportSS1,
        icon: ClipboardList,
        title: "Daftar Isi Lengkap",
        desc: "100+ halaman analisis terstruktur yang mudah dipahami dan diikuti",
        highlight: "Struktur Rapi & Komprehensif"
    },
    {
        img: reportSS2,
        icon: Zap,
        title: "Langkah Praktis Sesuai Authority",
        desc: "Panduan spesifik berdasarkan cara unikmu membuat keputusan terbaik",
        highlight: "Personalisasi Berdasarkan Desainmu"
    },
    {
        img: reportSS3,
        icon: Target,
        title: "Strategi Kehidupan Personal",
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
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border border-yellow-500/20">
                            <div className="flex gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                            </div>
                            <span className="ml-1 text-foreground">Disukai oleh 500+ Pembaca</span>
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-gradient-fire mb-6 leading-tight">
                        Bongkar Potensi Tersembunyimu <br className="hidden md:block" />
                        dalam 100+ Halaman Personal
                    </h2>

                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Ditulis dengan <span className="text-foreground font-medium">bahasa manusiawi</span> (bukan bahasa teknis yang membingungkan).
                        Praktis, to-the-point, dan 100% tentang KAMU.
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
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                            {(() => {
                                const Icon = reportSlides[slideIndex].icon;
                                return <Icon className="w-8 h-8 text-primary" />;
                            })()}
                            {reportSlides[slideIndex].title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {reportSlides[slideIndex].desc}
                        </p>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Bahasa mudah dipahami awam, tanpa istilah teknis yang ribet.</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Strategi karir & relasi praktis (bukan sekadar deskripsi sifat).</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Bayar sekali, panduan valid seumur hidup (Lifetime Access).</span>
                            </div>
                        </div>

                        {!hideCta && (
                            <div className="pt-6 border-t border-border/50">
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                                    Lihat detail lengkap & harga di bagian bawah halaman
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
