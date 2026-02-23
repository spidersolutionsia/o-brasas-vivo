import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '5522999999999';
const WHATSAPP_MESSAGE = 'Olá! Gostaria de saber mais sobre o Carvão Mascate.';

const WhatsAppButton = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
    >
      <MessageCircle className="w-7 h-7 fill-white stroke-white" />
    </a>
  );
};

export default WhatsAppButton;
