import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Share2, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import type { BirthDataForChart } from "@/pages/Index";

interface ChartResultProps {
  data: any;
  userName: string;
  birthData: BirthDataForChart | null;
  onReset: () => void;
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

// Variables/Four Arrows component
interface VariableArrow {
  value: string;
  name: string;
  aspect: string;
  def_type: string;
}

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

const VariableArrows = ({ variables, side }: { variables: Record<string, VariableArrow>; side: "left" | "right" }) => {
  const isLeft = side === "left";
  const topKey = isLeft ? "top_left" : "top_right";
  const bottomKey = isLeft ? "bottom_left" : "bottom_right";

  const topVar = variables[topKey];
  const bottomVar = variables[bottomKey];

  if (!topVar && !bottomVar) return null;

  const getArrow = (value: string) => {
    return value === "left" ? "←" : "→";
  };

  return (
    <div className="flex flex-col justify-center h-full gap-24">
      {topVar && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity ${isLeft ? "text-primary" : "text-foreground"}`}
            >
              <span className="text-2xl font-bold">{getArrow(topVar.value)}</span>
              <span className="text-[10px] text-muted-foreground text-center max-w-16">{topVar.name}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" className="max-w-xs p-3">
            <p className="font-semibold">{variableDescriptions[topVar.name]?.title || topVar.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {variableDescriptions[topVar.name]?.description || `${topVar.aspect} - ${topVar.def_type}`}
            </p>
          </PopoverContent>
        </Popover>
      )}
      {bottomVar && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity ${isLeft ? "text-primary" : "text-foreground"}`}
            >
              <span className="text-2xl font-bold">{getArrow(bottomVar.value)}</span>
              <span className="text-[10px] text-muted-foreground text-center max-w-16">{bottomVar.name}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="max-w-xs p-3">
            <p className="font-semibold">{variableDescriptions[bottomVar.name]?.title || bottomVar.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {variableDescriptions[bottomVar.name]?.description || `${bottomVar.aspect} - ${bottomVar.def_type}`}
            </p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export const ChartResult = ({ data, userName, birthData, onReset }: ChartResultProps) => {
  const [bodygraphImage, setBodygraphImage] = useState<string | null>(null);
  const [bodygraphLoading, setBodygraphLoading] = useState(false);
  const [bodygraphError, setBodygraphError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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
  }, [birthData]);

  // Download chart as PDF
  const handleDownload = async () => {
    if (!chartRef.current) return;

    setIsDownloading(true);

    let clone: HTMLElement | null = null;
    try {
      // Clone the element for PDF rendering to avoid affecting the UI
      clone = chartRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      // Keep it effectively invisible, but not fully transparent (some browsers render 0-opacity nodes as blank)
      clone.style.opacity = "0.01";
      clone.style.pointerEvents = "none";
      // Avoid negative z-index (can place it behind the document/background and render blank)
      clone.style.zIndex = "9999";
      // Move it out of view while still being "rendered" by the browser
      clone.style.transform = "translateX(-200vw)";
      clone.style.width = chartRef.current.offsetWidth + "px";
      clone.style.background = "#1a1a2e";
      clone.style.padding = "20px";
      document.body.appendChild(clone);

      // Fix all elements with problematic styles in the clone
      const allElements = clone.querySelectorAll("*");
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);

        // Remove backdrop filters and gradients that don't render well
        if (computedStyle.backdropFilter !== "none") {
          element.style.backdropFilter = "none";
          (element.style as any).webkitBackdropFilter = "none";
        }

        // Fix backgrounds with gradients or transparent colors
        if (
          computedStyle.background.includes("gradient") ||
          computedStyle.background.includes("rgba") ||
          computedStyle.background.includes("transparent")
        ) {
          element.style.background = "#252547";
        }

        // Ensure text is visible
        if (computedStyle.color.includes("rgba")) {
          element.style.color = "#ffffff";
        }
      });

      // Specifically fix glass-card elements
      const glassCards = clone.querySelectorAll(".glass-card");
      glassCards.forEach((card) => {
        const element = card as HTMLElement;
        element.style.background = "#252547";
        element.style.backdropFilter = "none";
        element.style.border = "1px solid #3d3d6b";
      });

      // Fix gradient text
      const gradientTexts = clone.querySelectorAll('[class*="text-gradient"]');
      gradientTexts.forEach((text) => {
        const element = text as HTMLElement;
        element.style.background = "none";
        element.style.backgroundClip = "unset";
        element.style.webkitBackgroundClip = "unset";
        element.style.webkitTextFillColor = "#d4a574";
        element.style.color = "#d4a574";
      });

      // Wait 2 frames to ensure the clone has been laid out & painted
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

      const options = {
        margin: 5,
        filename: `human-design-chart-${userName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
        image: { type: "jpeg" as const, quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1a1a2e",
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["css", "legacy"], avoid: ["img", ".glass-card"] },
      };

      await html2pdf().from(clone).set(options).save();

      toast({
        title: "Berhasil!",
        description: "Chart berhasil diunduh sebagai PDF.",
      });
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast({
        title: "Gagal mengunduh",
        description: "Terjadi kesalahan saat mengunduh chart.",
        variant: "destructive",
      });
    } finally {
      if (clone?.parentElement) clone.parentElement.removeChild(clone);
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
                  <Skeleton className="w-64 md:w-96 lg:w-[480px] xl:w-[540px] h-96 md:h-[550px] lg:h-[650px] xl:h-[700px] rounded-2xl" />
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

            {/* Incarnation Cross & Aura */}
            {(incarnationCross && incarnationCross !== "Unknown") || aura ? (
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {incarnationCross && incarnationCross !== "Unknown" && (
                  <div className="bg-primary/10 rounded-2xl p-6 text-center">
                    <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Incarnation Cross</h4>
                    <p className="text-lg font-semibold text-foreground">{incarnationCross}</p>
                    <p className="text-sm text-muted-foreground mt-2">Misi hidupmu yang lebih besar</p>
                  </div>
                )}
                {aura && (
                  <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                    <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Aura</h4>
                    <p className="text-lg font-semibold text-foreground">{aura}</p>
                    <p className="text-sm text-muted-foreground mt-2">Bagaimana energimu dirasakan oleh orang lain</p>
                  </div>
                )}
              </div>
            ) : null}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up mt-8">
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="border-primary text-foreground hover:bg-primary/10 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Hitung Ulang
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="lg"
            className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
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
          <Button variant="outline" size="lg" className="border-primary text-foreground hover:bg-primary/10 rounded-xl">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>
    </section>
  );
};
