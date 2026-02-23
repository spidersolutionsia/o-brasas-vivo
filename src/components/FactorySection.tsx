import { MapPin, Phone, Calendar, Quote, Navigation } from 'lucide-react';
import founderImage from '@/assets/founder.jpg';

const WHATSAPP_NUMBER = '5522992525529';

const FactorySection = () => {
  const handleScheduleVisit = () => {
    const message = encodeURIComponent(
      'Olá! Vim pelo site e gostaria de agendar um tour pra conhecer a fábrica!'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="fabrica" className="py-20 md:py-32 relative overflow-hidden">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        {/* Factory Info */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
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

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleScheduleVisit}
                className="btn-fire rounded-lg inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Agendar Visita
              </button>
              <a
                href="https://www.google.com/maps/dir//Carv%C3%A3o+Mascate,+WCFH%2BM6C+-+Vargem+Grande,+Duas+Barras+-+RJ,+28650-000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary font-heading uppercase tracking-wider hover:bg-primary/10 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                Como Chegar
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden card-dark fire-glow">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d14767.551161926964!2d-42.5394176!3d-22.282239999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x6aafb888a29409b5%3A0x9cca2c6e40e99f8a!2sCarv%C3%A3o%20Mascate%2C%20WCFH%2BM6C%20-%20Vargem%20Grande%2C%20Duas%20Barras%20-%20RJ%2C%2028650-000!3m2!1d-22.075812499999998!2d-42.5719375!5e0!3m2!1spt-BR!2sbr!4v1769613411555!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Carvão Mascate"
                className="w-full h-full"
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Founder Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-16 border-t border-border/30">
          {/* Founder Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden fire-glow">
                <img 
                  src={founderImage} 
                  alt="Matheus Mascate - Fundador do Carvão Mascate"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Name Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-right-4 bg-card border border-primary/30 rounded-xl px-6 py-3 shadow-xl">
                <p className="text-lg font-bold text-foreground">Matheus Mascate</p>
                <p className="text-sm text-primary">Fundador</p>
              </div>
              {/* Decorative Element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Founder Story */}
          <div className="order-1 lg:order-2 fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <Quote className="w-10 h-10 text-primary/60" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Um sonho que não cabia no porta-malas
              </h3>
            </div>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A história do Carvão Mascate começou com um motivo nobre: a chegada de uma filha 
                e a vontade de um pai de oferecer um futuro melhor. Sem grandes recursos, mas com 
                muita coragem, começamos com apenas dois fornos, um "Golzinho" quadrado emprestado 
                e uma carretinha financiada num cheque de 30 dias.
              </p>
              
              <p>
                Naquela época, cada venda era uma batalha contra o relógio. Lembro-me de olhar para 
                os caminhões dos grandes concorrentes descarregando nas redes de supermercados e 
                pensar: <em className="text-foreground">"Um dia, seremos nós ali"</em>.
              </p>
              
              <p>
                Aquele desejo virou combustível. Em apenas 15 dias, aquele mesmo Golzinho já estava 
                abastecendo grandes redes da região. O que nos fez crescer não foi sorte, foi compromisso. 
                Sabemos o valor da palavra dada e do prazo cumprido.
              </p>
              
              <p>
                Hoje, aquela carretinha deu lugar a uma frota própria e a uma estrutura industrial que 
                atende de 8 a 9 cidades na Região Serrana. Produzimos não só a nossa marca, mas somos 
                a fábrica de confiança de grandes nomes do mercado.
              </p>
              
              <p className="text-foreground font-medium">
                Crescemos, mas a essência continua a mesma: trabalho duro, honestidade e a garantia de 
                que, faça chuva ou faça sol, o seu pedido vai chegar.
              </p>
            </div>

            <p className="mt-8 text-xl font-bold text-primary italic">
              Carvão Mascate. Mais brasa, menos fumaça e muita história.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FactorySection;
