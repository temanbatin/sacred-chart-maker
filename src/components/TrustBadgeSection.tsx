import { BrainCircuit, Zap, ShieldCheck } from "lucide-react";

export const TrustBadgeSection = () => {
    return (
        <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-2xl p-8 md:p-10 border border-t-white/20 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        {/* Icons Visual */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center rotate-3 border border-accent/20 shadow-lg shadow-accent/10">
                                <BrainCircuit className="w-10 h-10 text-accent" />
                            </div>
                            <div className="absolute -bottom-4 -right-2 w-12 h-12 bg-secondary rounded-xl flex items-center justify-center -rotate-6 border border-border shadow-md">
                                <Zap className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 flex items-center justify-center md:justify-start gap-2">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                Akurasi Tinggi, Tanpa Waktu Tunggu
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base md:text-lg text-justify">
                                Algoritma kami menghitung posisi planet dan mekanik energi kamu berdasarkan sistem yang sama dengan para praktisi Human Design profesional. Setiap report dipersonalisasi berdasarkan data kelahiranmu—<span className="text-accent font-medium">langsung dikirim ke email</span>, tanpa perlu antri atau menunggu berhari-hari.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
