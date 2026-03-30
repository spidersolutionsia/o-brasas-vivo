import { Check, Flame, TreePine, Sparkles } from 'lucide-react';
import productBag from '@/assets/product-bag-5kg.jpg';
import productDiamante2kg from '@/assets/product-diamante-2kg.png';
import productDiamante4kg from '@/assets/product-diamante-4kg.png';
import productMascate9kg from '@/assets/product-mascate-9kg.png';
import productMascate25kg from '@/assets/product-mascate-2.5kg.png';

const benefits = [
  { icon: Flame, text: 'Alta durabilidade' },
  { icon: TreePine, text: 'Eucalipto selecionado' },
  { icon: Sparkles, text: 'Sem pó' },
];

interface ProductItem {
  name: string;
  description: string;
  weight: string;
  price: number;
  featured?: boolean;
  image: string;
}

interface BrandGroup {
  brand: string;
  products: ProductItem[];
}

const brandGroups: BrandGroup[] = [
  {
    brand: 'Carvão Mascate',
    products: [
      {
        name: 'Saco 2,5kg',
        description: 'Ideal para churrascos pequenos e do dia a dia.',
        weight: '2,5kg',
        price: 12.00,
        image: productMascate25kg,
      },
      {
        name: 'Saco 5kg',
        description: 'Perfeito para reuniões familiares e churrascos completos.',
        weight: '5kg',
        price: 19.00,
        featured: true,
        image: productBag,
      },
      {
        name: 'Saco 9kg',
        description: 'Para grandes eventos e quem quer garantir estoque.',
        weight: '9kg',
        price: 43.00,
        image: productMascate9kg,
      },
    ],
  },
  {
    brand: 'Diamante Negro',
    products: [
      {
        name: 'Saco 2kg',
        description: 'Compacto e prático para churrascos rápidos.',
        weight: '2kg',
        price: 9.00,
        image: productDiamante2kg,
      },
      {
        name: 'Saco 4kg',
        description: 'Tamanho ideal para reuniões e churrascos em família.',
        weight: '4kg',
        price: 15.20,
        featured: true,
        image: productDiamante4kg,
      },
    ],
  },
];

const ProductsSection = () => {
  return (
    <section id="produtos" className="py-20 md:py-32 bg-card relative">
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            Nossos <span className="section-title-accent">Produtos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carvão premium para quem não abre mão da qualidade.
          </p>
        </div>

        {/* Benefits Row */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-heading text-lg uppercase tracking-wide">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Brand Groups */}
        {brandGroups.map((group) => (
          <div key={group.brand} className="mb-16 last:mb-0">
            {/* Brand Badge */}
            <div className="flex items-center gap-3 mb-8">
              <span className={`text-sm font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-full ${
                group.brand === 'Carvão Mascate'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-secondary/20 text-secondary-foreground'
              }`}>
                {group.brand}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-3">
              {group.products.map((product, index) => (
                <div
                  key={index}
                  className={`card-dark rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                    product.featured ? 'fire-glow' : ''
                  }`}
                >
                  <div className="aspect-[4/5] bg-black relative flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={`${group.brand} ${product.name}`}
                      className="w-full h-full object-cover float-animation"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-2xl font-bold uppercase">
                        {product.name}
                      </h3>
                      <span className="text-primary font-heading text-xl font-bold">
                        {product.weight}
                      </span>
                    </div>
                    <p className="text-primary font-heading text-2xl font-bold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-muted-foreground mt-1">{product.description}</p>
                    <div className="mt-4 space-y-2">
                      {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {benefit.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
