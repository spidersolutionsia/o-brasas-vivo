const LiveEmber = () => {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      {/* Ember bed background */}
      <div className="absolute inset-0 bg-gradient-to-t from-coal-black via-coal-black/80 to-transparent" />
      
      {/* Animated embers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-2xl h-24">
          {/* Main ember glow - larger and brighter */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-20 rounded-full bg-fire-orange/70 blur-2xl animate-ember-pulse" />
          
          {/* Secondary ember glows - more visible */}
          <div className="absolute bottom-4 left-1/4 w-48 h-14 rounded-full bg-fire-red/60 blur-xl animate-ember-pulse-slow" />
          <div className="absolute bottom-4 right-1/4 w-48 h-14 rounded-full bg-fire-red/60 blur-xl animate-ember-pulse-delayed" />
          
          {/* Hot spots - brighter */}
          <div className="absolute bottom-6 left-1/3 w-12 h-6 rounded-full bg-fire-orange/80 blur-lg animate-ember-flicker" />
          <div className="absolute bottom-8 left-1/2 w-10 h-5 rounded-full bg-fire-yellow/70 blur-md animate-ember-flicker-fast" />
          <div className="absolute bottom-6 right-1/3 w-14 h-7 rounded-full bg-fire-orange/70 blur-lg animate-ember-flicker-delayed" />
          <div className="absolute bottom-10 left-[45%] w-8 h-4 rounded-full bg-fire-yellow/80 blur-md animate-ember-flicker" />
          
          {/* Tiny sparks - more visible */}
          <div className="absolute bottom-12 left-[40%] w-2 h-2 rounded-full bg-fire-yellow animate-spark" />
          <div className="absolute bottom-14 left-[55%] w-2 h-2 rounded-full bg-fire-orange animate-spark-delayed" />
          <div className="absolute bottom-10 left-[48%] w-1.5 h-1.5 rounded-full bg-fire-yellow animate-spark-slow" />
          <div className="absolute bottom-16 left-[52%] w-1.5 h-1.5 rounded-full bg-primary animate-spark" />
        </div>
      </div>
      
      {/* Charcoal pieces silhouette */}
      <svg 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-12 opacity-90" 
        viewBox="0 0 400 48"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
      >
        <ellipse cx="40" cy="42" rx="30" ry="10" className="fill-coal-black" />
        <ellipse cx="100" cy="38" rx="35" ry="12" className="fill-background" />
        <ellipse cx="160" cy="42" rx="40" ry="11" className="fill-coal-black" />
        <ellipse cx="230" cy="40" rx="38" ry="12" className="fill-background" />
        <ellipse cx="300" cy="43" rx="35" ry="10" className="fill-coal-black" />
        <ellipse cx="360" cy="40" rx="30" ry="11" className="fill-background" />
      </svg>
    </div>
  );
};

export default LiveEmber;
