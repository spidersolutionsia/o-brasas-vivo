import { useEffect, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const SparkParticles = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    // Generate initial sparks
    const generateSparks = () => {
      const newSparks: Spark[] = [];
      const sparkCount = 15; // Subtle amount

      for (let i = 0; i < sparkCount; i++) {
        newSparks.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 8 + 6, // 6-14 seconds
          delay: Math.random() * 10, // Random start delay
        });
      }
      setSparks(newSparks);
    };

    generateSparks();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute rounded-full animate-float-spark"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            background: `radial-gradient(circle, hsl(var(--fire-yellow)) 0%, hsl(var(--fire-orange)) 50%, transparent 100%)`,
            boxShadow: `0 0 ${spark.size * 2}px hsl(var(--fire-orange) / 0.6)`,
            animationDuration: `${spark.duration}s`,
            animationDelay: `${spark.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
};

export default SparkParticles;
