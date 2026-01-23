import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WhatsAppFloatingButton = ({ className }: { className?: string }) => {
    const whatsappNumber = '6285156403606'; // Assuming this is correct based on general project context
    const message = 'Halo Teman Batin, saya ingin bertanya tentang Human Design Report...';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-24 right-6 z-40 group flex flex-col items-center gap-2 animate-fade-in",
                className
            )}
            aria-label="Hubungi WhatsApp"
        >
            {/* Tooltip-style label */}
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-emerald-900 px-3 py-1 rounded-full shadow-md border border-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Butuh Bantuan?
            </span>

            {/* Main button */}
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />

                {/* The icon container */}
                <div className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-active:scale-95 border-2 border-white/20">
                    <MessageCircle className="w-7 h-7 fill-white/10" strokeWidth={2.5} />
                </div>

                {/* Online indicator */}
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full translate-x-1/4 -translate-y-1/4" />
            </div>
        </a>
    );
};
