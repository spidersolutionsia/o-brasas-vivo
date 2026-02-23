import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package } from 'lucide-react';
import logoHorizontal from '@/assets/logo-horizontal.jpg';

const navLinks = [
  { href: 'fabrica', label: 'A Fábrica' },
  { href: 'produtos', label: 'Produtos' },
  { href: 'parceiros', label: 'Parceiros' },
  { href: 'atacado', label: 'Atacado' },
  { href: 'encontre', label: 'Onde Encontrar' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + hash);
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logoHorizontal}
              alt="Carvão Mascate"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/meu-pedido"
              className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Package className="w-4 h-4" />
              Meu Pedido
            </Link>
          </nav>

          {/* CTA Button - Desktop */}
          <button
            onClick={() => handleNavClick('atacado')}
            className="hidden md:block btn-fire text-sm rounded cursor-pointer"
          >
            Comprar
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { handleNavClick(link.href); setMobileMenuOpen(false); }}
                  className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-2 bg-transparent border-none cursor-pointer text-left"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/meu-pedido"
                className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-2 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="w-4 h-4" />
                Meu Pedido
              </Link>
              <button
                onClick={() => { handleNavClick('atacado'); setMobileMenuOpen(false); }}
                className="btn-fire text-sm rounded text-center mt-2 cursor-pointer"
              >
                Comprar
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
