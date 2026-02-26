import { Minus, Plus, ArrowRight } from 'lucide-react';

export interface Product {
  id: string;
  brand: string;
  name: string;
  weight: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const products: Product[] = [
  { id: 'mascate-2.5kg', brand: 'Carvão Mascate', name: 'Saco de Carvão', weight: '2,5kg' },
  { id: 'mascate-5kg', brand: 'Carvão Mascate', name: 'Saco de Carvão', weight: '5kg' },
  { id: 'mascate-9kg', brand: 'Carvão Mascate', name: 'Saco de Carvão', weight: '9kg' },
  { id: 'diamante-2kg', brand: 'Diamante Negro', name: 'Saco de Carvão', weight: '2kg' },
  { id: 'diamante-4kg', brand: 'Diamante Negro', name: 'Saco de Carvão', weight: '4kg' },
];

const brands = ['Carvão Mascate', 'Diamante Negro'] as const;

interface Props {
  quantities: Record<string, number>;
  onUpdateQuantity: (id: string, delta: number) => void;
  onNext: () => void;
}

const StepProducts = ({ quantities, onUpdateQuantity, onNext }: Props) => {
  const totalItems = Object.values(quantities).reduce((s, q) => s + q, 0);

  return (
    <div className="space-y-8">
      {brands.map((brand) => (
        <div key={brand}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              brand === 'Carvão Mascate' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-secondary/20 text-secondary-foreground'
            }`}>
              {brand}
            </span>
          </div>
          <div className="space-y-3">
            {products
              .filter((p) => p.brand === brand)
              .map((product) => (
                <div
                  key={product.id}
                  className="card-dark rounded-xl p-5 flex items-center justify-between transition-all"
                >
                  <div>
                    <h3 className="font-heading text-lg font-bold uppercase">{product.name}</h3>
                    <p className="text-primary font-bold text-lg">{product.weight}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-heading text-2xl font-bold w-10 text-center">
                      {quantities[product.id] || 0}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="card-dark rounded-xl p-5 flex items-center justify-between">
        <span className="text-muted-foreground">Total de itens:</span>
        <span className="font-heading font-bold text-2xl text-primary">{totalItems} sacos</span>
      </div>

      <button
        onClick={onNext}
        disabled={totalItems === 0}
        className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default StepProducts;
export { products };
