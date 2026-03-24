import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PageMeta from '@/components/PageMeta';
import HeroSection from '@/components/HeroSection';
import FactorySection from '@/components/FactorySection';
import GallerySection from '@/components/GallerySection';
import ProductsSection from '@/components/ProductsSection';
import PrivateLabelSection from '@/components/PrivateLabelSection';
import WholesaleSection from '@/components/WholesaleSection';
import StoreLocatorSection from '@/components/StoreLocatorSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Carvão Mascate | Mais Brasa, Menos Fumaça"
        description="Carvão premium de eucalipto produzido em Duas Barras/RJ. Mais brasa, menos fumaça. Alta durabilidade, limpo e granulado. Atacado."
        path="/"
      />
      <Header />
      <main>
        <HeroSection />
        <ScrollReveal>
          <FactorySection />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <GallerySection />
        </ScrollReveal>
        <ScrollReveal>
          <ProductsSection />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <PrivateLabelSection />
        </ScrollReveal>
        <ScrollReveal>
          <WholesaleSection />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <StoreLocatorSection />
        </ScrollReveal>
      </main>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Index;
