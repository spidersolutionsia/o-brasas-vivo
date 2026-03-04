import { useState } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { products } from './StepProducts';

const WHATSAPP_NUMBER = '5522992525529';
const WEBHOOK_URL = 'https://n8n.spidersolutions.com.br/webhook/carvaomascatesite';

interface Props {
  quantities: Record<string, number>;
  customerId: string;
  customerName: string;
  onBack: () => void;
  onComplete: () => void;
}

const StepConfirmation = ({ quantities, customerId, customerName, onBack, onComplete }: Props) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const cartItems = products
    .filter((p) => (quantities[p.id] || 0) > 0)
    .map((p) => ({ ...p, quantity: quantities[p.id] }));

  const handleConfirm = async () => {
    setLoading(true);

    const { data: orderNum, error: numErr } = await supabase.rpc('generate_order_number');
    if (numErr || !orderNum) {
      alert('Erro ao gerar número do pedido.');
      setLoading(false);
      return;
    }

    const orderNumber = orderNum as string;
    const itemsPayload = cartItems.map((i) => ({
      brand: i.brand,
      weight: i.weight,
      quantity: i.quantity,
    }));

    const { error: insertErr } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_id: customerId,
      items: itemsPayload,
      status: 'pending',
    });

    if (insertErr) {
      alert('Erro ao salvar pedido.');
      setLoading(false);
      return;
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    // Send webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'order_completed',
          order_number: orderNumber,
          customer_name: customer?.name || customerName,
          customer_phone: customer?.phone || '',
          customer_email: customer?.email || '',
          customer_address: customer
            ? `${customer.street}, ${customer.number}${customer.complement ? ' - ' + customer.complement : ''}, ${customer.neighborhood}, ${customer.city} - CEP ${customer.cep}`
            : '',
          items: itemsPayload,
          created_at: new Date().toISOString(),
        }),
      });
    } catch {
      // webhook failure shouldn't block the order
    }

    // Send order summary email
    try {
      await supabase.functions.invoke('send-order-email', {
        body: {
          customerName: customer?.name || customerName,
          customerEmail: customer?.email || '',
          orderNumber,
          items: itemsPayload,
        },
      });
    } catch {
      // email failure shouldn't block the order
    }

    // Open WhatsApp
    const itemsText = cartItems
      .map((i) => `• ${i.quantity}x ${i.brand} ${i.weight}`)
      .join('\n');

    const msg = encodeURIComponent(
      `*Pedido ${orderNumber} - Carvão Mascate*\n\nCliente: ${customerName}\n\n${itemsText}\n\nOlá! Gostaria de confirmar este pedido.`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');

    setLoading(false);
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (done) {
    return (
      <div className="text-center space-y-6 py-8">
        <CheckCircle className="w-16 h-16 text-primary mx-auto" />
        <h3 className="font-heading text-2xl font-bold uppercase">Pedido Enviado!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Seu pedido foi registrado e enviado via WhatsApp. Acompanhe o status na área "Meus Pedidos".
        </p>
        <button onClick={onComplete} className="btn-fire rounded-lg text-lg px-12 mx-auto">
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="card-dark rounded-xl p-5">
        <p className="text-sm text-muted-foreground mb-1">Cliente</p>
        <p className="font-heading text-lg font-bold">{customerName}</p>
      </div>

      {/* Items */}
      <div className="card-dark rounded-xl p-5 space-y-3">
        <p className="text-sm text-muted-foreground mb-2">Itens do Pedido</p>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">{item.brand}</span>
              <p className="font-heading font-bold">{item.name} {item.weight}</p>
            </div>
            <span className="font-heading text-xl font-bold text-primary">{item.quantity}x</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <MessageCircle className="w-6 h-6" />
        {loading ? 'Enviando...' : 'Finalizar e Enviar Pedido'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Você será redirecionado para o WhatsApp com os detalhes do pedido.
      </p>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Pedido
      </button>
    </div>
  );
};

export default StepConfirmation;
