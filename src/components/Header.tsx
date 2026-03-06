import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, Flame } from 'lucide-react';
import logoHorizontal from '@/assets/logo-horizontal.jpg';
import CustomerLogin from '@/components/CustomerLogin';
import { useCustomerSession } from '@/hooks/useCustomerSession';

const navLinks = [
  { href: 'fabrica', label: 'A Fábrica' },
  { href: 'produtos', label: 'Produtos' },
  { href: 'parceiros', label: 'Parceiros' },
  { href: 'encontre', label: 'Onde Encontrar' },
  { href: '/pedido', label: 'Fazer Pedido', isRoute: true },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerSession();

  const handleNavClick = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + hash);
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logoHorizontal} alt="Carvão Mascate" className="h-10 md:h-12 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                'isRoute' in link && link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                )
              ))}
              {isLoggedIn && (
                <Link
                  to="/meus-pedidos"
                  className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Package className="w-4 h-4" />
                  Meus Pedidos
                </Link>
              )}
            </nav>

            {/* Right Side: Login + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <CustomerLogin />
              <Link to="/pedido" className="btn-fire text-sm rounded cursor-pointer">
                Comprar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <CustomerLogin />
              <button
                className="text-foreground p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  'isRoute' in link && link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-all py-2 ${
                        mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms', transitionDuration: '300ms' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => { handleNavClick(link.href); setMobileMenuOpen(false); }}
                      className={`font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-all py-2 bg-transparent border-none cursor-pointer text-left ${
                        mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms', transitionDuration: '300ms' }}
                    >
                      {link.label}
                    </button>
                  )
                ))}
                {isLoggedIn && (
                  <Link
                    to="/meus-pedidos"
                    className={`font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-all py-2 flex items-center gap-1 ${
                      mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : '0ms', transitionDuration: '300ms' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4" />
                    Meus Pedidos
                  </Link>
                )}
                <Link
                  to="/pedido"
                  className={`btn-fire text-sm rounded text-center mt-2 cursor-pointer transition-all ${
                    mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : '0ms', transitionDuration: '300ms' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Comprar
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
