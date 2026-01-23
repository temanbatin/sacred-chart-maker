import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { BookOpen, ArrowRight, Clock, ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LEARN_ARTICLES, Article } from '@/config/learn-content';
import { useEffect } from 'react';

const Learn = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Article Detail View
  if (slug) {
    const article = LEARN_ARTICLES.find((a) => a.slug === slug);

    if (!article) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <Button onClick={() => navigate('/learn')}>Kembali ke Menu Belajar</Button>
        </div>
      );
    }

    // Simple Markdown Renderer
    const renderContent = (content: string) => {
      return content.split('\n').map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.replace('#### ', '')}</h4>;
        }

        // List items
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          // Handle bolding in list items
          const text = line.trim().substring(2);
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return (
            <li key={index} className="ml-4 list-disc text-muted-foreground mb-2 pl-2">
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </li>
          );
        }

        // Ordered list (simple detection)
        if (/^\d+\.\s/.test(line.trim())) {
          const text = line.trim().replace(/^\d+\.\s/, '');
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={index} className="flex gap-2 mb-2 text-muted-foreground ml-1">
              <span className="font-bold text-accent min-w-[20px]">{line.trim().match(/^\d+\./)?.[0]}</span>
              <p>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="text-foreground">{part.slice(1, -1)}</em>;
                  }
                  return part;
                })}
              </p>
            </div>
          );
        }

        // Paragraphs with Bold/Italic support
        if (line.trim().length > 0) {
          const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          return (
            <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-lg">
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                  return <em key={i} className="italic text-foreground">{part.slice(1, -1)}</em>;
                }
                return part;
              })}
            </p>
          );
        }

        return null;
      });
    };

    return (
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/learn')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Kembali ke Menu Belajar
            </Button>

            <article className="animate-fade-up">
              {article.imageUrl && (
                <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="mb-8">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase bg-accent/10 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4 leading-tight">
                  {article.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} Baca</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                {renderContent(article.content)}
              </div>

              {/* CTA at end of article */}
              <div className="mt-16 bg-secondary/30 p-8 rounded-2xl border border-border text-center">
                <h3 className="text-xl font-bold mb-2">Ingin tahu desain unikmu?</h3>
                <p className="text-muted-foreground mb-6">Dapatkan peta personal Human Design-mu sekarang.</p>
                <Button onClick={() => navigate('/')} className="fire-glow">
                  Buat Chart Gratis
                </Button>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Listing View
  const handleGetChart = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('calculator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pelajari <span className="text-gradient-fire">Human Design</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Panduan praktis untuk memahami dirimu, memvalidasi perasaanmu, dan menemukan jalan hidup yang lebih mengalir.
            </p>
          </div>

          {/* Featured/Latest Article (First one) */}
          {LEARN_ARTICLES.length > 0 && (
            <div className="mb-12 glass-card rounded-2xl p-6 md:p-8 hover:border-accent/50 transition-all cursor-pointer group" onClick={() => navigate(`/learn/${LEARN_ARTICLES[0].slug}`)}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-accent text-black text-xs font-bold px-2 py-1 rounded">TERBARU</span>
                    <span className="text-accent text-sm font-medium">{LEARN_ARTICLES[0].category}</span>
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {LEARN_ARTICLES[0].readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors">
                    {LEARN_ARTICLES[0].title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {LEARN_ARTICLES[0].excerpt}
                  </p>
                  <span className="inline-flex items-center text-accent font-medium group-hover:translate-x-2 transition-transform">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {LEARN_ARTICLES.slice(1).map((article, idx) => (
              <div
                key={article.slug}
                onClick={() => navigate(`/learn/${article.slug}`)}
                className="glass-card rounded-xl p-0 overflow-hidden hover:border-accent/50 transition-all duration-300 group cursor-pointer flex flex-col items-start h-full"
              >
                {/* Thumbnail */}
                <div className="w-full h-48 overflow-hidden bg-secondary/20 relative">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-4 right-4 text-xs font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/10">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1 w-full">
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                    <span className="text-accent text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Belum tahu Human Design kamu?
            </h2>
            <p className="text-muted-foreground mb-6">
              Dapatkan chart Human Design gratis kamu sekarang dan mulai perjalanan penemuan diri.
            </p>
            <button
              onClick={handleGetChart}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors fire-glow"
            >
              Get Your Free Chart
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Learn;
