const LiveFlame = () => {
  return (
    <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-10">
      {/* Flame glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fire-orange/30 via-fire-red/10 to-transparent" />
      
      {/* Animated flames */}
      <div className="absolute inset-0 flex items-start justify-center">
        <div className="relative w-full h-full">
          {/* Main flame glow */}
          <div className="absolute top-0 left-1/4 w-48 h-20 rounded-full bg-fire-orange/50 blur-2xl animate-flame-dance" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full bg-fire-yellow/40 blur-2xl animate-flame-dance-slow" />
          <div className="absolute top-0 right-1/4 w-48 h-20 rounded-full bg-fire-orange/50 blur-2xl animate-flame-dance-delayed" />
          
          {/* Secondary flame tongues */}
          <div className="absolute top-2 left-[20%] w-16 h-16 rounded-full bg-fire-red/60 blur-xl animate-flame-flicker" />
          <div className="absolute top-0 left-[35%] w-20 h-20 rounded-full bg-fire-orange/70 blur-xl animate-flame-flicker-fast" />
          <div className="absolute top-1 left-[50%] w-24 h-24 rounded-full bg-fire-yellow/50 blur-xl animate-flame-dance" />
          <div className="absolute top-0 left-[65%] w-20 h-20 rounded-full bg-fire-orange/70 blur-xl animate-flame-flicker-delayed" />
          <div className="absolute top-2 left-[80%] w-16 h-16 rounded-full bg-fire-red/60 blur-xl animate-flame-flicker" />
          
          {/* Hot core spots */}
          <div className="absolute top-4 left-[30%] w-8 h-8 rounded-full bg-fire-yellow/80 blur-md animate-flame-flicker-fast" />
          <div className="absolute top-3 left-[50%] w-10 h-10 rounded-full bg-fire-yellow/90 blur-md animate-flame-core" />
          <div className="absolute top-4 left-[70%] w-8 h-8 rounded-full bg-fire-yellow/80 blur-md animate-flame-flicker-fast" />
        </div>
      </div>
    </div>
  );
};

export default LiveFlame;
