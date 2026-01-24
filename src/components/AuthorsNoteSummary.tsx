import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import nusaAuthor from '@/assets/nusa-author.jpg';

export const AuthorsNoteSummary = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 md:py-24 px-4 bg-secondary/10 border-t border-border/50">
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Image Column */}
                    <div className="relative group mx-auto md:mx-0 w-full max-w-sm md:max-w-full">
                        <div className="absolute inset-0 bg-accent/20 rounded-2xl transform rotate-3 group-hover:rotate-2 transition-transform duration-500" />
                        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] shadow-xl">
                            <img
                                src={nusaAuthor}
                                alt="Nusa Ardi Camping"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        </div>

                        {/* Floating Label */}
                        <div className="absolute -bottom-4 -right-4 bg-background border border-border p-3 rounded-lg shadow-lg flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Founder</p>
                                <p className="text-sm font-bold text-foreground">Nusa Ardi</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="text-left">
                        <span className="inline-block text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
                            Author's Note
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                            "15 Tahun Saya Mencoba Menjadi Orang Lain..."
                        </h2>
                        <div className="space-y-4 text-muted-foreground mb-8">
                            <p>
                                Dulu, saya pikir sukses itu soal kerja keras tanpa henti, mengejar deadline, dan menuhin ekspektasi orang.
                            </p>
                            <p>
                                Tapi rasanya kosong. 15 tahun "trial & error" yang penuh tekanan, sampai akhirnya saya menemukan Human Design.
                            </p>
                            <p>
                                Ternyata, saya memaksakan "mesin Lambo" saya untuk mendaki gunung terjal. Saya tidak didesain untuk itu.
                            </p>
                            <p className="font-medium text-foreground">
                                Saya membangun Teman Batin agar kamu tidak perlu membuang waktu 15 tahun tersesat seperti saya.
                            </p>
                        </div>

                        <Button
                            onClick={() => navigate('/authors-note')}
                            variant="outline"
                            className="group border-primary/20 hover:border-accent hover:bg-accent/5 hover:text-foreground"
                        >
                            Baca Cerita Lengkap Saya
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
