import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

const SAVED_LOGIN_KEY = 'saved_login';
const SAVED_PASSWORD_KEY = 'saved_password';

interface Props {
  onBack: () => void;
  onCustomerFound: (customerId: string, customerName: string, customerEmail: string) => void;
  onRegister: () => void;
}

const StepIdentify = ({ onBack, onCustomerFound, onRegister }: Props) => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem(SAVED_LOGIN_KEY);
    const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY);
    if (savedLogin && savedPassword) {
      setLoginInput(savedLogin);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = loginInput.trim();
    if (!trimmed || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('authenticate_customer', {
      p_login: trimmed,
      p_password: password,
    });

    setLoading(false);

    if (rpcError) {
      setError('Erro ao autenticar. Tente novamente.');
      return;
    }
    if (!data || (data as any[]).length === 0) {
      setError('Email/telefone ou senha incorretos.');
      return;
    }

    const customer = (data as any[])[0];

    if (rememberMe) {
      localStorage.setItem(SAVED_LOGIN_KEY, trimmed);
      localStorage.setItem(SAVED_PASSWORD_KEY, password);
    } else {
      localStorage.removeItem(SAVED_LOGIN_KEY);
      localStorage.removeItem(SAVED_PASSWORD_KEY);
    }

    onCustomerFound(customer.id, customer.name, customer.email);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email ou Telefone
          </label>
          <Input
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Ex: seu@email.com ou 11999999999"
            className="h-12 bg-background border-border focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Senha
          </label>
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="h-12 bg-background border-border focus:border-primary pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
            Lembrar meus dados
          </label>
        </div>

        {error && <p className="text-destructive text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Autenticando...' : 'Entrar'}
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
