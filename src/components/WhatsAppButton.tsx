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
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 0C7.165 0 .002 7.163.002 16c0 2.825.736 5.584 2.137 8.012L.057 32l8.186-2.048A15.92 15.92 0 0 0 16.004 32C24.838 32 32 24.837 32 16S24.838 0 16.004 0zm0 29.116a13.07 13.07 0 0 1-6.67-1.826l-.478-.284-4.957 1.24 1.265-4.838-.312-.496A13.05 13.05 0 0 1 2.886 16c0-7.238 5.88-13.116 13.118-13.116S29.12 8.762 29.12 16s-5.878 13.116-13.116 13.116zm7.19-9.826c-.394-.197-2.332-1.15-2.694-1.282-.362-.131-.625-.197-.889.197-.263.394-1.02 1.282-1.25 1.545-.23.263-.461.296-.856.099-.394-.197-1.664-.614-3.17-1.956-1.172-1.045-1.963-2.336-2.193-2.73-.23-.394-.025-.607.173-.803.177-.177.394-.461.591-.691.197-.23.263-.394.394-.657.131-.263.066-.493-.033-.691-.099-.197-.889-2.14-1.218-2.93-.32-.769-.646-.665-.889-.677l-.757-.013c-.263 0-.691.099-1.053.493-.362.394-1.382 1.35-1.382 3.293s1.415 3.818 1.612 4.082c.197.263 2.784 4.25 6.744 5.96.942.407 1.678.65 2.252.832.946.3 1.808.258 2.49.157.76-.114 2.332-.953 2.662-1.874.33-.921.33-1.71.23-1.874-.098-.165-.361-.263-.756-.46z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
