import { MapPin, Phone, Calendar } from 'lucide-react';

const WHATSAPP_NUMBER = '5521999999999'; // Replace with actual number

const FactorySection = () => {
  const handleScheduleVisit = () => {
    const message = encodeURIComponent(
      'Olá! Gostaria de agendar uma visita à fábrica da Carvão Mascate.'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="fabrica" className="py-20 md:py-32 relative overflow-hidden">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="fade-in-up">
            <h2 className="section-title mb-6">
              A <span className="section-title-accent">Fábrica</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Em Duas Barras, no coração da região serrana do Rio de Janeiro, 
              produzimos carvão de eucalipto de altíssima qualidade. Nosso processo 
              garante um produto <strong className="text-foreground">limpo e granulado</strong>, 
              sem pó e com máxima durabilidade.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Cada saco de Carvão Mascate passa por rigoroso controle de qualidade, 
              garantindo que você tenha a melhor experiência em seu churrasco.
            </p>

            {/* Location Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Estrada Duas Barras-Murinele, S/N, Km8 - Zona Rural</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Atendimento via WhatsApp</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleScheduleVisit}
              className="btn-fire rounded-lg inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Agendar Visita
            </button>
          </div>

          {/* Image / Visual */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden card-dark fire-glow">
              <div className="w-full h-full bg-gradient-to-br from-muted to-card flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Duas Barras, RJ
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-2">
                    Região serrana do Rio de Janeiro
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactorySection;
