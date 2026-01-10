import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { FileText, Users, Heart, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const products = [
  {
    id: 'full-report',
    title: 'Full Personalized Report',
    description: 'Laporan komprehensif 100+ halaman tentang Human Design Anda',
    price: 'Rp 199.000',
    icon: FileText,
    featured: true,
    href: '/reports',
  },
  {
    id: 'relationship-report',
    title: 'Relationship Compatibility Report',
    description: 'Analisis kecocokan hubungan berdasarkan Human Design dua orang',
    price: 'Rp 399.000',
    icon: Heart,
    comingSoon: true,
    href: '#',
  },
  {
    id: 'career-guide',
    title: 'Career & Business Guide',
    description: 'Panduan karir dan bisnis berdasarkan desain unik Anda',
    price: 'Rp 249.000',
    icon: Briefcase,
    comingSoon: true,
    href: '#',
  },
  {
    id: 'parenting-guide',
    title: 'Parenting by Design',
    description: 'Panduan memahami dan mendukung anak sesuai Human Design mereka',
    price: 'Rp 349.000',
    icon: Users,
    comingSoon: true,
    href: '#',
  },
];

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Digital <span className="text-gradient-fire">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Produk digital untuk membantu Anda memahami dan menerapkan Human Design dalam kehidupan sehari-hari.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className={`glass-card rounded-xl p-6 relative transition-all duration-300 hover:border-accent/50 ${product.featured ? 'ring-2 ring-primary/50' : ''
                    }`}
                >
                  {product.featured && (
                    <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
                      Best Seller
                    </span>
                  )}
                  {product.comingSoon && (
                    <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-foreground">
                      {product.price}
                    </span>
                    {product.comingSoon ? (
                      <Button variant="outline" disabled>
                        Segera Hadir
                      </Button>
                    ) : (
                      <Button asChild className="fire-glow">
                        <Link to={product.href}>
                          Lihat Detail
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Belum yakin produk mana yang cocok?
            </h2>
            <p className="text-muted-foreground mb-6">
              Mulai dengan chart gratis untuk mengetahui tipe Human Design Anda.
            </p>
            <Button size="lg" className="fire-glow" asChild>
              <Link to="/">
                Buat Chart Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
