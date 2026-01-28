import { MapPin } from 'lucide-react';

const locations = [
  { city: 'Duas Barras', state: 'RJ', type: 'Fábrica' },
  { city: 'Nova Friburgo', state: 'RJ', type: 'Varejo' },
  { city: 'Cantagalo', state: 'RJ', type: 'Varejo' },
  { city: 'Cordeiro', state: 'RJ', type: 'Varejo' },
  { city: 'Bom Jardim', state: 'RJ', type: 'Varejo' },
  { city: 'Teresópolis', state: 'RJ', type: 'Varejo' },
  { city: 'Petrópolis', state: 'RJ', type: 'Varejo' },
  { city: 'Rio de Janeiro', state: 'RJ', type: 'Distribuição' },
];

const StoreLocatorSection = () => {
  return (
    <section id="encontre" className="py-20 md:py-32 relative overflow-hidden">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">
            Encontre o <span className="section-title-accent">Mascate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira onde encontrar nosso carvão premium na região.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={index}
              className="card-dark rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
            >
              <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
              <h3 className="font-heading text-lg font-bold uppercase">
                {location.city}
              </h3>
              <p className="text-sm text-muted-foreground">{location.state}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded uppercase tracking-wider">
                {location.type}
              </span>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card-dark rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
              <p className="text-muted-foreground text-lg">
                Região Serrana do Rio de Janeiro
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                Atendemos toda a região com entrega rápida
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorSection;
