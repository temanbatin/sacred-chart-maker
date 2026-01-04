import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Share2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BirthDataForChart } from '@/pages/Index';

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
  Sun: '☉',
  Earth: '⊕',
  Moon: '☾',
  North_Node: 'Ω',
  South_Node: '☋',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};

// Format planet name for display
const formatPlanetName = (name: string): string => {
  return name.replace('_', ' ');
};

// Planet descriptions for tooltips
const planetDescriptions: Record<string, { title: string; description: string }> = {
  Sun: {
    title: 'Matahari ☉',
    description: 'Inti dari identitasmu. Mewakili 70% dari energi dan tema hidup utamamu.',
  },
  Earth: {
    title: 'Bumi ⊕',
    description: 'Grounding dan stabilitas. Bagaimana kamu membumi dan menyeimbangkan energi Matahari.',
  },
  Moon: {
    title: 'Bulan ☾',
    description: 'Dorongan dan motivasi. Apa yang mendorongmu maju dalam hidup.',
  },
  North_Node: {
    title: 'North Node Ω',
    description: 'Arah masa depan. Lingkungan dan orang yang membawa pertumbuhan.',
  },
  South_Node: {
    title: 'South Node ☋',
    description: 'Pengalaman masa lalu. Apa yang sudah kamu kuasai dan bawa dari kehidupan sebelumnya.',
  },
  Mercury: {
    title: 'Merkurius ☿',
    description: 'Komunikasi dan pikiran. Bagaimana kamu berpikir dan menyampaikan ide.',
  },
  Venus: {
    title: 'Venus ♀',
    description: 'Nilai dan moral. Apa yang kamu hargai dan bagaimana kamu berhubungan dengan orang lain.',
  },
  Mars: {
    title: 'Mars ♂',
    description: 'Energi dan ketidakdewasaan. Dimana kamu perlu tumbuh dan berkembang.',
  },
  Jupiter: {
    title: 'Jupiter ♃',
    description: 'Hukum dan keberuntungan. Dimana kamu menemukan ekspansi dan peluang.',
  },
  Saturn: {
    title: 'Saturnus ♄',
    description: 'Disiplin dan batasan. Dimana kamu perlu struktur dan tanggung jawab.',
  },
  Uranus: {
    title: 'Uranus ♅',
    description: 'Keunikan dan inovasi. Tema yang tidak biasa dalam hidupmu.',
  },
  Neptune: {
    title: 'Neptunus ♆',
    description: 'Ilusi dan spiritualitas. Dimana kamu perlu kejelasan dan kesadaran.',
  },
  Pluto: {
    title: 'Pluto ♇',
    description: 'Transformasi dan kebenaran. Dimana kamu mengalami perubahan mendalam.',
  },
};

// Planet column component with tooltips
const PlanetColumn = ({ 
  planets, 
  title, 
  side 
}: { 
  planets: PlanetData[]; 
  title: string; 
  side: 'left' | 'right';
}) => {
  const isDesign = side === 'left';
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-0.5">
        <div className={`text-xs font-semibold mb-2 pb-1 border-b text-center ${isDesign ? 'text-primary border-primary' : 'text-foreground border-muted'}`}>
          {title}
        </div>
        {planets.map((planet, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div 
                className={`flex items-center gap-1.5 text-sm py-0.5 cursor-help ${isDesign ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <span className={`w-4 text-center text-xs ${isDesign ? 'text-primary' : 'text-muted-foreground'}`}>
                  {planetSymbols[planet.Planet] || planet.Planet[0]}
                </span>
                <span className="font-medium text-foreground text-xs">
                  {planet.Gate}.{planet.Line}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side={isDesign ? 'left' : 'right'} className="max-w-xs">
              <p className="font-semibold">{planetDescriptions[planet.Planet]?.title || formatPlanetName(planet.Planet)}</p>
              <p className="text-sm text-muted-foreground mt-1">{planetDescriptions[planet.Planet]?.description || `Gate ${planet.Gate}, Line ${planet.Line}`}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
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
    title: 'Digestion (Design - Otak)',
    description: 'Cara terbaik bagi tubuhmu untuk mencerna makanan dan informasi. Arrow kiri = Aktif/Spesifik, Arrow kanan = Pasif/Umum.',
  },
  Environment: {
    title: 'Environment (Design - Tubuh)',
    description: 'Lingkungan fisik yang mendukung kesejahteraanmu. Arrow kiri = Selektif, Arrow kanan = Variabel.',
  },
  Motivation: {
    title: 'Motivation (Personality - Pikiran)',
    description: 'Motivasi sejatimu dalam berpikir. Arrow kiri = Strategis/Fokus, Arrow kanan = Reseptif/Terbuka.',
  },
  Perspective: {
    title: 'Perspective (Personality - Pandangan)',
    description: 'Cara unikmu melihat dan memahami dunia. Arrow kiri = Fokus, Arrow kanan = Periferal.',
  },
};

const VariableArrows = ({ 
  variables, 
  side 
}: { 
  variables: Record<string, VariableArrow>; 
  side: 'left' | 'right';
}) => {
  const isLeft = side === 'left';
  const topKey = isLeft ? 'top_left' : 'top_right';
  const bottomKey = isLeft ? 'bottom_left' : 'bottom_right';
  
  const topVar = variables[topKey];
  const bottomVar = variables[bottomKey];
  
  if (!topVar && !bottomVar) return null;
  
  const getArrow = (value: string) => {
    return value === 'left' ? '←' : '→';
  };
  
  return (
    <div className="flex flex-col justify-center h-full gap-24">
      {topVar && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex flex-col items-center cursor-help ${isLeft ? 'text-primary' : 'text-foreground'}`}>
              <span className="text-2xl font-bold">{getArrow(topVar.value)}</span>
              <span className="text-[10px] text-muted-foreground text-center max-w-16">{topVar.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-semibold">{variableDescriptions[topVar.name]?.title || topVar.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[topVar.name]?.description || `${topVar.aspect} - ${topVar.def_type}`}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {bottomVar && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex flex-col items-center cursor-help ${isLeft ? 'text-primary' : 'text-foreground'}`}>
              <span className="text-2xl font-bold">{getArrow(bottomVar.value)}</span>
              <span className="text-[10px] text-muted-foreground text-center max-w-16">{bottomVar.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-semibold">{variableDescriptions[bottomVar.name]?.title || bottomVar.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[bottomVar.name]?.description || `${bottomVar.aspect} - ${bottomVar.def_type}`}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export const ChartResult = ({ data, userName, birthData, onReset }: ChartResultProps) => {
  const [bodygraphImage, setBodygraphImage] = useState<string | null>(null);
  const [bodygraphLoading, setBodygraphLoading] = useState(false);
  const [bodygraphError, setBodygraphError] = useState<string | null>(null);

  const typeDescriptions: Record<string, string> = {
    Generator: 'Kamu adalah sumber energi yang tak terbatas. Hidupmu tentang menemukan apa yang membuat semangatmu menyala.',
    'Manifesting Generator': 'Kamu adalah multi-passionate yang cepat dan dinamis. Biarkan responsmu memandu ke banyak jalur yang membuatmu hidup.',
    Projector: 'Kamu adalah pemandu yang bijaksana. Tunggu undangan dan bimbinglah orang lain dengan kedalaman pemahamanmu.',
    Manifestor: 'Kamu adalah inisiator yang kuat. Informasikan orang di sekitarmu dan ciptakan dampak yang kamu inginkan.',
    Reflector: 'Kamu adalah cermin lingkungan. Tunggu siklus bulan dan evaluasi dengan bijaksana sebelum membuat keputusan besar.',
  };

  const strategyDescriptions: Record<string, string> = {
    'To Respond': 'Tunggu sesuatu di dunia luar yang memicu responsmu sebelum bertindak.',
    'Wait to Respond': 'Tunggu sesuatu di dunia luar yang memicu responsmu sebelum bertindak.',
    'Wait for the Invitation': 'Biarkan orang lain mengenali nilaimu dan mengundangmu.',
    'To Inform': 'Sampaikan rencanamu sebelum bertindak untuk mengurangi hambatan.',
    'Inform': 'Sampaikan rencanamu sebelum bertindak untuk mengurangi hambatan.',
    'Wait a Lunar Cycle': 'Beri dirimu 28 hari untuk merasakan kejelasan sebelum keputusan besar.',
  };

  const authorityDescriptions: Record<string, string> = {
    'Sacral': 'Dengarkan suara perutmu - respon guttural "uh-huh" atau "un-un".',
    'Emotional': 'Tunggu gelombang emosimu mereda. Kejelasan datang seiring waktu.',
    'Solar Plexus': 'Tunggu gelombang emosimu mereda. Kejelasan datang seiring waktu, bukan di saat emosi tinggi.',
    'Splenic': 'Percaya pada intuisi instan dan spontanmu.',
    'Spleen': 'Percaya pada intuisi instan dan spontanmu. Keputusan terbaik datang dalam sekejap.',
    'Ego Manifested': 'Dengarkan apa yang benar-benar kamu inginkan dari hatimu.',
    'Ego Projected': 'Bicarakan keinginanmu dan dengarkan apa yang keluar dari mulutmu.',
    'Self Projected': 'Bicarakan tentang keputusanmu dan dengarkan identitasmu.',
    'Self-Projected': 'Bicarakan tentang keputusanmu dan dengarkan identitasmu.',
    'Mental': 'Diskusikan dengan orang terpercaya dan perhatikan lingkunganmu.',
    'None': 'Kamu adalah Reflector - tunggu satu siklus bulan penuh sebelum keputusan besar.',
    'Lunar': 'Tunggu satu siklus bulan penuh sebelum keputusan besar.',
  };

  // Fetch bodygraph image when component mounts
  useEffect(() => {
    const fetchBodygraph = async () => {
      if (!birthData) return;

      setBodygraphLoading(true);
      setBodygraphError(null);

      try {
        const { data: result, error } = await supabase.functions.invoke('get-bodygraph', {
          body: birthData,
        });

        if (error) {
          console.error('Error fetching bodygraph:', error);
          setBodygraphError('Gagal memuat gambar bodygraph');
          return;
        }

        if (result?.image) {
          setBodygraphImage(result.image);
        }
      } catch (error) {
        console.error('Error:', error);
        setBodygraphError('Gagal memuat gambar bodygraph');
      } finally {
        setBodygraphLoading(false);
      }
    };

    fetchBodygraph();
  }, [birthData]);

  // Extract data from API response - data is nested in "general" object
  const general = data?.general || {};
  const chartType = general.energy_type || 'Unknown';
  const strategy = general.strategy || 'Unknown';
  const authority = general.inner_authority || 'Unknown';
  const profile = general.profile || 'Unknown';
  const definition = general.definition || 'Unknown';
  const incarnationCross = general.inc_cross || 'Unknown';
  const aura = general.aura || '';
  const signature = general.signature || '';
  const notSelf = general.not_self || '';
  const definedCenters = general.defined_centers || [];
  const undefinedCenters = general.undefined_centers || [];
  const channels = data?.channels?.Channels || [];
  
  // Extract gates/planets data
  const designPlanets: PlanetData[] = data?.gates?.des?.Planets || [];
  const personalityPlanets: PlanetData[] = data?.gates?.prs?.Planets || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-fire">
            Selamat, {userName}! 🌟
          </h2>
          <p className="text-xl text-muted-foreground">
            Inilah cetak biru energi kosmikmu
          </p>
        </div>

        {/* Bodygraph with Planet Columns */}
        <div className="glass-card rounded-3xl p-4 md:p-8 mb-8 animate-fade-up">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Bodygraph Chart</h3>
          
          <div className="flex justify-center items-start gap-2 md:gap-4">
            {/* Design Column (Left) */}
            <div className="hidden md:block flex-shrink-0">
              <PlanetColumn 
                planets={designPlanets}
                title="Design" 
                side="left" 
              />
            </div>

            {/* Bodygraph Image (Center) */}
            <div className="flex-shrink-0 relative">
              {bodygraphLoading ? (
                <Skeleton className="w-64 md:w-80 lg:w-96 h-96 md:h-[500px] rounded-2xl" />
              ) : bodygraphError ? (
                <div className="text-center text-muted-foreground py-12 w-64 md:w-80 lg:w-96">
                  <p>{bodygraphError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      if (birthData) {
                        setBodygraphLoading(true);
                        setBodygraphError(null);
                        supabase.functions.invoke('get-bodygraph', { body: birthData })
                          .then(({ data: result, error }) => {
                            if (error) {
                              setBodygraphError('Gagal memuat gambar bodygraph');
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
                  className="w-64 md:w-80 lg:w-96 h-auto rounded-2xl shadow-lg"
                />
              ) : null}
            </div>

            {/* Personality Column (Right) */}
            <div className="hidden md:block flex-shrink-0">
              <PlanetColumn 
                planets={personalityPlanets}
                title="Personality" 
                side="right" 
              />
            </div>
          </div>

          {/* Variables/Four Arrows - shown below chart for all screens */}
          {general.variables && (
            <TooltipProvider>
              <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-muted">
                <div className="flex gap-4">
                  {general.variables.top_left && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center cursor-help">
                          <span className="text-xl font-bold text-primary">{general.variables.top_left.value === 'left' ? '←' : '→'}</span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.top_left.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{variableDescriptions[general.variables.top_left.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[general.variables.top_left.name]?.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {general.variables.bottom_left && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center cursor-help">
                          <span className="text-xl font-bold text-primary">{general.variables.bottom_left.value === 'left' ? '←' : '→'}</span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.bottom_left.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{variableDescriptions[general.variables.bottom_left.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[general.variables.bottom_left.name]?.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex gap-4">
                  {general.variables.top_right && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center cursor-help">
                          <span className="text-xl font-bold text-foreground">{general.variables.top_right.value === 'left' ? '←' : '→'}</span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.top_right.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{variableDescriptions[general.variables.top_right.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[general.variables.top_right.name]?.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {general.variables.bottom_right && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center cursor-help">
                          <span className="text-xl font-bold text-foreground">{general.variables.bottom_right.value === 'left' ? '←' : '→'}</span>
                          <p className="text-[10px] text-muted-foreground">{general.variables.bottom_right.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{variableDescriptions[general.variables.bottom_right.name]?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{variableDescriptions[general.variables.bottom_right.name]?.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>
          )}

          {/* Mobile: Show planets below chart */}
          <div className="md:hidden mt-6 grid grid-cols-2 gap-4">
            <PlanetColumn 
              planets={designPlanets}
              title="Design" 
              side="left" 
            />
            <PlanetColumn 
              planets={personalityPlanets}
              title="Personality" 
              side="right" 
            />
          </div>
        </div>


        {/* Main Type Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 animate-fade-up">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              Tipe Human Design
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {chartType}
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {typeDescriptions[chartType] || 'Tipe unik dengan karakteristik khusus.'}
            </p>
          </div>

          {/* Key Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Strategy */}
            <div className="bg-secondary/50 rounded-2xl p-6">
              <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Strategi</h4>
              <p className="text-xl font-semibold text-foreground mb-2">{strategy}</p>
              <p className="text-sm text-muted-foreground">
                {strategyDescriptions[strategy] || 'Ikuti strategi unikmu untuk keselarasan.'}
              </p>
            </div>

            {/* Authority */}
            <div className="bg-secondary/50 rounded-2xl p-6">
              <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Otoritas</h4>
              <p className="text-xl font-semibold text-foreground mb-2">{authority}</p>
              <p className="text-sm text-muted-foreground">
                {authorityDescriptions[authority] || 'Otoritas unikmu untuk pengambilan keputusan.'}
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
              <p className="text-sm text-muted-foreground">
                Bagaimana energi mengalir dalam dirimu
              </p>
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
                  <h4 className="text-sm uppercase tracking-wide text-destructive mb-2">Not-Self (Tanda Tidak Selaras)</h4>
                  <p className="text-xl font-semibold text-foreground">{notSelf}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Perasaan yang muncul saat kamu tidak mengikuti desainmu
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Incarnation Cross & Aura */}
          {(incarnationCross && incarnationCross !== 'Unknown') || aura ? (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {incarnationCross && incarnationCross !== 'Unknown' && (
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Incarnation Cross</h4>
                  <p className="text-lg font-semibold text-foreground">{incarnationCross}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Misi hidupmu yang lebih besar
                  </p>
                </div>
              )}
              {aura && (
                <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                  <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Aura</h4>
                  <p className="text-lg font-semibold text-foreground">{aura}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Bagaimana energimu dirasakan oleh orang lain
                  </p>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
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
            size="lg"
            className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh Hasil
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-foreground hover:bg-primary/10 rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>
    </section>
  );
};