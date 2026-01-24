import { Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Devi',
    location: 'Generator',
    avatar: '/images/testimonials/testimonial-generator.jpg',
    quote: 'Setelah aku cek ternyata aku tipe generator, dimana tipe ini bersifat menarik dan merespon. Pantas saja peluang yang aku dapat selama ini secara tidak sadar datang padaku, bukan aku yang mencari/mengejarnya. Dengan membaca bab bab yang ada, aku menjadi lebih tenang, dan lebih menghargai diriku sendiri, karena inilah cara diriku bekerja untukku. Dari 100 halaman yang aku baca, semuanya bernyawa, setiap halamannya selalu memberikan insight baru tentang diriku dan tentang bagaimana cara mengendalikannya. Bener2 ngrasa dibikin tenang dan introspeksi diri "oh iya", "pantesan", "jadi gitu", "oke besok aku coba" di setiap halamannya. Berasa nggak sia2 ngeluarin waktu buat baca semua halamannya. Aku paling suka dengan statement ini "Menunda sesuatu untuk lebih dipikirkan matang2, jauh lebih baik daripada terburu2 yang menyesatkan" dan itulah yang selalu kulakukan selama ini.',
    rating: 5,
  },
  {
    name: 'Selvia',
    location: 'Manifesting Generator',
    avatar: '/images/testimonials/testimonial-selvia.jpg',
    quote: "Dulu aku pikir resep sukses itu ya 'Just Do It'. Aku selalu inisiatif duluan, lari paling kencang, tapi anehnya sering banget stuck di tengah jalan atau malah marah-marah sendiri karena hasilnya nggak sesuai ekspektasi. Frustrasi banget rasanya, padahal tenaga udah abis. Bacaan ini bener-bener nampar tapi sekaligus meluk aku. Ternyata walau energiku cepat (Manifesting), aku tetap harus nunggu 'lampu hijau' dari respon perutku (Generator) sebelum lari. Aku belajar bedanya 'sibuk' sama 'produktif yang selaras'.",
    rating: 5,
  },
  {
    name: 'Betty',
    location: 'Projector',
    avatar: '/images/testimonials/testimonial-betty.jpg',
    quote: "Selama ini aku sering ribut sama suami cuma gara-gara dia ngerasa aku 'kurang gerak' atau sering rebahan pas anak tidur. Sakit banget rasanya dibilang malas, padahal aku udah all out ngurus si kecil, tapi badanku rasanya remuk redam beda sama ibu-ibu lain yang kelihatannya non-stop. Setelah baca kalau aku tipe Projector, aku nangis karena merasa divalidasi. Ternyata aku memang bukan tipe energi yang didesain buat kerja fisik 24 jam kayak kuli. Tugasku adalah guiding, bukan doing terus-menerus. Sejak paham ini, aku komunikasiin ke suami kalau aku butuh istirahat biar nggak burnout. Dan ajaibnya, ketika aku berhenti maksa diri jadi 'supermom', suasananya rumah jadi adem. Kalimat ini nyelamatin warasku: 'Istirahat bagi Projector bukanlah kemalasan, melainkan persiapan energi agar pandanganmu kembali tajam.' Sekarang aku nggak merasa bersalah lagi kalau harus tidur siang bareng anak.",
    rating: 5,
  },
];

// Video testimonial placeholders
const videoTestimonials = [
  {
    id: 1,
    name: "Nurul",
    type: "Projektor",
    duration: "1:24",
    videoUrl: "https://www.youtube.com/embed/RWWWmWbBz4A"
  }
];

const VideoPlaceholder = ({ video }: { video: typeof videoTestimonials[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID safely
  const videoId = video.videoUrl.split('embed/')[1]?.split('?')[0] || video.videoUrl.split('v=')[1];
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  if (isPlaying && video.videoUrl) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-black animate-fade-in mx-auto max-w-[315px]" style={{ aspectRatio: '9/16' }}>
        <iframe
          width="100%"
          height="100%"
          src={`${video.videoUrl}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&controls=0&loop=1&playlist=RWWWmWbBz4A`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group shadow-lg mx-auto max-w-[315px]"
      style={{ aspectRatio: '9/16' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => video.videoUrl && setIsPlaying(true)}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={video.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault doesn't exist (common for shorts)
            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary to-accent/20 transition-all duration-500 ease-out ${isHovered ? 'brightness-75 scale-110' : 'brightness-100 scale-100'}`} />
      )}

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 shadow-xl ${isHovered ? 'scale-125 bg-accent' : 'scale-100'}`}>
          <Play className={`w-7 h-7 ml-1 transition-colors ${isHovered ? 'text-white fill-white' : 'text-primary fill-primary'}`} />
        </div>
      </div>
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

export const TestimonialsSection = ({ className }: { className?: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false
  });
  const [isPaused, setIsPaused] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set this to true when you want to show video testimonials again
  const SHOW_VIDEOS = true;

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedTestimonials);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTestimonials(newExpanded);
  };

  const truncateText = (text: string, maxLines: number = 3) => {
    // Approximate: ~100 characters per line for responsive estimate
    const maxChars = maxLines * 100;
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '...';
  };

  useEffect(() => {
    if (!emblaApi || isPaused) return;

    timerRef.current = setInterval(() => {
      scrollNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [emblaApi, scrollNext, isPaused]);

  return (
    <section className={cn("py-20 px-4 bg-secondary/30", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Cerita Nyata
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-fire mb-4">
            Mereka yang Sudah Menemukan Dirinya
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ratusan orang Indonesia telah merasakan transformasi setelah memahami Human Design mereka
          </p>
        </div>

        {/* Video Testimonials */}
        {SHOW_VIDEOS && (
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {videoTestimonials.map((video) => (
                <VideoPlaceholder key={video.id} video={video} />
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Klik untuk menonton cerita mereka
            </p>
          </div>
        )}

        {/* Written Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            ref={emblaRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="flex">
              {testimonials.map((testimonial, index) => {
                const isExpanded = expandedTestimonials.has(index);
                const displayText = isExpanded
                  ? testimonial.quote
                  : truncateText(testimonial.quote, 3);
                const needsTruncation = testimonial.quote.length > 300; // ~3 lines worth

                return (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 px-4"
                  >
                    <div className="glass-card rounded-3xl p-8 md:p-12 transition-all hover:border-accent/50 shadow-xl h-full flex flex-col justify-center">
                      {/* Stars */}
                      <div className="flex gap-1 mb-6 justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="mb-4">
                        <p className={`text-foreground leading-relaxed text-base md:text-lg text-justify italic font-light ${!isExpanded && needsTruncation ? 'line-clamp-3' : ''}`}>
                          "{displayText}"
                        </p>

                        {/* Read More/Less Button */}
                        {needsTruncation && (
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="mt-3 text-accent hover:text-accent/80 text-sm font-semibold transition-colors flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                Tampilkan lebih sedikit
                                <ChevronRight className="w-4 h-4 rotate-90" />
                              </>
                            ) : (
                              <>
                                Baca selengkapnya
                                <ChevronRight className="w-4 h-4 -rotate-90" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Author */}
                      <div className="flex flex-col items-center gap-3 mt-4">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl overflow-hidden border-2 border-accent/20">
                          {testimonial.avatar.startsWith('/') ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            testimonial.avatar
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                          <p className="text-sm text-accent font-medium tracking-wide uppercase">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-all backdrop-blur-md border border-white/20 hidden md:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition-all backdrop-blur-md border border-white/20 hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Mobile Dots Indicators could be added here if needed */}
        </div>
      </div>
    </section>
  );
};
