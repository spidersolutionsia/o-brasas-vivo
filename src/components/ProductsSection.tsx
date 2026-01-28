import { Check, Flame, TreePine, Sparkles } from 'lucide-react';
import productBag from '@/assets/product-bag-5kg.jpg';

const benefits = [
  { icon: Flame, text: 'Alta durabilidade' },
  { icon: TreePine, text: 'Eucalipto selecionado' },
  { icon: Sparkles, text: 'Sem pó' },
];

const products = [
  {
    name: 'Saco 2,5kg',
    description: 'Ideal para churrascos pequenos e do dia a dia.',
    weight: '2,5kg',
  },
  {
    name: 'Saco 5kg',
    description: 'Perfeito para reuniões familiares e churrascos completos.',
    weight: '5kg',
    featured: true,
  },
];

const ProductsSection = () => {
  return (
    <section id="produtos" className="py-20 md:py-32 bg-card relative">
      {/* Fire Divider at Top */}
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
            <div
              key={index}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-heading text-lg uppercase tracking-wide">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className={`card-dark rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                product.featured ? 'fire-glow' : ''
              }`}
            >
              {/* Product Image */}
              <div className="aspect-square bg-background flex items-center justify-center p-8">
                <img
                  src={productBag}
                  alt={product.name}
                  className="max-h-full w-auto object-contain float-animation"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-2xl font-bold uppercase">
                    {product.name}
                  </h3>
                  <span className="text-primary font-heading text-xl font-bold">
                    {product.weight}
                  </span>
                </div>
                <p className="text-muted-foreground">{product.description}</p>

                {/* Benefits Check */}
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
    </section>
  );
};

export default ProductsSection;
