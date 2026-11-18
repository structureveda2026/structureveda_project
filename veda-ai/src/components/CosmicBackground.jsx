import { useMemo } from 'react';

const CosmicBackground = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 3,
        opacity: Math.random() * 0.5 + 0.3,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-vedabg">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070512] via-[#05040B] to-[#0a0618]" />

      {/* Purple nebula glow - top left */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple/30 blur-[120px] animate-glowPulse" />

      {/* Navy/blue nebula - right */}
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-blue-900/40 blur-[130px] animate-glowPulse [animation-delay:2s]" />

      {/* Pink/violet accent - bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-fuchsia-900/25 blur-[140px] animate-glowPulse [animation-delay:4s]" />

      {/* Subtle gold accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gold/10 blur-[100px]" />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 4px rgba(255,255,255,0.8)',
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;
