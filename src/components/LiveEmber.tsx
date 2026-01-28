const LiveEmber = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      {/* Ember bed background */}
      <div className="absolute inset-0 bg-gradient-to-t from-coal-black via-coal-black/50 to-transparent" />
      
      {/* Animated embers */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative w-full max-w-md h-16">
          {/* Main ember glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 rounded-full bg-fire-orange/60 blur-xl animate-ember-pulse" />
          
          {/* Secondary ember glow */}
          <div className="absolute bottom-2 left-1/4 w-32 h-8 rounded-full bg-fire-red/50 blur-lg animate-ember-pulse-slow" />
          <div className="absolute bottom-2 right-1/4 w-32 h-8 rounded-full bg-fire-red/50 blur-lg animate-ember-pulse-delayed" />
          
          {/* Hot spots */}
          <div className="absolute bottom-1 left-1/3 w-8 h-4 rounded-full bg-fire-orange/70 blur-md animate-ember-flicker" />
          <div className="absolute bottom-2 left-1/2 w-6 h-3 rounded-full bg-fire-yellow/60 blur-sm animate-ember-flicker-fast" />
          <div className="absolute bottom-1 right-1/3 w-10 h-5 rounded-full bg-fire-orange/60 blur-md animate-ember-flicker-delayed" />
          
          {/* Tiny sparks */}
          <div className="absolute bottom-4 left-[40%] w-1 h-1 rounded-full bg-fire-yellow animate-spark" />
          <div className="absolute bottom-6 left-[55%] w-1 h-1 rounded-full bg-fire-orange animate-spark-delayed" />
          <div className="absolute bottom-5 left-[45%] w-0.5 h-0.5 rounded-full bg-fire-yellow animate-spark-slow" />
        </div>
      </div>
      
      {/* Charcoal pieces silhouette */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-10 opacity-80" 
        viewBox="0 0 320 40"
        fill="none"
      >
        <ellipse cx="50" cy="35" rx="25" ry="8" className="fill-coal-black" />
        <ellipse cx="100" cy="32" rx="30" ry="10" className="fill-background" />
        <ellipse cx="160" cy="35" rx="35" ry="9" className="fill-coal-black" />
        <ellipse cx="220" cy="33" rx="28" ry="9" className="fill-background" />
        <ellipse cx="270" cy="36" rx="25" ry="7" className="fill-coal-black" />
      </svg>
    </div>
  );
};

export default LiveEmber;
