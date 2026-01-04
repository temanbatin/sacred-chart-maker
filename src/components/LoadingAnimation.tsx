import { useEffect, useState } from 'react';

const loadingMessages = [
  'Membaca bintang-bintang untukmu...',
  'Menghitung posisi planet saat kelahiranmu...',
  'Mengungkap gerbang energi yang aktif...',
  'Menyusun cetak biru kosmikmu...',
  'Hampir selesai...',
];

export const LoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center">
        {/* Mandala spinner */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-mandala" />
          
          {/* Middle ring */}
          <div 
            className="absolute inset-4 border-4 border-accent/40 rounded-full"
            style={{ animation: 'mandala-spin 15s linear infinite reverse' }}
          />
          
          {/* Inner ring */}
          <div className="absolute inset-8 border-4 border-primary/50 rounded-full animate-mandala" />
          
          {/* Center glow */}
          <div className="absolute inset-10 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse" />
          
          {/* Decorative dots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-60px) translateX(-50%)`,
                animation: `glow-pulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>

        {/* Loading message */}
        <p className="text-xl text-foreground font-medium animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
        
        <p className="text-sm text-muted-foreground mt-4">
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};
