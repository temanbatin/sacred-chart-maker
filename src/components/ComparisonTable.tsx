import { Check, X, Clock, Target, RotateCcw, AlertTriangle, Heart, HelpCircle, Repeat, ArrowUpRight } from 'lucide-react';

const comparisons = [
    {
        category: 'Solusi',
        psychologist: 'Psikolog/Terapis',
        coach: 'Life Coach',
        trialError: 'Trial & Error',
        humanDesign: 'Human Design Report',
    },
    {
        category: 'Biaya',
        psychologist: 'Rp 500k-1jt per sesi',
        coach: 'Rp 2-5jt per bulan',
        trialError: 'Gratis (tapi...)',
        humanDesign: 'Rp 199k (one-time)',
    },
    {
        category: 'Total Investasi',
        psychologist: 'Rp 5-10jt (10 sesi)',
        coach: 'Rp 6-15jt (3 bulan)',
        trialError: 'Emotional cost + years',
        humanDesign: 'Rp 199k',
    },
    {
        category: 'Waktu Hasil',
        psychologist: '3-6 bulan',
        coach: '1-3 bulan',
        trialError: 'Bertahun-tahun',
        humanDesign: 'Instan (menit)',
    },
    {
        category: 'Fokus',
        psychologist: 'Mental health & trauma',
        coach: 'Goal setting & action',
        trialError: 'Hit or miss',
        humanDesign: 'Your unique design',
    },
    {
        category: 'Akses',
        psychologist: 'Per sesi (habis pakai)',
        coach: 'Subscription based',
        trialError: 'Always available',
        humanDesign: 'Lifetime access',
    },
];

interface ComparisonTableProps {
    className?: string;
}

export const ComparisonTable = ({ className = '' }: ComparisonTableProps) => {
    return (
        <section className={`px-4 py-16 ${className}`}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Kenapa Pilih Human Design Report?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Bandingkan investasi Anda dengan alternatif lain untuk self-discovery dan personal growth
                    </p>
                </div>

                {/* Mobile: Card View */}
                <div className="md:hidden space-y-4">
                    <div className="glass-card rounded-xl p-6 border-2 border-accent">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-accent mb-2">Human Design Report</h3>
                            <p className="text-2xl font-bold text-foreground">Rp 199k</p>
                            <p className="text-sm text-muted-foreground">One-time payment</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                'Hasil Instan (hitungan menit)',
                                'Blueprint unik Anda',
                                'Lifetime access',
                                '100+ halaman komprehensif',
                                'Garansi report ulang'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-accent shrink-0" />
                                    <span className="text-sm text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 opacity-60">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Psikolog/Terapis</h3>
                        <p className="text-xl font-bold text-foreground mb-2">Rp 5-10jt</p>
                        <p className="text-sm text-muted-foreground mb-4">10 sesi @ Rp 500k-1jt</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent/70" />
                                <span>Hasil: 3-6 bulan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-accent/70" />
                                <span>Fokus: Mental health & trauma</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-accent/70" />
                                <span>Akses: Per sesi (habis pakai)</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 opacity-60">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Life Coach</h3>
                        <p className="text-xl font-bold text-foreground mb-2">Rp 6-15jt</p>
                        <p className="text-sm text-muted-foreground mb-4">3 bulan @ Rp 2-5jt/bln</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent/70" />
                                <span>Hasil: 1-3 bulan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-accent/70" />
                                <span>Fokus: Goal setting & action</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-accent/70" />
                                <span>Akses: Subscription based</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 opacity-60">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Trial & Error</h3>
                        <p className="text-xl font-bold text-foreground mb-2">Gratis?</p>
                        <p className="text-sm text-muted-foreground mb-4">Tapi dengan cost tersembunyi...</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent/70" />
                                <span>Waktu: Bertahun-tahun</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-accent/70" />
                                <span>Emotional & opportunity cost</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-accent/70" />
                                <span>Hasil: Hit or miss</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop: Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Aspek</th>
                                <th className="text-center py-4 px-4 text-muted-foreground font-semibold opacity-60">Psikolog</th>
                                <th className="text-center py-4 px-4 text-muted-foreground font-semibold opacity-60">Life Coach</th>
                                <th className="text-center py-4 px-4 text-muted-foreground font-semibold opacity-60">Trial & Error</th>
                                <th className="text-center py-4 px-4 bg-accent/10 rounded-t-lg">
                                    <span className="text-accent font-bold">Human Design</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisons.map((row, index) => (
                                <tr key={index} className="border-b border-border/50">
                                    <td className="py-4 px-4 font-semibold text-foreground">{row.category}</td>
                                    <td className="py-4 px-4 text-center text-muted-foreground opacity-60 text-sm">
                                        {row.psychologist}
                                    </td>
                                    <td className="py-4 px-4 text-center text-muted-foreground opacity-60 text-sm">
                                        {row.coach}
                                    </td>
                                    <td className="py-4 px-4 text-center text-muted-foreground opacity-60 text-sm">
                                        {row.trialError}
                                    </td>
                                    <td className="py-4 px-4 text-center bg-accent/5 font-semibold text-foreground">
                                        {row.humanDesign}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 glass-card rounded-xl p-6 text-center">
                    <p className="text-foreground mb-2">
                        <span className="font-bold text-accent">Kesimpulan:</span> Human Design Report memberikan <span className="font-semibold">value 50x lebih tinggi</span> dengan investasi minimal
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Perfect sebagai starting point self-discovery Anda, atau complement untuk coaching/terapi yang sudah berjalan
                    </p>
                </div>
            </div>
        </section>
    );
};
