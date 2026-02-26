import { useState } from 'react';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onBack: () => void;
  onCustomerFound: (customerId: string, customerCode: string, customerName: string) => void;
  onRegister: () => void;
}

const StepIdentify = ({ onBack, onCustomerFound, onRegister }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Digite seu código de cliente.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: dbError } = await supabase
      .from('customers')
      .select('id, code, name')
      .eq('code', trimmed)
      .maybeSingle();

    setLoading(false);

    if (dbError) {
      setError('Erro ao buscar cliente.');
      return;
    }
    if (!data) {
      setError('Código não encontrado. Verifique ou faça seu cadastro.');
      return;
    }

    onCustomerFound(data.id, data.code, data.name);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Código do Cliente
          </label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            maxLength={6}
            className="h-12 bg-background border-border focus:border-primary text-center text-xl font-heading tracking-widest uppercase"
          />
        </div>

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Buscando...' : 'Confirmar Código'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-4 text-muted-foreground">ou</span>
        </div>
      </div>

      <button
        onClick={onRegister}
        className="btn-outline-fire rounded-lg w-full text-lg flex items-center justify-center gap-3"
      >
        <UserPlus className="w-5 h-5" />
        Sou novo, quero me cadastrar
      </button>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos produtos
      </button>
    </div>
  );
};

export default StepIdentify;
