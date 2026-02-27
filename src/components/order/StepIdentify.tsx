import { useState } from 'react';
import { ArrowLeft, UserPlus, LogIn, Mail, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const WEBHOOK_URL = 'https://n8n.spidersolutions.com.br/webhook/carvaomascatesite';

interface Props {
  onBack: () => void;
  onCustomerFound: (customerId: string, customerCode: string, customerName: string) => void;
  onRegister: () => void;
}

const StepIdentify = ({ onBack, onCustomerFound, onRegister }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'recover'>('login');
  const [recoverInput, setRecoverInput] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState('');
  const [recoverError, setRecoverError] = useState('');

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

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = recoverInput.trim();
    if (!value) {
      setRecoverError('Digite seu email ou telefone de cadastro.');
      return;
    }

    setRecoverLoading(true);
    setRecoverError('');
    setRecoverMsg('');

    const isEmail = value.includes('@');
    const column = isEmail ? 'email' : 'phone';

    const { data, error: dbError } = await supabase
      .from('customers')
      .select('name, email, code')
      .eq(column, value)
      .maybeSingle();

    if (dbError || !data) {
      setRecoverLoading(false);
      setRecoverMsg('Se houver um cadastro com esse dado, enviaremos o código por email.');
      return;
    }

    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          customerName: data.name,
          customerEmail: data.email,
          customerCode: data.code,
        },
      });
    } catch {
      // silently fail to not expose info
    }

    // Send webhook for WhatsApp recovery (non-blocking)
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'code_recovery',
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          code: data.code,
        },
      }),
    }).catch((err) => console.error('Failed to send code_recovery webhook:', err));

    setRecoverLoading(false);
    setRecoverMsg('Se houver um cadastro com esse dado, enviaremos o código por email.');
  };

  if (mode === 'recover') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <Mail className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-lg font-heading font-bold text-foreground">Recuperar meu código</h3>
          <p className="text-sm text-muted-foreground">
            Informe o email ou telefone usado no cadastro e enviaremos seu código de acesso.
          </p>
        </div>

        <form onSubmit={handleRecover} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email ou Telefone
            </label>
            <Input
              value={recoverInput}
              onChange={(e) => setRecoverInput(e.target.value)}
              placeholder="Ex: seu@email.com ou (11) 99999-9999"
              className="h-12 bg-background border-border focus:border-primary"
            />
          </div>

          {recoverError && <p className="text-destructive text-sm text-center">{recoverError}</p>}
          {recoverMsg && <p className="text-primary text-sm text-center">{recoverMsg}</p>}

          <button
            type="submit"
            disabled={recoverLoading}
            className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {recoverLoading ? 'Enviando...' : 'Enviar meu código'}
          </button>
        </form>

        <button
          onClick={() => { setMode('login'); setRecoverError(''); setRecoverMsg(''); setRecoverInput(''); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login com código
        </button>
      </div>
    );
  }

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

        <button
          type="button"
          onClick={() => { setMode('recover'); setError(''); }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors mx-auto block"
        >
          Não lembro meu código
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
