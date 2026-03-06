import { useState } from 'react';
import { ArrowLeft, Mail, Phone, KeyRound, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onBack: () => void;
  compact?: boolean;
}

const N8N_WEBHOOK = 'https://n8n.spidersolutions.com.br/webhook/carvaomascatesite';

const PasswordRecovery = ({ onBack, compact = false }: Props) => {
  const [step, setStep] = useState<'input' | 'choose' | 'code' | 'newPassword' | 'done'>('input');
  const [loginInput, setLoginInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    code: string;
  } | null>(null);
  const [sentVia, setSentVia] = useState<'email' | 'phone' | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = loginInput.trim();
    if (!trimmed) {
      setError('Informe seu email ou telefone.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('generate_recovery_code', {
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
      id: result.customer_id,
      name: result.customer_name,
      email: result.customer_email,
      phone: result.customer_phone,
      code: result.recovery_code,
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
    setError('');

    try {
      const { error } = await supabase.functions.invoke('send-recovery-email', {
        body: {
          customerName: customerData.name,
          customerEmail: customerData.email,
          code: customerData.code,
        },
      });

      if (error) throw error;
      setSentVia('email');
      setStep('code');
    } catch {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const sendViaPhone = async () => {
    if (!customerData) return;
    setLoading(true);
    setError('');

    try {
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'code_recovery',
          name: customerData.name,
          phone: customerData.phone,
          code: customerData.code,
        }),
      });
      setSentVia('phone');
      setStep('code');
    } catch {
      setError('Erro ao enviar via WhatsApp. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (trimmed.length !== 6) {
      setError('Digite o código de 6 dígitos.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('verify_recovery_code', {
      p_login: loginInput.trim(),
      p_code: trimmed,
    });

    setLoading(false);

    if (rpcError) {
      setError('Erro ao verificar. Tente novamente.');
      return;
    }

    if (!data || (data as any[]).length === 0) {
      setError('Código inválido ou expirado.');
      return;
    }

    setCustomerId((data as any[])[0].customer_id);
    setStep('newPassword');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('reset_customer_password', {
      p_customer_id: customerId,
      p_new_password: newPassword,
    });

    setLoading(false);

    if (rpcError || data === false) {
      setError('Erro ao redefinir senha. Tente novamente.');
      return;
    }

    setStep('done');
  };

  const textSize = compact ? 'text-xs' : 'text-sm';
  const titleSize = compact ? 'text-sm' : 'text-base';
  const inputHeight = compact ? 'h-10' : 'h-12';
  const gap = compact ? 'space-y-3' : 'space-y-4';

  if (step === 'done') {
    return (
      <div className={`${gap} text-center`}>
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
        <p className={`${titleSize} font-bold text-foreground`}>Senha alterada!</p>
        <p className={`${textSize} text-muted-foreground`}>
          Sua senha foi redefinida com sucesso. Use a nova senha para fazer login.
        </p>
        <button
          onClick={onBack}
          className={`text-primary hover:underline font-semibold ${textSize}`}
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  if (step === 'newPassword') {
    return (
      <div className={gap}>
        <p className={`${titleSize} font-bold text-foreground`}>
          <KeyRound className="w-4 h-4 inline mr-1.5" />
          Nova senha
        </p>
        <p className={`${textSize} text-muted-foreground`}>
          Defina sua nova senha:
        </p>

        <form onSubmit={handleResetPassword} className={gap}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              className={`${inputHeight} bg-background border-border focus:border-primary pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar nova senha"
            className={`${inputHeight} bg-background border-border focus:border-primary`}
          />
          {error && <p className={`text-destructive ${textSize}`}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-fire rounded-lg w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className={gap}>
        <p className={`${titleSize} font-bold text-foreground`}>
          <KeyRound className="w-4 h-4 inline mr-1.5" />
          Digite o código
        </p>
        <p className={`${textSize} text-muted-foreground`}>
          {sentVia === 'email'
            ? `Enviamos um código de 6 dígitos para ${maskEmail(customerData!.email)}`
            : `Enviamos um código de 6 dígitos via WhatsApp para ${maskPhone(customerData!.phone)}`}
        </p>

        <form onSubmit={handleVerifyCode} className={gap}>
          <Input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className={`${inputHeight} bg-background border-border focus:border-primary text-center text-xl tracking-[0.5em] font-mono`}
            inputMode="numeric"
          />
          {error && <p className={`text-destructive ${textSize}`}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-fire rounded-lg w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>

        <button
          onClick={() => { setStep('choose'); setError(''); setCodeInput(''); }}
          className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mx-auto ${textSize}`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
      </div>
    );
  }

  if (step === 'choose' && customerData) {
    return (
      <div className={gap}>
        <p className={`${titleSize} font-bold text-foreground`}>
          <KeyRound className="w-4 h-4 inline mr-1.5" />
          Como deseja receber o código?
        </p>
        <p className={`${textSize} text-muted-foreground`}>
          Encontramos sua conta, <strong className="text-foreground">{customerData.name.split(' ')[0]}</strong>. Escolha como receber o código de verificação:
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
