import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCustomerSession } from '@/hooks/useCustomerSession';

const CustomerLogin = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { customerCode, customerName, isLoggedIn, login, logout } = useCustomerSession();
  const firstName = customerName?.split(' ')[0];
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    const { data } = await supabase
      .from('customers')
      .select('code, name')
      .eq('code', trimmed)
      .maybeSingle();

    setLoading(false);

    if (!data) {
      setError('Código não encontrado.');
      return;
    }

    login(data.code, data.name);
    setOpen(false);
    setCode('');
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
          <span className="font-heading text-xs font-bold text-primary">Olá, {firstName || customerCode}</span>
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
              <p className="text-sm text-muted-foreground">Olá, seja bem-vindo <strong className="text-primary">{firstName || customerCode}</strong>!</p>
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
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Código (ex: ABC123)"
                maxLength={6}
                className="h-10 bg-background border-border text-center font-heading tracking-widest uppercase"
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-fire rounded-lg w-full text-sm"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerLogin;
