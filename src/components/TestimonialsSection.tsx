import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sari Wulandari',
    location: 'Jakarta',
    avatar: '👩',
    quote: 'Dulu saya merasa bersalah karena sering lelah. Setelah tahu saya seorang Projector, saya berhenti memaksakan diri bekerja seperti robot. Sekarang saya lebih sukses dan bahagia dengan cara saya sendiri.',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    location: 'Bandung',
    avatar: '👨',
    quote: 'Human Design mengajari saya bahwa jawaban tidak selalu ada di kepala. Mengetahui otoritas Sacral saya membuat saya berhenti ragu dalam mengambil keputusan besar.',
    rating: 5,
  },
  {
    name: 'Dewi Kusuma',
    location: 'Yogyakarta',
    avatar: '👩',
    quote: 'Saya adalah Manifestor dan selalu merasa berbeda. Sekarang saya bangga dengan energi unik saya dan berani menginisiasi perubahan.',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire">
          Cerita Mereka yang Telah Menemukan Dirinya
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Ribuan orang telah merasakan transformasi setelah memahami Human Design mereka
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 transition-transform hover:scale-105"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
