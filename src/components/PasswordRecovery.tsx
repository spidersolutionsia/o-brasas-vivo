import { useState } from 'react';
import { ArrowLeft, Mail, Phone, KeyRound, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onBack: () => void;
  compact?: boolean;
}

const N8N_WEBHOOK = 'https://n8n.spidersolutions.com.br/webhook/carvaomascatesite';

const PasswordRecovery = ({ onBack, compact = false }: Props) => {
  const [step, setStep] = useState<'input' | 'choose' | 'sent'>('input');
  const [loginInput, setLoginInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    phone: string;
    tempPassword: string;
  } | null>(null);
  const [sentVia, setSentVia] = useState<'email' | 'phone' | null>(null);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = loginInput.trim();
    if (!trimmed) {
      setError('Informe seu email ou telefone.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('recover_customer_password', {
      p_login: trimmed,
    });

    setLoading(false);

    if (rpcError) {
      setError('Erro ao buscar. Tente novamente.');
      return;
    }

    if (!data || (data as any[]).length === 0) {
      setError('Nenhuma conta encontrada com esse email/telefone.');
      return;
    }

    const result = (data as any[])[0];
    setCustomerData({
      name: result.customer_name,
      email: result.customer_email,
      phone: result.customer_phone,
      tempPassword: result.temp_password,
    });
    setStep('choose');
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    return user.slice(0, 2) + '***@' + domain;
  };

  const maskPhone = (phone: string) => {
    return phone.slice(0, 4) + '****' + phone.slice(-2);
  };

  const sendViaEmail = async () => {
    if (!customerData) return;
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-recovery-email', {
        body: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          tempPassword: customerData.tempPassword,
        },
      });

      if (error) throw error;
      setSentVia('email');
      setStep('sent');
    } catch {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const sendViaPhone = async () => {
    if (!customerData) return;
    setLoading(true);

    try {
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'code_recovery',
          name: customerData.name,
          phone: customerData.phone,
          tempPassword: customerData.tempPassword,
        }),
      });
      setSentVia('phone');
      setStep('sent');
    } catch {
      setError('Erro ao enviar via WhatsApp. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const textSize = compact ? 'text-xs' : 'text-sm';
  const titleSize = compact ? 'text-sm' : 'text-base';
  const inputHeight = compact ? 'h-10' : 'h-12';
  const gap = compact ? 'space-y-3' : 'space-y-4';

  if (step === 'sent') {
    return (
      <div className={`${gap} text-center`}>
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
        <p className={`${titleSize} font-bold text-foreground`}>Senha enviada!</p>
        <p className={`${textSize} text-muted-foreground`}>
          {sentVia === 'email'
            ? `Enviamos sua nova senha para ${maskEmail(customerData!.email)}`
            : `Enviamos sua nova senha via WhatsApp para ${maskPhone(customerData!.phone)}`}
        </p>
        <p className={`${textSize} text-muted-foreground`}>Use a nova senha para fazer login.</p>
        <button
          onClick={onBack}
          className={`text-primary hover:underline font-semibold ${textSize}`}
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  if (step === 'choose' && customerData) {
    return (
      <div className={gap}>
        <p className={`${titleSize} font-bold text-foreground`}>
          <KeyRound className="w-4 h-4 inline mr-1.5" />
          Como deseja receber?
        </p>
        <p className={`${textSize} text-muted-foreground`}>
          Encontramos sua conta, <strong className="text-foreground">{customerData.name.split(' ')[0]}</strong>. Escolha como receber sua nova senha:
        </p>

        {error && <p className={`text-destructive ${textSize}`}>{error}</p>}

        <button
          onClick={sendViaEmail}
          disabled={loading}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
        >
          <Mail className="w-5 h-5 text-primary shrink-0" />
          <div className="text-left">
            <span className={`${textSize} font-semibold text-foreground block`}>Email</span>
            <span className="text-xs text-muted-foreground">{maskEmail(customerData.email)}</span>
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
        </button>

        <button
          onClick={sendViaPhone}
          disabled={loading}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-green-500 hover:bg-green-500/5 transition-all disabled:opacity-50"
        >
          <Phone className="w-5 h-5 text-green-500 shrink-0" />
          <div className="text-left">
            <span className={`${textSize} font-semibold text-foreground block`}>WhatsApp</span>
            <span className="text-xs text-muted-foreground">{maskPhone(customerData.phone)}</span>
          </div>
          {loading && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
        </button>

        <button
          onClick={() => { setStep('input'); setError(''); }}
          className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto ${textSize}`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={gap}>
      <p className={`${titleSize} font-bold text-foreground`}>
        <KeyRound className="w-4 h-4 inline mr-1.5" />
        Recuperar senha
      </p>
      <p className={`${textSize} text-muted-foreground`}>
        Informe seu email ou telefone cadastrado:
      </p>

      <form onSubmit={handleFind} className={gap}>
        <Input
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          placeholder="Email ou telefone"
          className={`${inputHeight} bg-background border-border focus:border-primary`}
        />
        {error && <p className={`text-destructive ${textSize}`}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-fire rounded-lg w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Buscando...' : 'Buscar minha conta'}
        </button>
      </form>

      <button
        onClick={onBack}
        className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto ${textSize}`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar ao login
      </button>
    </div>
  );
};

export default PasswordRecovery;
