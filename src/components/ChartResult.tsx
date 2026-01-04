import { Button } from '@/components/ui/button';
import { Download, Share2, RotateCcw } from 'lucide-react';

interface ChartResultProps {
  data: any;
  userName: string;
  onReset: () => void;
}

export const ChartResult = ({ data, userName, onReset }: ChartResultProps) => {
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

  // Extract data from API response - data is nested in "general" object
  const general = data?.general || {};
  const chartType = general.energy_type || 'Unknown';
  const strategy = general.strategy || 'Unknown';
  const authority = general.inner_authority || 'Unknown';
  const profile = general.profile || 'Unknown';
  const definition = general.definition || 'Unknown';
  const incarnationCross = general.inc_cross || 'Unknown';
  const signature = general.signature || '';
  const notSelf = general.not_self || '';
  const aura = general.aura || '';
  const definedCenters = general.defined_centers || [];
  const undefinedCenters = general.undefined_centers || [];
  const channels = data?.channels?.Channels || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-fire">
            Selamat, {userName}! 🌟
          </h2>
          <p className="text-xl text-muted-foreground">
            Inilah cetak biru energi kosmikmu
          </p>
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

          {/* Incarnation Cross */}
          {incarnationCross && incarnationCross !== 'Unknown' && (
            <div className="mt-8 text-center">
              <div className="bg-primary/10 rounded-2xl p-6 inline-block">
                <h4 className="text-sm uppercase tracking-wide text-accent mb-2">Incarnation Cross</h4>
                <p className="text-lg font-semibold text-foreground">{incarnationCross}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Misi hidupmu yang lebih besar
                </p>
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
