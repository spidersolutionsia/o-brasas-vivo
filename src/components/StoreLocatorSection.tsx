import { MapPin, Store } from 'lucide-react';

const storesByCity = [
  {
    city: 'Duas Barras',
    state: 'RJ',
    type: 'Fábrica',
    stores: [],
  },
  {
    city: 'Nova Friburgo',
    state: 'RJ',
    type: 'Varejo',
    stores: [
      'Charles Jaccoud',
      'Das Carnes',
      'Açougue Adj',
      'General Das Carnes',
      'Serra Azul',
      'Clube Da Cevada',
    ],
  },
  {
    city: 'Sumidouro',
    state: 'RJ',
    type: 'Varejo',
    stores: [
      'Mercado Pimpolho',
      'Mercado Frio Ramos',
      'JF Carnes',
      'Mercado São Caetano',
      'Mercado Betinho',
      'Quintal Do B',
    ],
  },
  {
    city: 'Teresópolis',
    state: 'RJ',
    type: 'Varejo',
    stores: [
      'Padaria Da Serra',
      'Mercado Chc Dona Marianna',
      'Jm Mercado',
      'Mt Fruti',
      'Ki Carnes',
      'Santa Rosa',
      'Cia Das Carnes',
      'Mercado Mv Da Rosa',
      'Casa Da Carne',
      'Depósito De Bebida Pai E Filho',
      'Mcc Filhos',
    ],
  },
  {
    city: 'Cantagalo',
    state: 'RJ',
    type: 'Varejo',
    stores: ['Superthal'],
  },
  {
    city: 'Cordeiro',
    state: 'RJ',
    type: 'Varejo',
    stores: ['Superthal'],
  },
  {
    city: 'Bom Jardim',
    state: 'RJ',
    type: 'Varejo',
    stores: [],
  },
  {
    city: 'Petrópolis',
    state: 'RJ',
    type: 'Varejo',
    stores: [],
  },
  {
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'Distribuição',
    stores: [],
  },
];

const StoreLocatorSection = () => {
  return (
    <section id="encontre" className="py-20 md:py-32 relative overflow-hidden">
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

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {storesByCity.map((location, index) => (
            <div
              key={index}
              className="card-dark rounded-lg p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 className="font-heading text-lg font-bold uppercase">
                  {location.city}
                </h3>
                <span className="ml-auto inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded uppercase tracking-wider">
                  {location.type}
                </span>
              </div>

              {location.stores.length > 0 ? (
                <ul className="space-y-1.5 pl-7">
                  {location.stores.map((store, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Store className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                      <span>{store}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground/50 pl-7 italic">
                  Em breve pontos de venda
                </p>
              )}
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
