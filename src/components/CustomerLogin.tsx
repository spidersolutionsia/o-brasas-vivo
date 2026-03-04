import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, LogOut, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCustomerSession } from '@/hooks/useCustomerSession';

const CustomerLogin = () => {
  const [open, setOpen] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { customerEmail, customerName, isLoggedIn, login, logout } = useCustomerSession();
  const firstName = customerName?.split(' ')[0];
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLogin = loginInput.trim();
    if (!trimmedLogin || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: rpcError } = await supabase.rpc('authenticate_customer', {
      p_login: trimmedLogin,
      p_password: password,
    });

    setLoading(false);

    if (rpcError || !data || (data as any[]).length === 0) {
      setError('Email/telefone ou senha incorretos.');
      return;
    }

    const customer = (data as any[])[0];
    login(customer.email, customer.name);
    setOpen(false);
    setLoginInput('');
    setPassword('');
    navigate('/meus-pedidos');
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    window.location.href = '/';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        aria-label="Login do cliente"
      >
        <User className="w-4 h-4" />
        {isLoggedIn ? (
          <span className="font-heading text-xs font-bold text-primary">Olá, {firstName || customerEmail}</span>
        ) : (
          <span className="hidden sm:inline font-heading text-xs uppercase tracking-wider">Entrar</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading text-sm font-bold uppercase">
              {isLoggedIn ? 'Minha Conta' : 'Login Cliente'}
            </span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Olá, seja bem-vindo <strong className="text-primary">{firstName || customerEmail}</strong>!</p>
              <button
                onClick={() => { setOpen(false); navigate('/meus-pedidos'); }}
                className="w-full text-left text-sm text-foreground hover:text-primary transition-colors py-1"
              >
                Ver Meus Pedidos
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors py-1"
              >
                <LogOut className="w-3 h-3" />
                Sair
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Email ou telefone"
                className="h-10 bg-background border-border text-sm"
              />
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  className="h-10 bg-background border-border text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-destructive text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-fire rounded-lg w-full text-sm"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => { setOpen(false); navigate('/cadastro'); }}
                  className="text-primary hover:underline font-semibold"
                >
                  Cadastre-se
                </button>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerLogin;
