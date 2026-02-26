import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';

const WholesaleSection = () => {
  return (
    <section id="atacado" className="py-20 md:py-32 bg-card relative">
      <div className="fire-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="section-title mb-4">
            Pedido de <span className="section-title-accent">Atacado</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Monte seu pedido online, escolha entre as marcas Carvão Mascate e Diamante Negro, e finalize diretamente pelo WhatsApp.
          </p>
          <Link
            to="/pedido"
            className="btn-fire rounded-lg text-lg inline-flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            Fazer Pedido
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WholesaleSection;
