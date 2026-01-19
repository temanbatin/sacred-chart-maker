import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Terima kasih! Kamu akan menerima insight Human Design eksklusif.', {
      duration: 5000
    });
    setEmail('');
    setIsSubmitting(false);
  };
  return <section className="py-20 px-4 bg-secondary/30">
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-accent" />
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-fire">
        Bergabunglah dengan 230 orang yang sudah membaca desain tubuh, jiwa dan pikiran mereka.
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        Dapatkan panduan eksklusif, tips menjalani hidup sesuai desainmu, dan insight
        Human Design langsung ke inbox-mu
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input type="email" placeholder="Masukkan emailmu" value={email} onChange={e => setEmail(e.target.value)} className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10" required />
        </div>
        <Button type="submit" disabled={isSubmitting} className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl font-semibold">
          <Sparkles className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Mendaftar...' : 'Daftar'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4">
        Kami menghormati privasimu. Kamu bisa berhenti berlangganan kapan saja.
      </p>
    </div>
  </section>;
};