import { Star, Play } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sari Wulandari',
    location: 'Jakarta',
    avatar: '👩',
    quote: 'Setelah mengetahui saya adalah Projector, akhirnya saya mengerti mengapa saya sering kelelahan. Sekarang saya tahu cara mengelola energi dengan benar.',
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

// Video testimonial placeholders
const videoTestimonials = [
  // CARA MENGISI VIDEO:
  // 1. Upload video ke YouTube (bisa Unlisted atau Shorts)
  // 2. Ambil ID video atau Link Embed
  // 3. Masukkan ke dalam property 'videoUrl' di bawah ini
  {
    id: 1,
    name: "Nurul",
    type: "Projektor",
    duration: "1:24",
    // Contoh link embed YouTube:
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    name: "Devi",
    type: "Projector",
    duration: "2:05",
    videoUrl: "" // Isi link di sini
  },
  {
    id: 3,
    name: "Galuh Amelia",
    type: "Manifestor",
    duration: "1:48",
    videoUrl: "" // Isi link di sini
  },
];

const VideoPlaceholder = ({ video }: { video: typeof videoTestimonials[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying && video.videoUrl) {
    return (
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black animate-fade-in">
        <iframe
          src={`${video.videoUrl}?autoplay=1`}
          title={`Testimoni ${video.name}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-colors"
        >
          <span className="sr-only">Close Video</span>
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => video.videoUrl && setIsPlaying(true)}
    >
      {/* Gradient placeholder background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary to-accent/20 transition-all duration-500 ease-out ${isHovered ? 'brightness-75 scale-110' : 'brightness-100 scale-100'}`} />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }} />

      {/* Play button overlay - always visible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 shadow-xl ${isHovered ? 'scale-125 bg-accent' : 'scale-100'}`}>
          <Play className={`w-7 h-7 ml-1 transition-colors ${isHovered ? 'text-white fill-white' : 'text-primary fill-primary'}`} />
        </div>
      </div>

      {/* Bottom info */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-2'}`}>
        <p className="text-white font-semibold flex items-center gap-2">
          {video.name}
          {video.videoUrl && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Video</span>}
        </p>
        <p className="text-white/70 text-sm">{video.type} • {video.duration}</p>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Cerita Nyata
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-fire mb-4">
            Mereka yang Sudah Menemukan Dirinya
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ribuan orang Indonesia telah merasakan transformasi setelah memahami Human Design mereka
          </p>
        </div>

        {/* Video Testimonials */}
        <div className="mb-16">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {videoTestimonials.map((video) => (
              <VideoPlaceholder key={video.id} video={video} />
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-4">
            Klik untuk menonton cerita mereka
          </p>
        </div>

        {/* Written Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 transition-all hover:border-accent/50"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-4 leading-relaxed text-sm">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
