import { Instagram, Facebook, Phone, Mail } from 'lucide-react';
import logoSelo from '@/assets/logo-selo.jpg';
import LiveEmber from './LiveEmber';

const WHATSAPP_NUMBER = '5522992525529';

const Footer = () => {
  return (
    <footer className="ember-bg pt-16 pb-0 relative">
      {/* Fire Divider at Top */}
      <div className="fire-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={logoSelo}
              alt="Carvão Mascate"
              className="h-32 w-auto mb-4"
            />
            <p className="text-muted-foreground text-center md:text-left">
              Carvão premium de eucalipto, produzido em Duas Barras/RJ.
              Mais brasa, menos fumaça!
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-primary mb-4">
              Links Rápidos
            </h3>
            <nav className="space-y-2">
              <a href="#fabrica" className="block text-muted-foreground hover:text-primary transition-colors">
                A Fábrica
              </a>
              <a href="#produtos" className="block text-muted-foreground hover:text-primary transition-colors">
                Produtos
              </a>
              <a href="#parceiros" className="block text-muted-foreground hover:text-primary transition-colors">
                Parceiros
              </a>
              <a href="#atacado" className="block text-muted-foreground hover:text-primary transition-colors">
                Pedido de Atacado
              </a>
              <a href="#encontre" className="block text-muted-foreground hover:text-primary transition-colors">
                Onde Encontrar
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-primary mb-4">
              Contato
            </h3>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de atendimento!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href="mailto:carvaomascate@gmail.com"
                className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                carvaomascate@gmail.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
              <a
                href="https://www.instagram.com/carvaomascate/?hl=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 pt-8 pb-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Carvão Mascate. Todos os direitos reservados.
          </p>
          <p className="text-center text-xs text-muted-foreground/60 mt-2">
            Estrada Duas Barras-Murinele, S/N, Km8 - Zona Rural - Duas Barras/RJ
          </p>
        </div>
      </div>
      
      {/* Live Ember Effect */}
      <LiveEmber />
    </footer>
  );
};

export default Footer;
