import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, MapPin, MessageCircle, ArrowLeft, Flame, Users, Clock, Beef } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

import productBag25 from '@/assets/product-mascate-2.5kg.png';
import productBag5 from '@/assets/product-bag-5kg.jpg';
import productBag9 from '@/assets/product-mascate-9kg.png';
import logoHorizontal from '@/assets/logo-horizontal.jpg';

const Calculadora = () => {
  const [men, setMen] = useState(0);
  const [women, setWomen] = useState(0);
  const [children, setChildren] = useState(0);
  const [duration, setDuration] = useState(4);
  const [hasAccompaniments, setHasAccompaniments] = useState(false);

  const totalPeople = men + women + children;

  const result = useMemo(() => {
    const baseMeat = men * 500 + women * 400 + children * 200;
    const durationAdj = duration > 4 ? 1.2 : 1;
    const accompAdj = hasAccompaniments ? 0.9 : 1;
    const totalGrams = baseMeat * durationAdj * accompAdj;
    const totalKg = totalGrams / 1000;

    let bagSize: string;
    let bagLabel: string;
    let bagImage: string;
    let bagKg: number;

    if (totalKg <= 2.5) {
      bagSize = '2.5kg';
      bagLabel = 'Saco de 2.5kg — O Essencial';
      bagImage = productBag25;
      bagKg = 2.5;
    } else if (totalKg <= 5) {
      bagSize = '5kg';
      bagLabel = 'Saco de 5kg — O Churrasqueiro';
      bagImage = productBag5;
      bagKg = 5;
    } else {
      bagSize = '9kg';
      bagLabel = 'Saco de 9kg — Mestre da Brasa';
      bagImage = productBag9;
      bagKg = 9;
    }

    return { totalKg: Math.round(totalKg * 10) / 10, bagSize, bagLabel, bagImage, bagKg };
  }, [men, women, children, duration, hasAccompaniments]);

  const whatsappLink = useMemo(() => {
    const msg = encodeURIComponent(
      `Olá! Usei o Calculômetro Mascate. Para o meu churrasco de ${totalPeople} pessoas, preciso de ${result.totalKg}kg de carne e um Saco de Carvão Mascate de ${result.bagKg}kg. Onde encontro o revendedor mais próximo?`
    );
    return `https://wa.me/5522992525529?text=${msg}`;
  }, [totalPeople, result]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter'] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#ff6a00]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={logoHorizontal} alt="Carvão Mascate" className="h-8 md:h-10 rounded" />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#ff6a00]/10 border border-[#ff6a00]/20 rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-4 h-4 text-[#ff6a00]" />
            <span className="text-[#ff6a00] text-sm font-medium tracking-wide uppercase">Calculômetro</span>
          </div>
          <h1 className="font-['Oswald'] text-4xl md:text-5xl font-bold tracking-tight">
            Calculadora de <span className="text-[#ff6a00]">Churrasco</span>
          </h1>
          <p className="text-white/50 mt-3 text-sm md:text-base max-w-md mx-auto">
            Descubra a quantidade ideal de carne e carvão para o seu churrasco perfeito.
          </p>
        </div>

        {/* People Input Card */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-[#ff6a00]" />
            <h2 className="font-['Oswald'] text-lg font-semibold tracking-wide uppercase">Convidados</h2>
          </div>

          <div className="space-y-4">
            <CounterRow label="Homens" sublabel="500g por pessoa" value={men} onChange={setMen} />
            <CounterRow label="Mulheres" sublabel="400g por pessoa" value={women} onChange={setWomen} />
            <CounterRow label="Crianças" sublabel="200g por pessoa" value={children} onChange={setChildren} />
          </div>
        </div>

        {/* Duration Card */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-[#ff6a00]" />
            <h2 className="font-['Oswald'] text-lg font-semibold tracking-wide uppercase">Duração</h2>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Tempo estimado</span>
            <span className="font-['Oswald'] text-2xl font-bold text-[#ff6a00]">{duration}h</span>
          </div>

          <Slider
            value={[duration]}
            onValueChange={(v) => setDuration(v[0])}
            min={2}
            max={8}
            step={1}
            className="[&_[role=slider]]:bg-[#ff6a00] [&_[role=slider]]:border-[#ff6a00] [&_[data-orientation=horizontal]>[data-orientation=horizontal]]:bg-[#ff6a00] [&_.relative>.absolute]:bg-[#ff6a00]"
          />
          <div className="flex justify-between mt-2 text-xs text-white/30">
            <span>2h</span>
            <span>4h</span>
            <span>6h</span>
            <span>8h</span>
          </div>

          {duration > 4 && (
            <div className="mt-3 text-xs text-[#ff6a00]/80 bg-[#ff6a00]/5 rounded-lg px-3 py-2 border border-[#ff6a00]/10">
              ⏱️ Churrasco longo! +20% de carne adicionado automaticamente.
            </div>
          )}
        </div>

        {/* Accompaniments */}
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={hasAccompaniments}
              onCheckedChange={(v) => setHasAccompaniments(!!v)}
              className="mt-0.5 border-white/20 data-[state=checked]:bg-[#ff6a00] data-[state=checked]:border-[#ff6a00]"
            />
            <div>
              <span className="font-medium text-sm">Teremos pão de alho, linguiça e entradas</span>
              <span className="block text-xs text-white/40 mt-0.5">Reduz 10% da carne necessária</span>
            </div>
          </label>
        </div>

        {/* Result Card */}
        {totalPeople > 0 && (
          <div className="backdrop-blur-xl bg-white/[0.04] border border-[#ff6a00]/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#ff6a00]/10 blur-[60px]" />

            <div className="flex items-center gap-2 mb-5">
              <Beef className="w-5 h-5 text-[#ff6a00]" />
              <h2 className="font-['Oswald'] text-lg font-semibold tracking-wide uppercase">Resultado</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Product Image */}
              <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center p-3">
                <img src={result.bagImage} alt={result.bagLabel} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <span className="text-white/50 text-xs uppercase tracking-widest">Total de carne</span>
                  <div className="font-['Oswald'] text-5xl font-bold text-[#ff6a00] leading-none mt-1">
                    {result.totalKg}<span className="text-2xl">kg</span>
                  </div>
                  <span className="text-white/40 text-sm">para {totalPeople} pessoa{totalPeople > 1 ? 's' : ''}</span>
                </div>

                <div className="bg-white/[0.04] rounded-lg px-4 py-3 border border-white/[0.06]">
                  <span className="text-white/40 text-xs uppercase tracking-widest">Carvão ideal</span>
                  <div className="font-['Oswald'] text-xl font-semibold text-white mt-0.5">{result.bagLabel}</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Link to="/#pontos-de-venda">
                <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 h-12 font-semibold gap-2">
                  <MapPin className="w-4 h-4" />
                  Onde Encontrar
                </Button>
              </Link>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#25D366] hover:bg-[#20BD5B] text-white h-12 font-semibold gap-2 border-0">
                  <MessageCircle className="w-4 h-4" />
                  Receber Lista no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalPeople === 0 && (
          <div className="text-center py-12 text-white/20">
            <Flame className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Adicione convidados para calcular</p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs leading-relaxed">
            Carvão Mascate — A qualidade que você vê antes de acender.<br />
            Venda exclusiva para revendedores.
          </p>
        </footer>
      </div>
    </div>
  );
};

/* Counter Row Component */
const CounterRow = ({
  label,
  sublabel,
  value,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="font-medium text-sm">{label}</span>
      <span className="block text-xs text-white/30">{sublabel}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-20"
        disabled={value === 0}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="font-['Oswald'] text-2xl font-bold w-8 text-center">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 rounded-full border border-[#ff6a00]/30 bg-[#ff6a00]/10 flex items-center justify-center hover:bg-[#ff6a00]/20 transition-colors text-[#ff6a00]"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default Calculadora;
