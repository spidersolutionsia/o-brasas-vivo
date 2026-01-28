import { useEffect, useState } from 'react';

interface Flame {
  id: number;
  left: number;
  width: number;
  height: number;
  delay: number;
  duration: number;
}

interface Ember {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const FlameEffect = () => {
  const [flames, setFlames] = useState<Flame[]>([]);
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // Generate flames
    const newFlames: Flame[] = [];
    for (let i = 0; i < 20; i++) {
      newFlames.push({
        id: i,
        left: Math.random() * 100,
        width: 30 + Math.random() * 60,
        height: 80 + Math.random() * 120,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.6,
      });
    }
    setFlames(newFlames);

    // Generate embers
    const newEmbers: Ember[] = [];
    for (let i = 0; i < 30; i++) {
      newEmbers.push({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
      });
    }
    setEmbers(newEmbers);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden">
      {/* Base glow */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, hsl(var(--fire-orange) / 0.4), hsl(var(--fire-red) / 0.2), transparent)',
        }}
      />
      
      {/* Flames */}
      {flames.map((flame) => (
        <div
          key={flame.id}
          className="flame-particle"
          style={{
            left: `${flame.left}%`,
            width: `${flame.width}px`,
            height: `${flame.height}px`,
            animationDelay: `${flame.delay}s`,
            animationDuration: `${flame.duration}s`,
          }}
        />
      ))}

      {/* Embers rising */}
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="ember-particle"
          style={{
            left: `${ember.left}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animationDelay: `${ember.delay}s`,
            animationDuration: `${ember.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FlameEffect;
