import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Gift, Mail, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ExitIntentPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown in this session
        const alreadyShown = sessionStorage.getItem('exitIntentShown');
        if (alreadyShown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger when mouse leaves from the top
            if (e.clientY <= 0 && !hasShown) {
                setIsOpen(true);
                setHasShown(true);
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        };

        // Add delay before enabling the exit intent
        const timer = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000); // Wait 5 seconds before enabling

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Masukkan email kamu');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to leads table
            const { error } = await supabase
                .from('leads')
                .insert({
                    email: email,
                    name: 'Exit Intent Lead',
                    whatsapp: '+6200000000000', // Placeholder
                });

            if (error) {
                // Might fail due to unique constraint, that's OK
                console.log('Lead save result:', error.message);
            }

            toast.success('Terima kasih! Panduan akan dikirim ke email kamu.');
            setIsOpen(false);
        } catch (err) {
            console.error('Error saving lead:', err);
            toast.success('Terima kasih! Panduan akan dikirim ke email kamu.');
            setIsOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Gift className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-2xl text-center text-gradient-fire">
                        Tunggu! 🎁
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        Dapatkan <span className="font-semibold text-foreground">Panduan Gratis</span> tentang cara menemukan jalan hidupmu dengan Human Design
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="Masukkan email kamu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 rounded-xl"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            'Kirim Panduan Gratis'
                        )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        Tidak ada spam. Kamu bisa unsubscribe kapan saja.
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
};
