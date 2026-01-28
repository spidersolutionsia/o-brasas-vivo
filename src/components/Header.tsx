import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoHorizontal from '@/assets/logo-horizontal.jpg';

const navLinks = [
  { href: '#fabrica', label: 'A Fábrica' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#parceiros', label: 'Parceiros' },
  { href: '#atacado', label: 'Atacado' },
  { href: '#encontre', label: 'Onde Encontrar' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <img
              src={logoHorizontal}
              alt="Carvão Mascate"
              className="h-10 md:h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <a
            href="#atacado"
            className="hidden md:block btn-fire text-sm rounded"
          >
            Comprar
          </a>

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
                <a
                  key={link.href}
                  href={link.href}
                  className="font-heading text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#atacado"
                className="btn-fire text-sm rounded text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Comprar
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
