import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Share2, RotateCcw, Loader2, CheckCircle2, Save, LogIn, ChevronLeft, ChevronRight, Plus, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import type { BirthData } from "@/components/MultiStepForm";
import { ProductPreviewModal } from "./ProductPreviewModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import reportSS1 from "@/assets/Report SS.jpg";
import reportSS2 from "@/assets/Report SS 2.jpg";
import reportSS3 from "@/assets/Report SS 3.jpg";
import { PRICING_CONFIG, formatPrice } from "@/config/pricing";

const reportSlides = [
  { img: reportSS1, title: "Daftar Isi Lengkap", desc: "100+ halaman strukturnya jelas, mudah diikuti dari awal hingga akhir" },
  { img: reportSS2, title: "Langkah Praktis Sesuai Authority", desc: "Panduan spesifik berdasarkan cara kamu membuat keputusan terbaik" },
  { img: reportSS3, title: "Strategi Personal Kehidupan", desc: "Cara memanfaatkan kekuatan unikmu di karir, relasi, dan keseharian" },
];

interface ChartResultProps {
  data: any;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  birthData: BirthData | null;
  chartId?: string;
  userId?: string;
  onReset: () => void;
  isOrdered?: boolean;
}

interface PlanetData {
  Planet: string;
  Gate: number;
  Line: number;
  Lon: number;
  Ch_Gate?: number;
}

// Planet symbols mapping
const planetSymbols: Record<string, string> = {
  Sun: "☉",
  Earth: "⊕",
  Moon: "☾",
  North_Node: "Ω",
  South_Node: "☋",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

// Format planet name for display
const formatPlanetName = (name: string): string => {
  return name.replace("_", " ");
};

// Planet descriptions for tooltips
const planetDescriptions: Record<string, { title: string; description: string }> = {
  Sun: {
    title: "Matahari ☉",
    description: "Inti dari identitasmu. Mewakili 70% dari energi dan tema hidup utamamu.",
  },
  Earth: {
    title: "Bumi ⊕",
    description: "Grounding dan stabilitas. Bagaimana kamu membumi dan menyeimbangkan energi Matahari.",
  },
  Moon: {
    title: "Bulan ☾",
    description: "Dorongan dan motivasi. Apa yang mendorongmu maju dalam hidup.",
  },
  North_Node: {
    title: "North Node Ω",
    description: "Arah masa depan. Lingkungan dan orang yang membawa pertumbuhan.",
  },
  South_Node: {
    title: "South Node ☋",
    description: "Pengalaman masa lalu. Apa yang sudah kamu kuasai dan bawa dari kehidupan sebelumnya.",
  },
  Mercury: {
    title: "Merkurius ☿",
    description: "Komunikasi dan pikiran. Bagaimana kamu berpikir dan menyampaikan ide.",
  },
  Venus: {
    title: "Venus ♀",
    description: "Nilai dan moral. Apa yang kamu hargai dan bagaimana kamu berhubungan dengan orang lain.",
  },
  Mars: {
    title: "Mars ♂",
    description: "Energi dan ketidakdewasaan. Dimana kamu perlu tumbuh dan berkembang.",
  },
  Jupiter: {
    title: "Jupiter ♃",
    description: "Hukum dan keberuntungan. Dimana kamu menemukan ekspansi dan peluang.",
  },
  Saturn: {
    title: "Saturnus ♄",
    description: "Disiplin dan batasan. Dimana kamu perlu struktur dan tanggung jawab.",
  },
  Uranus: {
    title: "Uranus ♅",
    description: "Keunikan dan inovasi. Tema yang tidak biasa dalam hidupmu.",
  },
  Neptune: {
    title: "Neptunus ♆",
    description: "Ilusi dan spiritualitas. Dimana kamu perlu kejelasan dan kesadaran.",
  },
  Pluto: {
    title: "Pluto ♇",
    description: "Transformasi dan kebenaran. Dimana kamu mengalami perubahan mendalam.",
  },
};

// Planet column component with tooltips
const PlanetColumn = ({ planets, title, side }: { planets: PlanetData[]; title: string; side: "left" | "right" }) => {
  const isDesign = side === "left";

  return (
    <div className="flex flex-col gap-0.5 md:gap-1 lg:gap-1.5">
      <div
        className={`text-xs md:text-sm lg:text-base font-semibold mb-2 md:mb-3 pb-1 md:pb-2 border-b text-center ${isDesign ? "text-primary border-primary" : "text-foreground border-muted"}`}
      >
        {title}
      </div>
      {planets.map((planet, index) => (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <div
              className={`flex items-center gap-1.5 md:gap-2 lg:gap-3 text-sm md:text-base lg:text-lg py-0.5 md:py-1 cursor-pointer hover:bg-muted/50 rounded px-1 md:px-2 transition-colors ${isDesign ? "flex-row" : "flex-row-reverse"}`}
            >
              <span
                className={`w-4 md:w-5 lg:w-6 text-center text-xs md:text-sm lg:text-base ${isDesign ? "text-primary" : "text-muted-foreground"}`}
              >
                {planetSymbols[planet.Planet] || planet.Planet[0]}
              </span>
              <span className="font-medium text-foreground text-xs md:text-sm lg:text-base">
                {planet.Gate}.{planet.Line}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent side={isDesign ? "left" : "right"} className="max-w-xs p-3">
            <p className="font-semibold">
              {planetDescriptions[planet.Planet]?.title || formatPlanetName(planet.Planet)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {planetDescriptions[planet.Planet]?.description || `Gate ${planet.Gate}, Line ${planet.Line}`}
            </p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

// Variable descriptions for tooltips
const variableDescriptions: Record<string, { title: string; description: string }> = {
  Digestion: {
    title: "Digestion (Design - Otak)",
    description:
      "Cara terbaik bagi tubuhmu untuk mencerna makanan dan informasi. Arrow kiri = Aktif/Spesifik, Arrow kanan = Pasif/Umum.",
  },
  Environment: {
    title: "Environment (Design - Tubuh)",
    description: "Lingkungan fisik yang mendukung kesejahteraanmu. Arrow kiri = Selektif, Arrow kanan = Variabel.",
  },
  Motivation: {
    title: "Motivation (Personality - Pikiran)",
    description: "Motivasi sejatimu dalam berpikir. Arrow kiri = Strategis/Fokus, Arrow kanan = Reseptif/Terbuka.",
  },
  Perspective: {
    title: "Perspective (Personality - Pandangan)",
    description: "Cara unikmu melihat dan memahami dunia. Arrow kiri = Fokus, Arrow kanan = Periferal.",
  },
};


export const ChartResult = ({ data, userName, userEmail, userPhone, birthData, chartId, userId, onReset, isOrdered = false }: ChartResultProps) => {
  const [bodygraphImage, setBodygraphImage] = useState<string | null>(null);
  const [bodygraphLoading, setBodygraphLoading] = useState(false);
  const [bodygraphError, setBodygraphError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Warning saat user mau tutup tab (hanya untuk guest yang belum save)
  const isUnsaved = !chartId && !userId;

  useEffect(() => {
    if (!isUnsaved) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Skip warning if user is in payment process
      if (sessionStorage.getItem('paymentRefId')) {
        return;
      }

      e.preventDefault();
      e.returnValue = 'Chart kamu belum disimpan!';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUnsaved]);

  const handleResetClick = () => {
    if (isUnsaved) {
      setShowUnsavedWarning(true);
    } else {
      onReset();
    }
  };

  const handleShare = async () => {
    if (!birthData) return;

    const params = new URLSearchParams();
    params.set('action', 'generate');
    params.set('n', birthData.name);
    // Format date d-m-y
    const dateStr = `${birthData.day}-${birthData.month}-${birthData.year}`;
    params.set('d', dateStr);

    if (birthData.hour !== undefined && birthData.minute !== undefined) {
      const timeStr = `${birthData.hour}:${birthData.minute}`;
      params.set('t', timeStr);
    }

    params.set('p', birthData.place);
    params.set('g', birthData.gender);

    const shareUrl = `${window.location.origin}/?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link chart berhasil disalin!",
        description: "Anda bisa membagikannya ke orang lain."
      });
    } catch (err) {
      toast({
        title: "Gagal menyalin link",
        variant: "destructive"
      });
    }
  };

  const typeDescriptions: Record<string, string> = {
    Generator:
      "Kamu adalah sumber energi kehidupan dunia. Kamu memiliki daya tahan yang luar biasa, dan dirancang untuk membangun sesuatu yang besar dan bermakna. Kuncinya adalah menggunakan energimu hanya untuk hal-hal yang benar-benar memicu antusiasme di dalam dirimu.",
    "Manifesting Generator":
      "Kamu adalah tipe energi yang paling cepat dan efisien. Dirancang untuk menangani banyak hal sekaligus, kamu memiliki kemampuan unik untuk menemukan jalan pintas dan mewujudkan berbagai ide menjadi kenyataan dalam waktu singkat.",
    Projector:
      "Kamu tidak lahir untuk bekerja keras secara fisik, melainkan untuk melihat pola dan potensi yang tidak dilihat orang lain. Kamu adalah kompas bagi orang di sekitarmu, yang hadir untuk membimbing dan mengarahkan orang lain menuju kesuksesan.",
    Manifestor:
      "Kamu adalah pemantik perubahan. Kamu memiliki kekuatan alami untuk memulai sesuatu secara mandiri, kamu tidak perlu menunggu izin atau bantuan orang lain untuk bergerak. Kehadiranmu berfungsi untuk membuka pintu baru dan menginspirasi pergerakan besar.",
    Reflector:
      "Kamu adalah tipe yang paling langka, berfungsi sebagai cermin objektif bagi lingkungan sekitarmu. Kamu memiliki kemampuan luar biasa untuk merasakan kesehatan dan keharmonisan suatu tempat, memberikan perspektif yang sangat dalam tentang kondisi dunia di sekelilingmu.",
  };

  const strategyDescriptions: Record<string, string> = {
    "To Respond":
      "Jangan memaksakan aksi. Biarkan dunia memberikan sinyal atau peluang, lalu bertindaklah hanya saat energimu merespon tanda tersebut secara alami.",
    "Wait to Respond":
      "Jangan memaksakan aksi. Biarkan dunia memberikan sinyal atau peluang, lalu bertindaklah hanya saat energimu merespon tanda tersebut secara alami.",
    "Wait for the Invitation":
      "Efektivitasmu muncul saat kamu diakui. Tunggu undangan atau apresiasi tulus dari orang lain sebelum kamu membagikan bimbingan dan arahanmu.",
    "To Inform":
      "Amankan langkahmu dengan berkomunikasi. Beritahu orang-orang di sekitarmu tentang rencana besarmu agar jalanmu bebas dari hambatan dan resistensi.",
    Inform:
      "Amankan langkahmu dengan berkomunikasi. Beritahu orang-orang di sekitarmu tentang rencana besarmu agar jalanmu bebas dari hambatan dan resistensi.",
    "Wait a Lunar Cycle": "Beri dirimu 28 hari untuk merasakan kejelasan sebelum keputusan besar.",
  };

  const authorityDescriptions: Record<string, string> = {
    Sacral:
      'Gunakan gut feeling atau respon fisik spontan dari perutmu. Percayai jawaban instan seperti "uh-huh" (ya) atau "un-un" (tidak) saat ini juga.',
    Emotional:
      "Hindari keputusan impulsif. Kejelasan sejati datang saat gelombang emosimu sudah tenang. Jangan memutuskan sesuatu di puncak rasa senang maupun sedih.",
    "Solar Plexus":
      "Hindari keputusan impulsif. Kejelasan sejati datang saat gelombang emosimu sudah tenang. Jangan memutuskan sesuatu di puncak rasa senang maupun sedih.",
    Splenic:
      "Percayai insting instan demi keamanan dan kesehatanmu. Jawaban terbaik muncul dalam sekejap—perhatikan peringatan halus dari tubuhmu tanpa perlu berpikir lama.",
    Spleen:
      "Percayai insting instan demi keamanan dan kesehatanmu. Jawaban terbaik muncul dalam sekejap—perhatikan peringatan halus dari tubuhmu tanpa perlu berpikir lama.",
    "Ego Manifested": "Dengarkan apa yang benar-benar kamu inginkan dari hatimu.",
    "Ego Projected": "Bicarakan keinginanmu dan dengarkan apa yang keluar dari mulutmu.",
    "Self Projected":
      "Suarakan pilihanmu kepada orang lain. Kamu akan menemukan kebenaran melalui apa yang keluar dari mulutmu, bukan melalui apa yang kamu pikirkan di kepala.",
    "Self-Projected":
      "Suarakan pilihanmu kepada orang lain. Kamu akan menemukan kebenaran melalui apa yang keluar dari mulutmu, bukan melalui apa yang kamu pikirkan di kepala.",
    Mental: "Diskusikan dengan orang terpercaya dan perhatikan lingkunganmu.",
    None: "Kamu adalah Reflector - tunggu satu siklus bulan penuh sebelum keputusan besar.",
    Lunar:
      "Biarkan waktu yang memberikan jawaban. Berikan dirimu jeda satu siklus bulan penuh (28 hari) untuk mendapatkan kejernihan total sebelum mengambil komitmen besar.",
  };

  // Fetch bodygraph image when component mounts
  useEffect(() => {
    // Track Lead Event when chart is viewed
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }

    const fetchBodygraph = async () => {
      if (!birthData) return;

      setBodygraphLoading(true);
      setBodygraphError(null);

      try {
        const { data: result, error } = await supabase.functions.invoke("get-bodygraph", {
          body: birthData,
        });

        if (error) {
          console.error("Error fetching bodygraph:", error);
          setBodygraphError("Gagal memuat gambar bodygraph");
          return;
        }

        if (result?.image) {
          setBodygraphImage(result.image);
        }
      } catch (error) {
        console.error("Error:", error);
        setBodygraphError("Gagal memuat gambar bodygraph");
      } finally {
        setBodygraphLoading(false);
      }
    };

    fetchBodygraph();
  }, [JSON.stringify(birthData)]);

  // Download chart as PNG image
  // Download chart as PNG image
  const handleDownload = async () => {
    if (!exportRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#030712", // dark background
        logging: false,
        onclone: (clonedDoc) => {
          const exportEl = clonedDoc.getElementById('chart-export-view');
          if (exportEl) {
            exportEl.style.display = 'block';
          }
        }
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `temanbatin-chart-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Berhasil!",
            description: "Chart berhasil diunduh.",
          });
        }
      }, "image/png");
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast({
        title: "Gagal mengunduh",
        description: "Terjadi kesalahan saat mengunduh chart.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Extract data from API response - data is nested in "general" object
  const general = data?.general || {};
  const chartType = general.energy_type || "Unknown";
  const strategy = general.strategy || "Unknown";
  const authority = general.inner_authority || "Unknown";
  const profile = general.profile || "Unknown";
  const definition = general.definition || "Unknown";
  const incarnationCross = general.inc_cross || "Unknown";
  const aura = general.aura || "";
  const signature = general.signature || "";
  const notSelf = general.not_self || "";
  const definedCenters = general.defined_centers || [];
  const undefinedCenters = general.undefined_centers || [];
  const channels = data?.channels?.Channels || [];

  // Extract gates/planets data
  const designPlanets: PlanetData[] = data?.gates?.des?.Planets || [];
  const personalityPlanets: PlanetData[] = data?.gates?.prs?.Planets || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Downloadable Content Area */}
        <div ref={chartRef} className="bg-background p-4 md:p-8 rounded-3xl">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-fire">Selamat, {userName}! 🌟</h2>
            <p className="text-xl text-muted-foreground">Inilah cetak biru energi kosmikmu</p>
            {birthData && (
              <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm bg-secondary/30 py-2 px-4 rounded-full inline-block">
                <span>{birthData.day} {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][birthData.month - 1]} {birthData.year}</span>
                <span>•</span>
                <span>{String(birthData.hour).padStart(2, '0')}:{String(birthData.minute).padStart(2, '0')}</span>
                <span>•</span>
                <span>{birthData.place}</span>
              </div>
            )}

            {/* Unsaved Chart Banner for Guest Users */}
            {isUnsaved && (
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl py-3 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up">
                <span className="text-amber-200 text-sm">
                  ⚠️ Chart belum tersimpan — akan hilang jika halaman ditutup
                </span>
                <Button
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Simpan Sekarang
                </Button>
              </div>
            )}
          </div>

          {/* Bodygraph with Planet Columns */}
          <div className="glass-card rounded-3xl p-4 md:p-8 mb-8 animate-fade-up">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Bodygraph Chart</h3>

            <div className="flex justify-center items-start gap-2 md:gap-6 lg:gap-8">
              {/* Design Column (Left) */}
              <div className="hidden md:block flex-shrink-0">
                <PlanetColumn planets={designPlanets} title="Design" side="left" />
              </div>

              {/* Bodygraph Image (Center) */}
              <div className="flex-shrink-0 relative">
                {bodygraphLoading ? (
                  <div className="w-64 md:w-96 lg:w-[480px] xl:w-[540px] h-96 md:h-[550px] lg:h-[650px] xl:h-[700px] rounded-2xl bg-secondary/30 flex flex-col items-center justify-center border-2 border-dashed border-muted animate-pulse">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground text-center px-4 font-medium animate-pulse">
                      Sedang menggambar bodygraph anda...
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      (Mohon tunggu sebentar)
                    </p>
                  </div>
                ) : bodygraphError ? (
                  <div className="text-center text-muted-foreground py-12 w-64 md:w-96 lg:w-[480px] xl:w-[540px]">
                    <p>{bodygraphError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        if (birthData) {
                          setBodygraphLoading(true);
                          setBodygraphError(null);
                          supabase.functions
                            .invoke("get-bodygraph", { body: birthData })
                            .then(({ data: result, error }) => {
                              if (error) {
                                setBodygraphError("Gagal memuat gambar bodygraph");
                              } else if (result?.image) {
                                setBodygraphImage(result.image);
                              }
                            })
                            .finally(() => setBodygraphLoading(false));
                        }
                      }}
                    >
                      Coba Lagi
                    </Button>
                  </div>
                ) : bodygraphImage ? (
                  <img
                    src={bodygraphImage}
                    alt="Human Design Bodygraph"
                    className="w-64 md:w-96 lg:w-[480px] xl:w-[540px] h-auto rounded-2xl shadow-lg"
                  />
                ) : null}
              </div>

              {/* Personality Column (Right) */}
              <div className="hidden md:block flex-shrink-0">
                <PlanetColumn planets={personalityPlanets} title="Personality" side="right" />
              </div>
            </div>

            {/* Variables/Four Arrows - shown below chart for all screens */}
            {general.variables && (
              <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-muted">
                <div className="flex gap-4">
                  {general.variables.top_left && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="text-xl font-bold text-primary">
                            {general.variables.top_left.value === "left" ? "←" : "→"}
                          </span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.top_left.name}</p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-xs p-3">
                        <p className="font-semibold">{variableDescriptions[general.variables.top_left.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {variableDescriptions[general.variables.top_left.name]?.description}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )}
                  {general.variables.bottom_left && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="text-xl font-bold text-primary">
                            {general.variables.bottom_left.value === "left" ? "←" : "→"}
                          </span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.bottom_left.name}</p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-xs p-3">
                        <p className="font-semibold">
                          {variableDescriptions[general.variables.bottom_left.name]?.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {variableDescriptions[general.variables.bottom_left.name]?.description}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="flex gap-4">
                  {general.variables.top_right && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="text-xl font-bold text-foreground">
                            {general.variables.top_right.value === "left" ? "←" : "→"}
                          </span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.top_right.name}</p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-xs p-3">
                        <p className="font-semibold">{variableDescriptions[general.variables.top_right.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {variableDescriptions[general.variables.top_right.name]?.description}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )}
                  {general.variables.bottom_right && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="text-xl font-bold text-foreground">
                            {general.variables.bottom_right.value === "left" ? "←" : "→"}
                          </span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.bottom_right.name}</p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-xs p-3">
                        <p className="font-semibold">
                          {variableDescriptions[general.variables.bottom_right.name]?.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {variableDescriptions[general.variables.bottom_right.name]?.description}
                        </p>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )}

            {/* Mobile: Show planets below chart */}
            <div className="md:hidden mt-6 grid grid-cols-2 gap-4">
              <PlanetColumn planets={designPlanets} title="Design" side="left" />
              <PlanetColumn planets={personalityPlanets} title="Personality" side="right" />
            </div>
          </div>

          {/* Main Type Card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 animate-fade-up">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                Tipe Human Design
              </span>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{chartType}</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {typeDescriptions[chartType] || "Tipe unik dengan karakteristik khusus."}
              </p>
            </div>

            {/* Key Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Strategy */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Strategi</h4>
                <p className="text-xl font-semibold text-foreground mb-2">{strategy}</p>
                <p className="text-sm text-muted-foreground">
                  {strategyDescriptions[strategy] || "Ikuti strategi unikmu untuk keselarasan."}
                </p>
              </div>

              {/* Authority */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Otoritas</h4>
                <p className="text-xl font-semibold text-foreground mb-2">{authority}</p>
                <p className="text-sm text-muted-foreground">
                  {authorityDescriptions[authority] || "Otoritas unikmu untuk pengambilan keputusan."}
                </p>
              </div>

              {/* Profile */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Profil</h4>
                <p className="text-xl font-semibold text-foreground mb-2">{profile}</p>
                <p className="text-sm text-muted-foreground">
                  Profilmu menunjukkan cara kamu berinteraksi dengan dunia
                </p>
              </div>

              {/* Definition */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Definisi</h4>
                <p className="text-xl font-semibold text-foreground mb-2">{definition}</p>
                <p className="text-sm text-muted-foreground">Bagaimana energi mengalir dalam dirimu</p>
              </div>
            </div>

            {/* Signature & Not-Self */}
            {(signature || notSelf) && (
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {signature && (
                  <div className="bg-primary/10 rounded-2xl p-6 text-center">
                    <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Signature (Tanda Keselarasan)</h4>
                    <p className="text-xl font-semibold text-foreground">{signature}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Perasaan yang muncul saat kamu hidup selaras dengan desainmu
                    </p>
                  </div>
                )}
                {notSelf && (
                  <div className="bg-destructive/10 rounded-2xl p-6 text-center">
                    <h4 className="text-sm uppercase tracking-wide text-destructive mb-2">
                      Not-Self (Tanda Tidak Selaras)
                    </h4>
                    <p className="text-xl font-semibold text-foreground">{notSelf}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Perasaan yang muncul saat kamu tidak mengikuti desainmu
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Incarnation Cross */}
            {incarnationCross && incarnationCross !== "Unknown" && (
              <div className="mt-8">
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Incarnation Cross</h4>
                  <p className="text-lg font-semibold text-foreground">{incarnationCross}</p>
                  <p className="text-sm text-muted-foreground mt-2">Misi hidupmu yang lebih besar</p>
                </div>
              </div>
            )}
          </div>

          {/* Channels Section */}
          {channels.length > 0 && (
            <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-up">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Channel Aktif</h3>
              <div className="space-y-3">
                {channels.map((ch: { channel: string }, index: number) => (
                  <div key={index} className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-foreground">{ch.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centers Section */}
          {(definedCenters.length > 0 || undefinedCenters.length > 0) && (
            <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-up">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Pusat Energi</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {definedCenters.length > 0 && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wide text-accent mb-3">Defined (Konsisten)</h4>
                    <div className="flex flex-wrap gap-2">
                      {definedCenters.map((center: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-primary/20 text-foreground rounded-full text-sm">
                          {center}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {undefinedCenters.length > 0 && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wide text-muted-foreground mb-3">Undefined (Terbuka)</h4>
                    <div className="flex flex-wrap gap-2">
                      {undefinedCenters.map((center: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-secondary text-muted-foreground rounded-full text-sm">
                          {center}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* End of Downloadable Content Area */}

        {/* Upsell CTA Section - Only Show if NOT Ordered */}
        {/* Upsell CTA Section - Only Show if NOT Ordered */}
        {!isOrdered ? (
          <div className="bg-emerald-900/60 border border-amber-400/40 rounded-3xl p-6 md:p-8 mb-8 mt-8 animate-fade-up">
            <div className="text-center mb-6">
              <p className="text-amber-400 text-sm font-medium mb-2">🔥 Hanya 50 slot tersisa bulan ini</p>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-300 mb-3">
                Siap Menyelami Potensi Terbesarmu?
              </h3>
              <p className="text-white/90 text-lg">
                Apa yang kamu lihat di sini hanyalah permukaan. Buka Full Foundation Analysis untuk mengungkap misi hidup dan bakat terpendammu.
              </p>
            </div>

            {/* Report Screenshots Carousel */}
            <div className="relative mb-8 max-w-2xl mx-auto">
              <div className="overflow-hidden rounded-xl border border-amber-400/30 shadow-2xl">
                <img
                  src={reportSlides[slideIndex % reportSlides.length].img}
                  alt={reportSlides[slideIndex % reportSlides.length].title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {/* Navigation Arrows */}
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
              {/* Caption */}
              <div className="text-center mt-4">
                <p className="text-amber-300 font-semibold text-lg">{reportSlides[slideIndex % reportSlides.length].title}</p>
                <p className="text-white/80 text-sm">{reportSlides[slideIndex % reportSlides.length].desc}</p>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {reportSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === (slideIndex % reportSlides.length) ? 'bg-amber-400' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">
                  <span className="font-semibold">100+ Halaman Analisis Mendalam</span> — Tipe, Strategi, Otoritas, Profil, dan semua yang kamu lihat di atas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">
                  <span className="font-semibold">Misi Hidupmu (Incarnation Cross)</span> — Mengapa kamu ada di dunia ini
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">
                  <span className="font-semibold">Panduan Praktis Karir & Relasi</span> — Langkah konkret sesuai desainmu
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/90">
                  <span className="font-semibold">Garansi 100% Uang Kembali</span> — Jika tidak puas dalam 7 hari
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setIsProductModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg px-8 py-6 shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-amber-400/50 animate-pulse-slow w-full md:w-auto"
              >
                Dapatkan Full Report Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="text-amber-300 font-bold text-xl">{formatPrice(PRICING_CONFIG.REPORT_PRICE)}</span>
                <span className="text-white/60 line-through text-base">{formatPrice(PRICING_CONFIG.ORIGINAL_PRICE)}</span>
              </div>
              <p className="text-center text-white/60 text-sm mt-2">⚡ Dikirim ke email dalam 24 jam</p>
            </div>
          </div>
        ) : (
          /* Already Ordered Section */
          <div className="mt-12 space-y-12 animate-fade-up">
            {/* Success Access Banner - Showing Full Report Result */}
            <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-3xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-3">
                Full Report Tersedia
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Anda telah membuka akses penuh ke analisis chart ini. Silakan unduh dokumen PDF lengkap untuk mempelajarinya lebih dalam.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => toast({ title: "Silakan cek dashboard atau email Anda", description: "Link download report telah dikirimkan." })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
              </div>
            </div>

            {/* Upsell for New Chart (Partner/Family) */}
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center border-2 border-primary/20">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">
                  Hadiah Transformasi
                </span>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Pahami Orang Terkasih Lebih Dalam
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Human Design bukan hanya tentang dirimu. Bayangkan jika kamu bisa memahami cara komunikasi pasangan, bakat tersembunyi anak, atau potensi sahabatmu.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10 text-left">
                <div className="bg-secondary/30 p-5 rounded-2xl">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">💑</span> Pasangan
                  </h4>
                  <p className="text-sm text-muted-foreground">Pahami bahasa cinta dan konflik mereka. Bangun hubungan yang lebih harmonis tanpa salah paham.</p>
                </div>
                <div className="bg-secondary/30 p-5 rounded-2xl">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">👶</span> Anak
                  </h4>
                  <p className="text-sm text-muted-foreground">Kenali gaya belajar dan bakat unik mereka sejak dini. Pandu mereka sesuai desain sejatinya.</p>
                </div>
                <div className="bg-secondary/30 p-5 rounded-2xl">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">🤝</span> Rekan Kerja
                  </h4>
                  <p className="text-sm text-muted-foreground">Tingkatkan kolaborasi dengan memahami gaya kerja dan pengambilan keputusan mereka.</p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={onReset}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Buat Chart Baru Untuk Mereka
              </Button>
            </div>
          </div>
        )}
        <ProductPreviewModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          userName={userName}
          userEmail={userEmail}
          userPhone={userPhone}
          chartId={chartId}
          userId={userId}
          birthData={birthData}
          chartData={data}
        />

        {/* Save Chart Dialog for Guest Users */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-gradient-fire">Simpan Chart Kamu</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Buat akun gratis untuk menyimpan chart ini dan akses kapan saja
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Dengan membuat akun, kamu bisa:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Simpan semua chart yang kamu buat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Akses chart dari perangkat manapun</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Pesan laporan analisis mendalam</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="fire-glow w-full">
                  <Link to="/account">
                    <LogIn className="w-4 h-4 mr-2" />
                    Buat Akun / Masuk
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Nanti Saja
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Unsaved Chart Warning Dialog */}
        <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Chart Belum Tersimpan</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Chart ini akan hilang jika kamu menutup halaman. Simpan sekarang?
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 pt-4">
              <Button asChild className="fire-glow w-full">
                <Link to="/account">
                  <LogIn className="w-4 h-4 mr-2" />
                  Simpan dengan Buat Akun
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUnsavedWarning(false);
                  onReset();
                }}
              >
                Lanjut Tanpa Menyimpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up mt-8">
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="border-primary text-primary-foreground hover:text-primary-foreground bg-primary/20 hover:bg-primary/40 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Buat Chart Baru
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="border-primary text-primary-foreground hover:text-primary-foreground bg-primary/20 hover:bg-primary/40 rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Salin Link
          </Button>

          {/* Show Save button only for guest users (no chartId means not saved) */}
          {!chartId && !userId && (
            <Button
              onClick={() => setShowSaveDialog(true)}
              variant="outline"
              size="lg"
              className="border-accent text-foreground hover:text-foreground hover:bg-accent/20 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Chart
            </Button>
          )}

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="outline"
            size="lg"
            className="border-primary text-primary-foreground hover:text-primary-foreground bg-primary/20 hover:bg-primary/40 rounded-xl"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Unduh Hasil
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hidden Export View for Image Generation */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          id="chart-export-view"
          ref={exportRef}
          className="w-[1200px] min-h-[1350px] bg-[#01170F] text-[#FDF9E2] p-16 flex flex-col items-center relative overflow-hidden font-sans"
        >
          {/* Background Decorative Elements - Forest & Fire Theme */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#BD590F]/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#022c1e]/40 rounded-full blur-[150px]" />
          </div>

          {/* Header */}
          <div className="w-full flex justify-between items-center border-b border-[#FDF9E2]/10 pb-6 mb-10 z-10 relative">
            <div>
              <p className="text-[#BD590F] font-bold tracking-widest text-lg uppercase mb-2">Human Design Chart</p>
              <h1 className="text-5xl font-bold text-[#FDF9E2] tracking-tight">{userName}</h1>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/favicon.png" alt="Teman Batin" className="w-20 h-20 rounded-xl shadow-xl" />
              <h2 className="text-xl font-bold text-[#BD590F]">Teman Batin</h2>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full flex gap-8 z-10 relative">

            {/* Left: Bodygraph + Planets */}
            <div className="flex-1 flex flex-row items-center justify-center bg-[#FDF9E2]/5 rounded-3xl p-6 border border-[#FDF9E2]/10 gap-4">
              {/* Design Planets */}
              <div className="transform scale-90 origin-right">
                <PlanetColumn planets={designPlanets} title="Design" side="left" />
              </div>

              {/* Bodygraph */}
              <div className="flex-shrink-0">
                {bodygraphImage ? (
                  <img
                    src={bodygraphImage}
                    alt="Bodygraph"
                    className="w-auto h-[750px] object-contain"
                  />
                ) : (
                  <div className="text-slate-500">Bodygraph not available</div>
                )}
              </div>

              {/* Personality Planets */}
              <div className="transform scale-90 origin-left">
                <PlanetColumn planets={personalityPlanets} title="Personality" side="right" />
              </div>
            </div>

            {/* Right: Compact Stats */}
            <div className="w-64 flex flex-col gap-3">










              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Type</p>
                <p className="text-lg font-bold text-[#BD590F]">{chartType}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Strategy</p>
                <p className="text-base font-semibold text-[#FDF9E2]">{strategy}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Authority</p>
                <p className="text-base font-semibold text-[#FDF9E2]">{authority}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Profile</p>
                <p className="text-base font-semibold text-[#FDF9E2]">{profile}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Definition</p>
                <p className="text-sm font-semibold text-[#FDF9E2]">{definition}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Incarnation Cross</p>
                <p className="text-xs font-medium text-[#FDF9E2]/80 leading-tight">{incarnationCross}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Signature</p>
                <p className="text-sm font-medium text-[#BD590F]">{signature || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#FDF9E2]/5 border border-[#FDF9E2]/10">
                <p className="text-[#FDF9E2]/60 text-xs uppercase tracking-wide mb-0.5">Not-Self</p>
                <p className="text-xs font-medium text-[#FDF9E2]">{notSelf || 'N/A'}</p>
              </div>
            </div>
          </div>




          {/* Footer */}
          <div className="w-full mt-8 pt-6 border-t border-[#FDF9E2]/10 flex justify-between items-center text-[#FDF9E2]/50 z-10 relative">
            <p className="text-sm">Generated on {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-sm font-medium text-[#BD590F]">www.temanbatin.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};
