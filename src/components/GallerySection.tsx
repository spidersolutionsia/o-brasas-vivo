import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import gallery1 from '@/assets/gallery/gallery-1.webp';
import gallery2 from '@/assets/gallery/gallery-2.webp';
import gallery3 from '@/assets/gallery/gallery-3.webp';
import gallery4 from '@/assets/gallery/gallery-4.webp';
import gallery5 from '@/assets/gallery/gallery-5.webp';
import gallery6 from '@/assets/gallery/gallery-6.webp';
import gallery7 from '@/assets/gallery/gallery-7.webp';

const galleryImages = [
  { src: gallery1, alt: 'Produtos Carvão Mascate com madeira de eucalipto', caption: 'Nossos Produtos' },
  { src: gallery2, alt: 'Vista da fábrica com produção de carvão', caption: 'Processo de Produção' },
  { src: gallery3, alt: 'Vista panorâmica da fábrica em Duas Barras', caption: 'Nossa Fábrica' },
  { src: gallery4, alt: 'Linha completa de produtos private label', caption: 'Private Label' },
  { src: gallery5, alt: 'Estoque de madeira de eucalipto', caption: 'Matéria-Prima' },
  { src: gallery6, alt: 'Carvão Mascate granulado de alta qualidade', caption: 'Carvão Premium' },
  { src: gallery7, alt: 'Fornos de carbonização em funcionamento', caption: 'Fornos Artesanais' },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 fade-in-up">
          <h2 className="section-title mb-4">
            Nossa <span className="section-title-accent">Galeria</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça nossa fábrica, processo de produção e a qualidade do carvão Mascate
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <div className={`aspect-square ${index === 0 ? 'aspect-auto h-full' : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-coal-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-foreground font-heading text-lg">{image.caption}</p>
                </div>
              </div>

              {/* Fire glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 ring-2 ring-primary/50 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-[60] bg-coal-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 z-50 p-2 text-foreground/80 hover:text-foreground transition-colors bg-card/50 rounded-full"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 z-50 p-2 text-foreground/80 hover:text-foreground transition-colors bg-card/50 rounded-full"
            aria-label="Próximo"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div 
            className="max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-center mt-4 text-foreground font-heading text-xl">
              {galleryImages[selectedImage].caption}
            </p>
            <p className="text-center text-muted-foreground text-sm mt-1">
              {selectedImage + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
