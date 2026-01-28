import SmokeEffect from './SmokeEffect';
import heroVideo from '@/assets/hero-video.mp4';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          e.currentTarget.play();
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      {/* Smoke Effect */}
      <SmokeEffect />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-6 text-fire-glow">
          Mais brasa,{' '}
          <span className="text-primary">menos fumaça!</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
          O carvão premium que garante alta performance para o seu churrasco.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#atacado"
            className="btn-fire text-lg rounded-lg w-full sm:w-auto"
          >
            Comprar no Atacado
          </a>
          <a
            href="#encontre"
            className="btn-outline-fire text-lg rounded-lg w-full sm:w-auto"
          >
            Onde Encontrar
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
