import { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PageMeta from '@/components/PageMeta';
import HeroSection from '@/components/HeroSection';
import ScrollReveal from '@/components/ScrollReveal';

const FactorySection = lazy(() => import('@/components/FactorySection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const ProductsSection = lazy(() => import('@/components/ProductsSection'));
const PrivateLabelSection = lazy(() => import('@/components/PrivateLabelSection'));
const WholesaleSection = lazy(() => import('@/components/WholesaleSection'));
const StoreLocatorSection = lazy(() => import('@/components/StoreLocatorSection'));
const Footer = lazy(() => import('@/components/Footer'));

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
        title="Carvão Mascate"
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
