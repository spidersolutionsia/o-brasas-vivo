import Header from '@/components/Header';
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
  return (
    <div className="min-h-screen bg-background">
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
