import { Calendar, Cpu, Compass } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Masukkan Data Lahir',
    description: 'Isi tanggal, waktu, dan tempat kelahiranmu dengan akurat',
  },
  {
    icon: Cpu,
    title: 'Sistem Menghitung',
    description: 'Algoritma kami membaca posisi planet saat kamu dilahirkan',
  },
  {
    icon: Compass,
    title: 'Temukan Desainmu',
    description: 'Dapatkan peta energi unik yang hanya milikmu',
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire">
          Bagaimana Cara Kerjanya?
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Hanya dalam 3 langkah sederhana, kamu akan memiliki peta lengkap tentang energi dan potensi hidupmu
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="glass-card rounded-2xl p-8 text-center relative z-10 transition-transform hover:scale-105">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-accent" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
