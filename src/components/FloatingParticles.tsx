import { useEffect, useState, memo } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface GlowOrb {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

export const FloatingParticles = memo(() => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glowOrbs, setGlowOrbs] = useState<GlowOrb[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 20,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);

    // Generate glow orbs
    const newGlowOrbs: GlowOrb[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      size: 100 + Math.random() * 200,
      delay: Math.random() * 4,
    }));
    setGlowOrbs(newGlowOrbs);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glow orbs */}
      {glowOrbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className="glow-orb"
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="particle"
          style={{
            left: `${particle.left}%`,
            bottom: '-10px',
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

FloatingParticles.displayName = 'FloatingParticles';
