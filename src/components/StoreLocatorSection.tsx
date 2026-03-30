import { MapPin, Store, ChevronDown, Instagram, Navigation } from 'lucide-react';
import { useState } from 'react';

interface StoreEntry {
  name: string;
  instagram?: string;
  maps?: string;
}

type StoreItem = string | StoreEntry;

interface CityLocation {
  city: string;
  state: string;
  type: string;
  stores: StoreItem[];
}

const storesByCity: CityLocation[] = [
  { city: 'Bom Jardim', state: 'RJ', type: 'Varejo', stores: [{ name: 'Parada Do Frango', instagram: 'https://www.instagram.com/frangonabrasabj/', maps: 'https://maps.app.goo.gl/VPdRuDejw1tzK4gG6' }, { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/uvt7FvHfGjo6LQGN8' }, 'Tem De Tudo', { name: 'Mercadinho Do Trevo', instagram: 'https://www.instagram.com/mercadinho_trevo/', maps: 'https://maps.app.goo.gl/ewJQYFpDEBmk9p537' }, 'Cantinho Do Pão', 'Açougue Bom Jardim', 'Aline Bar', 'Beer House', 'Padaria Nonna Carmela'] },
  { city: 'Cantagalo', state: 'RJ', type: 'Varejo', stores: ['Mercado Machadinho', { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/i3xvwWiNzGyB5HXt7' }] },
  { city: 'Cordeiro', state: 'RJ', type: 'Varejo', stores: ['Mercado Machadinho', { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/Q9H5gNAqBzeU82k6A' }] },
  { city: 'Duas Barras', state: 'RJ', type: 'Fábrica', stores: ['Depósito Beerbarrense', 'Açougue Nossa Senhora Dua Barras', 'Alea', 'Açougue e Mercado Castelo', 'Superthal'] },
  { city: 'Nova Friburgo', state: 'RJ', type: 'Varejo', stores: ['Mercado Armazém Da Serra', 'Shopping Amigos', 'Mercado Águia Da Serra', 'Boteco Curuzu', 'Villa Drinks', 'Brew', 'Sante Depósito', 'Lider Serrano', 'Santè Depósito Bebidas', 'Natan Depósito Do Zazá', 'Emporio Serrano Friburgo', 'Emporio Beer', 'Sorveteria Cesa', 'Casa De Carnes Amorim', 'Botique Das Carnes', 'Mercado Do Lucas', 'Açougue Do Jean', 'Mercado União', 'Lj Bebidas', 'AGROFRUTI', 'Colibri Bebidas', 'Arthur Ribeiro', 'Wendel Hortifruti', 'Gabriel Mercado Gb', 'Frotté', 'Pec Beer', 'Das Carnes', 'Açougue Adj', 'General Das Carnes', 'Clube Da Cevada'] },
  { city: 'Sumidouro', state: 'RJ', type: 'Varejo', stores: ['Mercado Pimpolho', 'Mercado Frio Ramos', 'JF Carnes', 'Mercado São Caetano', 'Mercado Betinho', 'Quintal Do B'] },
  { city: 'Teresópolis', state: 'RJ', type: 'Varejo', stores: ['Padaria Da Serra', 'Mercado Chc Dona Marianna', 'Jm Mercado', 'Mt Fruti', 'Ki Carnes', 'Santa Rosa', 'Cia Das Carnes', 'Mercado Mv Da Rosa', 'Casa Da Carne', 'Depósito De Bebida Pai E Filho', 'Mcc Filhos'] },
];

const getStoreName = (store: StoreItem): string =>
  typeof store === 'string' ? store : store.name;

const StoreLocatorSection = () => {
  const [openCity, setOpenCity] = useState<string | null>(null);

  const toggle = (city: string) => {
    setOpenCity(prev => (prev === city ? null : city));
  };

  return (
    <section id="encontre" className="py-20 md:py-32 relative overflow-hidden">
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">
            Encontre o <span className="section-title-accent">Mascate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira onde encontrar nosso carvão premium na região.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {storesByCity.map((location) => {
            const isOpen = openCity === location.city;
            return (
              <div key={location.city} className="card-dark rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(location.city)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary/5 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <h3 className="font-heading text-lg font-bold uppercase flex-1">
                    {location.city}
                  </h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded uppercase tracking-wider">
                    {location.type}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1 pl-12">
                      {location.stores.length > 0 ? (
                        <ul className="space-y-1.5">
                          {location.stores.map((store, i) => {
                            const name = getStoreName(store);
                            const entry = typeof store === 'object' ? store : null;
                            return (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Store className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                                <span>{name}</span>
                                {entry?.instagram && (
                                  <a
                                    href={entry.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    title="Instagram"
                                  >
                                    <Instagram className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {entry?.maps && (
                                  <a
                                    href={entry.maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                                    title="Como Chegar"
                                  >
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span>Como chegar</span>
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground/50 italic">
                          Em breve pontos de venda
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card-dark rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
              <p className="text-muted-foreground text-lg">Região Serrana do Rio de Janeiro</p>
              <p className="text-sm text-muted-foreground/60 mt-2">Atendemos toda a região com entrega rápida</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorSection;
