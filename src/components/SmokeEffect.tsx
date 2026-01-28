import { useEffect, useState } from 'react';

interface SmokeParticle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const SmokeEffect = () => {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);

  useEffect(() => {
    const newParticles: SmokeParticle[] = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        size: 100 + Math.random() * 200,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="smoke-layer">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="smoke-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SmokeEffect;
