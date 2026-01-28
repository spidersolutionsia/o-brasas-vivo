import { useState } from 'react';
import { Minus, Plus, ShoppingCart, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '5521999999999'; // Replace with actual number

interface Product {
  id: string;
  name: string;
  weight: string;
  minQuantity: number;
}

const products: Product[] = [
  { id: 'saco-2.5kg', name: 'Saco de Carvão', weight: '2,5kg', minQuantity: 20 },
  { id: 'saco-5kg', name: 'Saco de Carvão', weight: '5kg', minQuantity: 10 },
];

const WholesaleSection = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'saco-2.5kg': 0,
    'saco-5kg': 0,
  });

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + delta),
    }));
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSubmitOrder = () => {
    const orderItems = products
      .filter((p) => quantities[p.id] > 0)
      .map((p) => `• ${quantities[p.id]}x ${p.name} ${p.weight}`)
      .join('\n');

    if (!orderItems) {
      alert('Por favor, selecione pelo menos um produto.');
      return;
    }

    const message = encodeURIComponent(
      `*Pedido de Atacado - Carvão Mascate*\n\n${orderItems}\n\nOlá! Gostaria de fazer este pedido.`
    );
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="atacado" className="py-20 md:py-32 bg-card relative">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">
              Pedido de <span className="section-title-accent">Atacado</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Monte seu pedido e envie diretamente pelo WhatsApp.
            </p>
          </div>

          {/* Product Selector */}
          <div className="space-y-4 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-dark rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold">{product.weight}</p>
                  <p className="text-sm text-muted-foreground">
                    Mínimo: {product.minQuantity} unidades
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="font-heading text-2xl font-bold w-12 text-center">
                    {quantities[product.id]}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card-dark rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">Total de itens:</span>
              <span className="font-heading font-bold text-2xl text-primary">
                {getTotalItems()} sacos
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={getTotalItems() === 0}
            className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-6 h-6" />
            Finalizar Pedido via WhatsApp
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Você será redirecionado para o WhatsApp com os detalhes do pedido.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WholesaleSection;
