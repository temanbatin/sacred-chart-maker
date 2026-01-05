import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { BookOpen, Users, Heart, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const learnCategories = [
  {
    title: 'Apa Itu Human Design?',
    description: 'Pelajari dasar-dasar sistem Human Design dan bagaimana ia dapat membantu Anda memahami diri sendiri.',
    icon: BookOpen,
    href: '/learn/apa-itu-human-design',
    comingSoon: true,
  },
  {
    title: 'Human Design Types',
    description: 'Kenali 5 tipe energi: Generator, Manifesting Generator, Projector, Manifestor, dan Reflector.',
    icon: Users,
    href: '/learn/type',
    comingSoon: true,
  },
  {
    title: 'Energy Centers',
    description: 'Pahami 9 pusat energi dalam bodygraph dan bagaimana mereka mempengaruhi hidup Anda.',
    icon: Heart,
    href: '/learn/centers',
    comingSoon: true,
  },
  {
    title: 'Authority',
    description: 'Temukan cara Anda membuat keputusan yang tepat berdasarkan otoritas batin Anda.',
    icon: Compass,
    href: '/learn/authority',
    comingSoon: true,
  },
];

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pelajari <span className="text-gradient-fire">Human Design</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jelajahi artikel dan panduan mendalam tentang Human Design untuk memahami diri Anda lebih baik.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {learnCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.title}
                  className="glass-card rounded-xl p-6 hover:border-accent/50 transition-all duration-300 group relative"
                >
                  {category.comingSoon && (
                    <span className="absolute top-4 right-4 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description}
                      </p>
                      <span className="text-accent text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Pelajari lebih lanjut
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Belum tahu Human Design Anda?
            </h2>
            <p className="text-muted-foreground mb-6">
              Dapatkan chart Human Design gratis Anda sekarang dan mulai perjalanan penemuan diri.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors fire-glow"
            >
              Get Your Free Chart
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Learn;
