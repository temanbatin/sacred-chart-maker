import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WhatsAppFloatingButton = ({ className }: { className?: string }) => {
    const whatsappNumber = '6285739444131';
    const message = 'Halo Teman Batin, saya ingin bertanya tentang Human Design Report...';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-8 right-6 z-50 group flex flex-col items-center gap-2 animate-fade-in",
                className
            )}
            aria-label="Hubungi WhatsApp"
        >
            {/* Tooltip-style label */}
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[hsl(160_84%_5%)] px-3 py-1 rounded-full shadow-md border border-[hsl(160_40%_20%)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Butuh Bantuan?
            </span>

            {/* Main button */}
            <div className="relative">
                {/* Glow effect - using project's accent/primary tones */}
                <div className="absolute inset-0 bg-primary/50 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />

                {/* The icon container - Using Primary (Terracotta/Fire) to match branding */}
                <div className="relative w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-active:scale-95 border-2 border-white/20">
                    <MessageCircle className="w-6 h-6 fill-white/10" strokeWidth={2} />
                </div>

                {/* Online indicator */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4" />
            </div>
        </a>
    );
};
