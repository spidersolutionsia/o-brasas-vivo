import { Building2 } from 'lucide-react';

const WHATSAPP_NUMBER = '5521999999999'; // Replace with actual number

const partners = [
  { name: 'Serra Azul' },
  { name: 'Superthal' },
  { name: 'Jacutinga' },
  { name: 'RD Boutique' },
  { name: 'Diamante Negro' },
];

const PrivateLabelSection = () => {
  const handleContact = () => {
    const message = encodeURIComponent(
      'Olá! Tenho interesse em produzir minha própria marca de carvão com a Carvão Mascate. Gostaria de saber mais sobre o serviço de private label.'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="parceiros" className="py-20 md:py-32 relative overflow-hidden">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="section-title mb-4">
            Sua Marca com <span className="section-title-accent">Nossa Qualidade</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Produzimos e embalamos para grandes marcas da região. 
            Seja nosso parceiro e tenha carvão premium com a sua identidade.
          </p>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="card-dark rounded-lg p-6 flex flex-col items-center justify-center aspect-square hover:border-primary/50 transition-colors"
              >
                <Building2 className="w-8 h-8 text-muted-foreground mb-3" />
                <span className="font-heading text-sm uppercase tracking-wider text-muted-foreground text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleContact}
            className="btn-fire rounded-lg text-lg"
          >
            Produza sua marca com a gente
          </button>
        </div>
      </div>
    </section>
  );
};

export default PrivateLabelSection;
