import { Sparkles, Zap, Gift } from 'lucide-react';

const steps = [
  {
    icon: Sparkles,
    number: "01",
    title: "Isi Data Lahirmu",
    description: "Cukup 1 menit. Masukkan tanggal, waktu, dan kota kelahiran.",
    highlight: "GRATIS"
  },
  {
    icon: Zap,
    number: "02",
    title: "Lihat Desain Unikmu",
    description: "Chart langsung muncul! Tipe, Strategi, dan Otoritas-mu terungkap.",
    highlight: "INSTANT"
  },
  {
    icon: Gift,
    number: "03",
    title: "Pahami & Terapkan",
    description: "Gunakan insight untuk keputusan karir, relasi, dan hidup lebih aligned.",
    highlight: "ACTIONABLE"
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="pt-20 pb-0 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Prosesnya Gampang Banget
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-fire mb-4">
            3 Langkah Kenali Dirimu
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Tidak perlu belajar berbulan-bulan. Dalam hitungan menit, kamu punya peta hidup yang akurat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector Arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 z-20">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-primary/50" />
                </div>
              )}

              <div className="glass-card rounded-2xl p-8 text-center h-full relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                {/* Highlight Badge */}
                <div className="absolute top-4 right-4 bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-bold">
                  {step.highlight}
                </div>

                {/* Large Number */}
                <div className="text-6xl font-black bg-gradient-to-br from-primary/40 to-accent/40 bg-clip-text text-transparent mb-2">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Arrow Down */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-muted-foreground text-sm mb-4">Mulai Sekarang ↓</p>
          <div className="relative">
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 w-14 h-14 rounded-full bg-primary/30 animate-ping" />
            {/* Arrow container */}
            <div
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/50"
              onClick={() => {
                const calculator = document.getElementById('calculator');
                calculator?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Custom animated arrow */}
              <div className="animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 4L12 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M5 13L12 20L19 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
