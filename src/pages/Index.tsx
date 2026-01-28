import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FactorySection from '@/components/FactorySection';
import GallerySection from '@/components/GallerySection';
import ProductsSection from '@/components/ProductsSection';
import PrivateLabelSection from '@/components/PrivateLabelSection';
import WholesaleSection from '@/components/WholesaleSection';
import StoreLocatorSection from '@/components/StoreLocatorSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FactorySection />
        <GallerySection />
        <ProductsSection />
        <PrivateLabelSection />
        <WholesaleSection />
        <StoreLocatorSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
