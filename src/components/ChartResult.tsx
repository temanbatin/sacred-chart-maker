import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Share2, RotateCcw, Loader2, CheckCircle2, Save, LogIn, ChevronLeft, ChevronRight, Plus, ArrowRight, Lock } from "lucide-react";
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
import { PRICING_CONFIG, PRODUCTS, formatPrice } from "@/config/pricing";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

const reportSlides = [
  { img: reportSS1, title: "Daftar Isi Lengkap", desc: "100+ halaman strukturnya jelas, mudah diikuti dari awal hingga akhir" },
  { img: reportSS2, title: "Langkah Praktis Sesuai Authority", desc: "Panduan spesifik berdasarkan cara kamu membuat keputusan terbaik" },
  { img: reportSS3, title: "Strategi Personal Kehidupan", desc: "Cara memanfaatkan kekuatan unikmu di karir, relasi, dan keseharian" },
];

const ExpandableText = ({ text, limit = 150 }: { text: string; limit?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;
  if (text.length <= limit) return <p className="text-muted-foreground">{text}</p>;

  return (
    <div className="flex flex-col items-start">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs font-medium text-primary mt-2 hover:underline"
      >
        {isExpanded ? (
          <>Lebih Sedikit <ChevronUp className="w-3 h-3" /></>
        ) : (
          <>Baca Selengkapnya <ChevronDown className="w-3 h-3" /></>
        )}
      </button>
    </div>
  );
};

interface ChartData {
  general: {
    energy_type?: string;
    strategy?: string;
    inner_authority?: string;
    profile?: string;
    definition?: string;
    inc_cross?: string;
    aura?: string;
    signature?: string;
    not_self?: string;
    defined_centers?: any[];
    undefined_centers?: any[];
    utc_datetime?: string;
    utc_date?: string;
    utc_time?: string;
    variables?: {
      top_left?: { value: string };
      bottom_left?: { value: string };
      top_right?: { value: string };
      bottom_right?: { value: string };
    };
  };
  channels?: {
    Channels?: any[];
  };
  gates?: {
    des?: { Planets: PlanetData[] };
    prs?: { Planets: PlanetData[] };
  };
  utc?: string;
  [key: string]: any; // Allow other properties
}

interface ChartResultProps {
  data: ChartData;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  birthData: BirthData | null;
  chartId?: string;
  userId?: string;
  onReset: () => void;
  isOrdered?: boolean;
  className?: string;
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

// Planet column - aligned properly for symmetry
const PlanetColumn = ({ planets, title, side, hideHeader = false }: { planets: PlanetData[]; title: string; side: "left" | "right"; hideHeader?: boolean }) => {
  const isDesign = side === "left";

  return (
    <div className={`flex flex-col ${isDesign ? "items-end" : "items-start"}`}>
      {/* Header with arrow - Conditionally Rendered */}
      {!hideHeader && (
        <div className={`flex items-center gap-1 mb-2 pb-1 border-b border-muted w-full ${isDesign ? "justify-end" : "justify-start"}`}>
          {isDesign && <span className="text-primary text-xs">←</span>}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDesign ? "text-primary" : "text-muted-foreground"}`}>
            {title}
          </span>
          {!isDesign && <span className="text-muted-foreground text-xs">→</span>}
        </div>
      )}
      {/* Planet rows - aligned */}
      {planets.map((planet, index) => (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <div
              className={`flex items-center gap-1.5 py-0.5 cursor-pointer hover:bg-muted/30 rounded px-1 transition-colors ${isDesign ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Gate.Line */}
              <span className="text-xs font-medium text-foreground">
                {planet.Gate}.{planet.Line}
              </span>
              {/* Planet symbol */}
              <span className={`text-xs ${isDesign ? "text-primary" : "text-muted-foreground"}`}>
                {planetSymbols[planet.Planet] || planet.Planet[0]}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent side={isDesign ? "left" : "right"} className="max-w-xs p-3">
            <p className="font-semibold text-sm">
              {planetDescriptions[planet.Planet]?.title || formatPlanetName(planet.Planet)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
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

// Properties sidebar component for desktop layout
interface PropertiesSidebarProps {
  userName: string;
  birthData: BirthData | null;
  chartType: string;
  strategy: string;
  authority: string;
  profile: string;
  definition: string;
  incarnationCross: string;
  signature: string;
  notSelf: string;
  variables?: {
    top_left?: { value: string };
    bottom_left?: { value: string };
    top_right?: { value: string };
    bottom_right?: { value: string };
  };
  utcDateTime?: string;
}

const PropertiesSidebar = ({
  userName,
  birthData,
  chartType,
  strategy,
  authority,
  profile,
  definition,
  incarnationCross,
  signature,
  notSelf,
  variables,
  utcDateTime,
}: PropertiesSidebarProps) => {
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const formatDateTimeLocal = () => {
    if (!birthData) return "—";
    return `${birthData.day} ${monthNames[birthData.month - 1]} ${birthData.year}, ${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}`;
  };

  const formatDateTimeUTC = () => {
    if (utcDateTime) return utcDateTime;
    return "—";
  };

  const getVariableString = () => {
    if (!variables) return "—";
    const tl = variables.top_left?.value === "left" ? "P" : "P";
    const bl = variables.bottom_left?.value === "left" ? "R" : "L";
    const tr = variables.top_right?.value === "left" ? "L" : "R";
    const br = variables.bottom_right?.value === "left" ? "L" : "L";
    return `${tl}${bl}${tr} ${br}LL`;
  };

  const Item = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-muted-foreground mt-0.5 w-4 h-4 flex items-center justify-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
        <p className="text-xs font-semibold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
        </div>
        <h2 className="text-base font-bold text-foreground uppercase tracking-wide">Properties</h2>
      </div>

      {/* Birth Data - 2 columns */}
      <div className="mb-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Birth Data</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          <Item icon={<span className="text-xs">○</span>} label="Name" value={userName} />
          <Item icon={<span className="text-xs">◎</span>} label="Date and Time (Local)" value={formatDateTimeLocal()} />
          <Item icon={<span className="text-xs">◎</span>} label="Date and Time (UTC)" value={formatDateTimeUTC()} />
          <Item icon={<span className="text-xs">◉</span>} label="Location" value={birthData?.place || "—"} />
        </div>
      </div>

      {/* Properties - 2 columns */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Properties</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          <Item icon={<span className="text-xs">◈</span>} label="Type" value={chartType} />
          <Item icon={<span className="text-xs">⟡</span>} label="Strategy" value={strategy} />
          <Item icon={<span className="text-xs">✧</span>} label="Signature" value={signature || "—"} />
          <Item icon={<span className="text-xs">◆</span>} label="Not-Self Theme" value={notSelf || "—"} />
          <Item icon={<span className="text-xs">△</span>} label="Authority" value={authority} />
          <Item icon={<span className="text-xs">⊞</span>} label="Definition" value={definition} />
          <Item icon={<span className="text-xs">✚</span>} label="Incarnation Cross" value={incarnationCross || "—"} />
          <Item icon={<span className="text-xs">◯</span>} label="Profile" value={profile} />
        </div>
        <div className="mt-1">
          <Item icon={<span className="text-xs">⇌</span>} label="Variable" value={getVariableString()} />
        </div>
      </div>
    </div>
  );
};

export const ChartResult = ({ data, userName, userEmail, userPhone, birthData, chartId, userId, onReset, isOrdered = false, className }: ChartResultProps) => {
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
  const instagramExportRef = useRef<HTMLDivElement>(null);
  // ===== DYNAMIC SLOT CONFIGURATION =====
  // Ubah angka ini untuk update otomatis jumlah slot yang tersisa
  const TOTAL_SLOTS = 80; // Total slot tersedia bulan ini
  const MANUAL_SOLD_COUNT = 12; // MANUAL: Jumlah orang yang sudah membeli (ubah angka ini)

  // Future Usage: Set this to true to use Real DB Data
  const USE_REAL_DATA = false;

  const [soldCount, setSoldCount] = useState(MANUAL_SOLD_COUNT);
  const remainingSlots = TOTAL_SLOTS - soldCount;

  // ===== FUTURE: REAL-TIME DATA FETCHING =====
  /* 
  useEffect(() => {
    if (!USE_REAL_DATA) return;

    const fetchRealOrderCount = async () => {
      // Hitung order 'PAID' di bulan ini
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PAID')
        .gte('created_at', startOfMonth.toISOString());

      if (!error && count !== null) {
        setSoldCount(count + MANUAL_SOLD_COUNT); // Bisa ditambah base count jika perlu
      }
    };

    fetchRealOrderCount();
  }, []);
  */
  // ==========================================

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

  const birthDataString = JSON.stringify(birthData);

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
          body: { ...birthData, email: userEmail, whatsapp: userPhone },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthDataString]);

  // Download chart as Instagram Story-friendly portrait image
  const handleDownloadInstagram = async () => {
    if (!instagramExportRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(instagramExportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1920,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (blob) {
        const fileName = `temanbatin-${userName.replace(/\s+/g, "-").toLowerCase()}-story.png`;
        const file = new File([blob], fileName, { type: "image/png" });
        const canShare = navigator.canShare && navigator.canShare({ files: [file] });

        // Try Web Share API first (Mobile Support)
        if (navigator.share && canShare) {
          try {
            await navigator.share({
              files: [file],
              title: "Chart Teman Batin",
              text: `Cek chart Human Design saya!`,
            });
            toast({
              title: "Berhasil!",
              description: "Chart berhasil dibagikan.",
            });
            return; // Stop here if shared successfully
          } catch (shareError: any) {
            // Context: AbortError means user cancelled the share sheet
            if (shareError.name === 'AbortError') {
              return;
            }
            console.warn("Share API failed, falling back to download:", shareError);
            // Fallthrough to download logic
          }
        }

        // Fallback: Download Image (Desktop / Unsuccessful Share)
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Berhasil Diunduh!",
          description: "Chart tersimpan di perangkat kamu.",
        });
      }
    } catch (error) {
      console.error("Error generating/sharing chart:", error);
      toast({
        title: "Gagal memproses chart",
        description: "Terjadi kesalahan saat membuat gambar.",
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

  // Safety check to prevent white screen if data is missing
  if (!data || !general) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Memuat data chart...</p>
      </div>
    );
  }

  return (
    <section className={cn("py-20 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        {/* Downloadable Content Area */}
        <div ref={chartRef} className="bg-background p-4 md:p-8 rounded-3xl">
          <div className="text-center mb-8 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gradient-fire">Selamat, {userName}! 🌟</h2>
            <p className="text-lg text-muted-foreground">Inilah cetak biru energi kosmikmu</p>

            {/* Unsaved Chart Banner for Guest Users */}
          </div>

          {/* Main Content Layout - Desktop: Sidebar + Chart | Mobile: Chart Only */}
          <div className="animate-fade-up">

            {/* DESKTOP LAYOUT: 50/50 Split - Properties | Chart+Planets */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-start">
              {/* Left: Properties Sidebar */}
              <PropertiesSidebar
                userName={userName}
                birthData={birthData}
                chartType={chartType}
                strategy={strategy}
                authority={authority}
                profile={profile}
                definition={definition}
                incarnationCross={incarnationCross}
                signature={signature}
                notSelf={notSelf}
                variables={general.variables}
                utcDateTime={general.utc_datetime || (general.utc_date && general.utc_time ? `${general.utc_date} ${general.utc_time}` : (data.utc || undefined))}
              />

              {/* Right: Design + Variables + Bodygraph + Variables + Personality */}
              {/* pt-12 to align with Birth Data section (after Properties header) */}
              <div className="flex justify-center items-start pt-12 gap-1">
                {/* Design Column - fixed width for symmetry */}
                <div className="flex-shrink-0 self-start w-[80px]">
                  <PlanetColumn planets={designPlanets} title="DESIGN" side="left" />
                </div>

                {/* Bodygraph Chart */}
                <div className="flex-shrink-0 self-start relative mx-8">
                  {/* Variable Arrows Overlay - Desktop */}
                  {general.variables && (
                    <>
                      {/* Left Arrows (Design) */}
                      <div className="absolute top-[60px] left-[30px] flex flex-col gap-8 z-30">
                        <span className="text-sm font-bold text-amber-500 drop-shadow-md transform scale-125">
                          {general.variables.top_left?.value === "left" ? "←" : "→"}
                        </span>
                        <span className="text-sm font-bold text-amber-500 drop-shadow-md transform scale-125">
                          {general.variables.bottom_left?.value === "left" ? "←" : "→"}
                        </span>
                      </div>

                      {/* Right Arrows (Personality) */}
                      <div className="absolute top-[60px] right-[30px] flex flex-col gap-8 z-30">
                        <span className="text-sm font-bold text-foreground drop-shadow-md transform scale-125">
                          {general.variables.top_right?.value === "left" ? "←" : "→"}
                        </span>
                        <span className="text-sm font-bold text-foreground drop-shadow-md transform scale-125">
                          {general.variables.bottom_right?.value === "left" ? "←" : "→"}
                        </span>
                      </div>
                    </>
                  )}

                  {bodygraphLoading ? (
                    <div className="w-[220px] xl:w-[260px] h-[300px] xl:h-[360px] rounded-xl bg-secondary/30 flex flex-col items-center justify-center border border-dashed border-muted animate-pulse">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                      <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                  ) : bodygraphImage ? (
                    <img
                      src={bodygraphImage}
                      alt="Bodygraph"
                      className="w-[220px] xl:w-[260px] h-auto relative z-10"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-[220px] xl:w-[260px] h-[300px] bg-secondary/20 rounded-xl flex items-center justify-center text-muted-foreground text-sm">Chart unavailable</div>
                  )}
                </div>

                {/* Personality Column - fixed width for symmetry */}
                <div className="flex-shrink-0 self-start w-[80px]">
                  <PlanetColumn planets={personalityPlanets} title="PERSONALITY" side="right" />
                </div>
              </div>
            </div>

            <div className="lg:hidden relative mt-8 mb-8">
              {/* Chart with Planet Columns - Centered - Bottom Aligned */}
              <div className="w-full flex justify-center items-start gap-0 relative">

                {/* Design Column - fixed width */}
                <div className="w-[70px] flex-shrink-0 self-start mt-12 relative z-20 text-right">
                  <PlanetColumn planets={designPlanets} title="DESIGN" side="left" hideHeader={false} />
                </div>

                {/* Bodygraph Container with Overlay Variables */}
                <div className="flex-shrink-0 relative z-10 mt-[75px]">
                  {/* Variable Arrows Overlay - Positioned specifically around the head */}
                  {general.variables && (
                    <>
                      {/* Left Arrows (Design) */}
                      <div className="absolute top-[45px] left-[25px] flex flex-col gap-6 z-30">
                        <span className="text-xs font-bold text-amber-500 drop-shadow-md transform scale-125">
                          {general.variables.top_left?.value === "left" ? "←" : "→"}
                        </span>
                        <span className="text-xs font-bold text-amber-500 drop-shadow-md transform scale-125">
                          {general.variables.bottom_left?.value === "left" ? "←" : "→"}
                        </span>
                      </div>

                      {/* Right Arrows (Personality) */}
                      <div className="absolute top-[45px] right-[25px] flex flex-col gap-6 z-30">
                        <span className="text-xs font-bold text-foreground drop-shadow-md transform scale-125">
                          {general.variables.top_right?.value === "left" ? "←" : "→"}
                        </span>
                        <span className="text-xs font-bold text-foreground drop-shadow-md transform scale-125">
                          {general.variables.bottom_right?.value === "left" ? "←" : "→"}
                        </span>
                      </div>
                    </>
                  )}

                  {bodygraphLoading ? (
                    <div className="w-[200px] aspect-[3/4] rounded-xl bg-secondary/30 flex flex-col items-center justify-center animate-pulse">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : bodygraphImage ? (
                    <img src={bodygraphImage} alt="Bodygraph" className="w-[200px] h-auto relative z-10" />
                  ) : (
                    <div className="w-[200px] aspect-[3/4] bg-secondary/20 rounded-xl flex items-center justify-center text-muted-foreground text-xs">Chart unavailable</div>
                  )}
                </div>

                {/* Personality Column - fixed width */}
                <div className="w-[70px] flex-shrink-0 self-start mt-12 relative z-20 text-left">
                  <PlanetColumn planets={personalityPlanets} title="PERSONALITY" side="right" hideHeader={false} />
                </div>
              </div>

              {/* Properties Section for Mobile - Matching Desktop */}
              <div className="mt-6 px-4">
                {/* Birth Data */}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Birth Data</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Name</p>
                    <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Location</p>
                    <p className="text-xs font-semibold text-foreground truncate">{birthData?.place || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Date & Time (Local)</p>
                    <p className="text-xs font-semibold text-foreground">
                      {birthData ? `${birthData.day}/${birthData.month}/${birthData.year}, ${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}` : "—"}
                    </p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Date & Time (UTC)</p>
                    <p className="text-xs font-semibold text-foreground">
                      {general.utc_datetime || (general.utc_date && general.utc_time ? `${general.utc_date} ${general.utc_time}` : (data.utc || "—"))}
                    </p>
                  </div>
                </div>

                {/* Properties */}
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Properties</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Type</p>
                    <p className="text-xs font-semibold text-foreground">{chartType}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Strategy</p>
                    <p className="text-xs font-semibold text-foreground">{strategy}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Signature</p>
                    <p className="text-xs font-semibold text-foreground">{signature || "—"}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Not-Self</p>
                    <p className="text-xs font-semibold text-foreground">{notSelf || "—"}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Authority</p>
                    <p className="text-xs font-semibold text-foreground">{authority}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Definition</p>
                    <p className="text-xs font-semibold text-foreground">{definition}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Profile</p>
                    <p className="text-xs font-semibold text-foreground">{profile}</p>
                  </div>
                  <div className="py-1 overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase">Variable</p>
                    <p className="text-xs font-semibold text-foreground">
                      {general.variables ? `${general.variables.top_left?.value === "left" ? "P" : "P"}${general.variables.bottom_left?.value === "left" ? "R" : "L"}${general.variables.top_right?.value === "left" ? "L" : "R"} ${general.variables.bottom_right?.value === "left" ? "L" : "L"}LL` : "—"}
                    </p>
                  </div>
                </div>
                <div className="py-1 mt-2 overflow-hidden">
                  <p className="text-[10px] text-muted-foreground uppercase">Incarnation Cross</p>
                  <p className="text-xs font-semibold text-foreground">{incarnationCross || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal spacing before CTA sections */}
        </div>
        {/* End of Downloadable Content Area */}

        {/* Action Buttons - Icon Only - Below Chart */}
        <div className="flex gap-2 justify-center my-4">
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-muted/30 hover:bg-muted/50 transition-all hover:text-amber-400 group"
            title="Buat Chart Baru"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </Button>

          {/* Save button for guest users */}
          {!chartId && !userId && (
            <Button
              onClick={() => setShowSaveDialog(true)}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors hover:text-amber-400"
              title="Simpan Chart"
            >
              <Save className="w-5 h-5" />
            </Button>
          )}

          <Button
            onClick={handleDownloadInstagram}
            disabled={isDownloading}
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors hover:text-amber-400"
            title="Bagikan ke Instagram"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Save to Account CTA - Only for Guest Users */}
        {isUnsaved && (
          <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 rounded-2xl p-6 md:p-8 mb-8 mt-6 animate-fade-up">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
                <Save className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Simpan Chart ke Akun Kamu
                </h3>
                <p className="text-muted-foreground">
                  Simpan chart ini agar tidak hilang. Akses kapan saja dari perangkat manapun.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={async () => {
                    if (birthData) {
                      localStorage.setItem('pending_chart_data', JSON.stringify(birthData));
                    }
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/account`,
                      },
                    });
                    if (error) {
                      toast({ title: "Gagal memproses login Google", variant: "destructive" });
                    }
                  }}
                  className="bg-white text-emerald-950 hover:bg-gray-100 border border-gray-200 h-12 px-6 rounded-xl font-semibold shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upsell CTA Section - Only Show if NOT Ordered */}
        {!isOrdered ? (
          <div id="cta-section" className="bg-emerald-900/60 border border-amber-400/40 rounded-3xl p-6 md:p-8 mb-8 mt-8 animate-fade-up">
            <div className="text-center mb-6">
              <p className="text-amber-400 text-sm font-medium mb-1">🔥 Hanya {remainingSlots} slot tersisa bulan ini</p>
              <p className="text-white/60 text-xs mb-3">{soldCount} orang telah memesan minggu ini</p>
              <h3 className="text-2xl md:text-3xl font-bold text-amber-300 mb-3">
                Siap Menyelami Potensi Terbesarmu?
              </h3>
              <p className="text-white/90 text-lg">
                Apa yang kamu lihat di sini hanyalah permukaan. Pesan In-depth Analysis untuk mengungkap misi hidup dan bakat terpendammu.
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
                  <span className="font-semibold">Garansi 100% Pembuatan Report Ulang</span> — Jika ada kesalahan data
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
                <span className="text-amber-300 font-bold text-xl">Mulai {formatPrice(PRODUCTS.ESSENTIAL_REPORT.price)}</span>
                <span className="text-white/60 line-through text-base">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.original_price)}</span>
              </div>
              <p className="text-center text-white/60 text-sm mt-2">⚡ Tersedia Paket Essential & Full Report</p>
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
                <Button
                  onClick={async () => {
                    if (birthData) {
                      localStorage.setItem('pending_chart_data', JSON.stringify(birthData));
                    }
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/account`,
                      },
                    });
                    if (error) {
                      toast({ title: "Gagal memproses login Google", variant: "destructive" });
                    }
                  }}
                  className="bg-white text-emerald-950 hover:bg-gray-100 border border-gray-200 w-full rounded-xl font-semibold shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
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
              <Button
                onClick={async () => {
                  if (birthData) {
                    localStorage.setItem('pending_chart_data', JSON.stringify(birthData));
                  }
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: `${window.location.origin}/account`,
                    },
                  });
                  if (error) {
                    toast({ title: "Gagal memproses login Google", variant: "destructive" });
                  }
                }}
                className="fire-glow w-full"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
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
      </div>

      {/* Hidden Instagram Story Export View - Luxury Edition 1080x1920 */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          id="instagram-story-export-view"
          ref={instagramExportRef}
          style={{
            width: '1080px',
            height: '1920px',
            background: '#FDF9E2',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Playfair Display', serif",
            color: '#052820',
          }}
        >
          {/* Decorative Background Elements - Soft Glows */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(189, 89, 15, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }} />

          {/* Artistic Bodygraph - Straight & Clean with Planets */}
          <div style={{
            position: 'absolute',
            top: '19%', // Tweaked for perfect optical center
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Top align columns to chart shoulders
            opacity: 1,
            zIndex: 1,
            gap: '0px', // Removed gap for overlay effect
          }}
          >
            {/* Design Planets (Left) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px', // Consistent rhythm
              marginTop: '60px', // Align with chart head/shoulders visually
              marginRight: '-60px', // Pull into bodygraph
              zIndex: 10, // Text on top of image
              position: 'relative',
            }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#BD590F', marginBottom: '12px' }}>DESIGN</div>
              {designPlanets.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: '600', color: '#052820' }}>{p.Gate}.{p.Line}</span>
                  <span style={{ fontFamily: "'serif'", fontSize: '18px', color: '#BD590F', lineHeight: 1 }}>
                    {planetSymbols[p.Planet] || p.Planet.charAt(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bodygraph Image */}
            {bodygraphImage && (
              <img
                src={bodygraphImage}
                alt="Bodygraph"
                crossOrigin="anonymous" // Critical for html2canvas
                style={{
                  maxWidth: '580px', // Perfect size relative to 1080px width
                  height: 'auto',
                  objectFit: 'contain',
                  marginTop: '0px',
                }}
              />
            )}

            {/* Personality Planets (Right) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '10px',
              marginTop: '60px', // Align with chart head/shoulders visually
              marginLeft: '-60px', // Pull into bodygraph
              zIndex: 10,
              position: 'relative',
            }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#052820', marginBottom: '12px' }}>PERSONALITY</div>
              {personalityPlanets.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: "'serif'", fontSize: '18px', color: '#052820', lineHeight: 1 }}>
                    {planetSymbols[p.Planet] || p.Planet.charAt(0)}
                  </span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: '600', color: '#052820' }}>{p.Gate}.{p.Line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Container - Z-Index above chart */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '70px 70px 50px 70px', // Optimized padding
          }}>

            {/* Header - Editorial Style */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '18px',
                fontWeight: '600',
                letterSpacing: '5px', // Wider tracking for elegance
                color: '#BD590F',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Human Design Chart
              </p>
              <h1 style={{
                fontSize: '100px', // Slightly larger impact
                fontWeight: '700',
                fontStyle: 'italic',
                lineHeight: '0.85',
                marginBottom: '24px',
                letterSpacing: '-3px',
              }}>
                {userName.split(' ')[0]}
                {userName.split(' ').length > 1 && (
                  <span style={{ display: 'block', fontSize: '0.5em', fontStyle: 'normal', fontWeight: '400', marginTop: '12px', letterSpacing: '0px' }}>
                    {userName.split(' ').slice(1).join(' ')}
                  </span>
                )}
              </h1>

              <div style={{
                width: '40px', // Subtle divider
                height: '3px',
                background: '#052820',
                margin: '0 auto',
                borderRadius: '100px',
                opacity: 0.8,
              }} />
            </div>

            {/* Middle Section - Spacer */}
            <div style={{ flex: 1 }}></div>

            {/* Bottom Section - Attributes List (No Boxes, Clean Spacing) */}
            <div style={{
              background: '#FDF9E2',
              paddingTop: '40px',
              paddingBottom: '30px',
              position: 'relative',
              marginTop: '-40px',
            }}>
              {/* Chart Type - Highlighted */}
              <div style={{
                textAlign: 'center',
                marginBottom: '50px',
              }}>
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '15px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(5, 40, 32, 0.6)',
                  marginBottom: '10px',
                }}>
                  Energy Type
                </p>
                <p style={{
                  fontSize: '52px', // Larger hero text
                  fontWeight: '800', // Bolder
                  letterSpacing: '-1.5px',
                  color: '#052820',
                }}>
                  {chartType}
                </p>
              </div>

              {/* Attributes Grid - Clean Typography & More Breathing Room */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px 40px', // Generous spacing
                borderTop: '1px solid rgba(5, 40, 32, 0.08)',
                paddingTop: '50px',
                marginBottom: '70px',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#BD590F',
                    marginBottom: '10px',
                  }}>
                    Strategy
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: '600', lineHeight: '1.2' }}>
                    {strategy}
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#BD590F',
                    marginBottom: '10px',
                  }}>
                    Authority
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: '600', lineHeight: '1.2' }}>
                    {authority}
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#BD590F',
                    marginBottom: '10px',
                  }}>
                    Profile
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: '600', lineHeight: '1.2' }}>
                    {profile}
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#BD590F',
                    marginBottom: '10px',
                  }}>
                    Definition
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: '600', lineHeight: '1.2' }}>
                    {definition}
                  </p>
                </div>
              </div>

              {/* Footer Branding - Perfectly Integrated */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px', // Tighter spacing
                marginTop: 'auto',
              }}>
                <img
                  src="/favicon.png"
                  alt="Logo"
                  style={{
                    width: '64px', // Slightly more subtle
                    height: '64px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 16px rgba(5, 40, 32, 0.1)', // Premium soft shadow
                    marginBottom: '4px',
                  }}
                />

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: '16px', // Larger, readable
                    color: 'rgba(5, 40, 32, 0.7)',
                    marginBottom: '2px',
                  }}>
                    Create your free chart at
                  </p>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '18px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    color: '#052820',
                  }}>
                    temanbatin.com
                  </p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Floating Sticky CTA for Non-Purchased Users */}
      {
        !isOrdered && (
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
            {/* Mobile: Clean light floating bar */}
            <div className="lg:hidden">
              <div className="mx-3 mb-3 rounded-xl bg-white border border-gray-200 p-3 shadow-xl safe-area-bottom">
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Chart Analysis</span>
                    <span className="text-emerald-700 font-semibold">5%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[5%] bg-emerald-500 rounded-full" />
                  </div>
                </div>

                {/* CTA Button - Scrolls to main CTA */}
                <Button
                  onClick={() => {
                    document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 rounded-lg"
                >
                  Pesan In-Dept Analysis Desain Sejatimu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Desktop: Slim bottom bar - Light Theme to match Mobile */}
            <div className="hidden lg:block bg-white border-t border-gray-200 py-3 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                {/* Left: Progress Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col w-full max-w-md">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Chart Analysis</span>
                      <span className="text-emerald-700 font-bold">5%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                      <div className="h-full w-[5%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Right: Button */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => {
                      document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-8 py-2.5 rounded-lg shadow-sm transition-all"
                  >
                    Pesan In-Dept Analysis Desain Sejatimu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </section >
  );
};
