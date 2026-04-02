import { MapPin, Store, ChevronDown, Instagram, Navigation } from 'lucide-react';
import { useState } from 'react';

interface StoreEntry {
  name: string;
  instagram?: string;
  maps?: string;
  whatsapp?: string;
}

type StoreItem = string | StoreEntry;

interface CityLocation {
  city: string;
  state: string;
  type: string;
  stores: StoreItem[];
}

const storesByCity: CityLocation[] = [
  { city: 'Bom Jardim', state: 'RJ', type: 'Varejo', stores: [
    { name: 'Açougue F3V', whatsapp: 'https://wa.me/5522981022191?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
    { name: 'Aline Bar' },
    { name: 'Beer House', instagram: 'https://www.instagram.com/beerhouse.bj/', maps: 'https://maps.app.goo.gl/E7m72qWjSWS7QzQW7' },
    { name: 'Cantinho Do Pão', instagram: 'https://www.instagram.com/cantinhodopaoofc/', maps: 'https://maps.app.goo.gl/QTKEueq5b73HpowR6' },
    { name: 'Mercadinho Do Trevo', instagram: 'https://www.instagram.com/mercadinho_trevo/', maps: 'https://maps.app.goo.gl/ewJQYFpDEBmk9p537' },
    { name: 'Mercearia e Açougue Santa Cruz' },
    { name: 'Mercearia Império', whatsapp: 'https://wa.me/5522988737520?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
    { name: 'Padaria Nonna Carmela', instagram: 'https://www.instagram.com/padarianonnacarmela/?hl=pt', maps: 'https://maps.app.goo.gl/WdthGvTrYnjwQm7c6' },
    { name: 'Parada Do Frango', instagram: 'https://www.instagram.com/frangonabrasabj/', maps: 'https://maps.app.goo.gl/VPdRuDejw1tzK4gG6' },
    { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/uvt7FvHfGjo6LQGN8' },
    { name: 'Tem De Tudo' },
    { name: 'Zé Rios Depósito' },
  ] },
  { city: 'Cantagalo', state: 'RJ', type: 'Varejo', stores: [
    { name: 'Distribuidora Canjiquinha' },
    { name: 'Galo Atacarejo' },
    { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/i3xvwWiNzGyB5HXt7' },
  ] },
  { city: 'Cordeiro', state: 'RJ', type: 'Varejo', stores: [{ name: 'Mercado Machadinho', instagram: 'https://www.instagram.com/supermercado.machadinho/', maps: 'https://maps.app.goo.gl/jHSGrs4ZGAMw5fcg6' }, { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/?hl=pt-br', maps: 'https://maps.app.goo.gl/Q9H5gNAqBzeU82k6A' }] },
  { city: 'Duas Barras', state: 'RJ', type: 'Fábrica / Varejo', stores: [
    { name: 'Açougue e Mercado Castelo', instagram: 'https://www.instagram.com/acougueemercadocastelo/', maps: 'https://maps.app.goo.gl/Cggq4FKjAShJ5YcF8', whatsapp: 'https://wa.me/5522992423683?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
    { name: 'Açougue Nossa Senhora Dua Barras', instagram: 'https://www.instagram.com/acouguedb/', maps: 'https://maps.app.goo.gl/BcFNbM4ZE1c3U2x39' },
    { name: 'Depósito Beerbarrense', instagram: 'https://www.instagram.com/deposito_beerbarrense/?hl=pt-br', maps: 'https://maps.app.goo.gl/iTLsgo98uWR7UqETA' },
    { name: 'Mercado Central', instagram: 'https://www.instagram.com/mercadocentralduasbarras/', maps: 'https://maps.app.goo.gl/67yHmngEqvVqJjoj9', whatsapp: 'https://wa.me/5522981188684?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
    { name: 'Mercado Central Monnerat', instagram: 'https://www.instagram.com/mercadocentralmn/', whatsapp: 'https://wa.me/5522992699487?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
    
    { name: 'Superthal', instagram: 'https://www.instagram.com/redesuperthal/', maps: 'https://maps.app.goo.gl/Kv2SmEQNbdU4EeYp6', whatsapp: 'https://wa.me/5522988260855?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Carv%C3%A3o%20Mascate%20e%20gostaria%20de%20saber%20quais%20tamanhos%20de%20saco%20tem%20dispon%C3%ADveis%3F' },
  ] },
  { city: 'Nova Friburgo', state: 'RJ', type: 'Varejo', stores: ['Açougue Adj', 'Açougue Do Jean', 'AGROFRUTI', 'Arthur Ribeiro', 'Boteco Curuzu', 'Botique Das Carnes', 'Brew', 'Casa De Carnes Amorim', 'Clube Da Cevada', 'Colibri Bebidas', 'Das Carnes', 'Emporio Beer', 'Emporio Serrano Friburgo', 'Frotté', 'Gabriel Mercado Gb', 'General Das Carnes', 'Lider Serrano', 'Lj Bebidas', 'Mercado Armazém Da Serra', 'Mercado Do Lucas', 'Mercado União', 'Mercado Águia Da Serra', 'Natan Depósito Do Zazá', 'Pec Beer', 'Sante Depósito', 'Santè Depósito Bebidas', 'Shopping Amigos', 'Sorveteria Cesa', 'Villa Drinks', 'Wendel Hortifruti'] },
  { city: 'Sumidouro', state: 'RJ', type: 'Varejo', stores: ['JF Carnes', 'Mercado Betinho', 'Mercado Frio Ramos', 'Mercado Pimpolho', 'Mercado São Caetano', 'Quintal Do B'] },
  { city: 'Teresópolis', state: 'RJ', type: 'Varejo', stores: ['Casa Da Carne', 'Cia Das Carnes', 'Depósito De Bebida Pai E Filho', 'Jm Mercado', 'Ki Carnes', 'Mcc Filhos', 'Mercado Chc Dona Marianna', 'Mercado Mv Da Rosa', 'Mt Fruti', 'Padaria Da Serra', 'Santa Rosa'] },
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
                                {entry?.instagram ? (
                                  <a
                                    href={entry.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    title="Instagram"
                                  >
                                    <Instagram className="w-3.5 h-3.5" />
                                  </a>
                                ) : entry && !entry.instagram ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/40 cursor-default" title="Instagram em breve">
                                    <Instagram className="w-3.5 h-3.5" />
                                  </span>
                                ) : null}
                                {entry?.maps ? (
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
                                ) : entry && !entry.maps ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/40 cursor-default text-xs font-medium" title="Localização em breve">
                                    <Navigation className="w-3.5 h-3.5" />
                                    <span>Como chegar</span>
                                  </span>
                                ) : null}
                                {entry?.whatsapp && (
                                  <a
                                    href={entry.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                    title="WhatsApp"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
          <div className="card-dark rounded-xl overflow-hidden relative">
            <div className="aspect-video relative">
              <iframe
                src="https://maps.google.com/maps?q=Regi%C3%A3o+Serrana+Rio+de+Janeiro&t=k&z=10&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Região Serrana do Rio de Janeiro"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 pointer-events-none">
                <p className="text-foreground text-lg font-heading font-bold uppercase">Região Serrana do Rio de Janeiro</p>
                <p className="text-sm text-muted-foreground mt-1">Atendemos toda a região com entrega rápida</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocatorSection;
