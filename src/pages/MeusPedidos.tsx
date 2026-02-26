import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useCustomerSession } from '@/hooks/useCustomerSession';

interface Order {
  id: string;
  order_number: string;
  items: { brand: string; weight: string; quantity: number }[];
  status: string;
  created_at: string;
}

const statusMap: Record<string, string> = {
  pending: 'Recebido',
  processing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregue',
};

const MeusPedidos = () => {
  const { customerCode, isLoggedIn } = useCustomerSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      // Get customer ID from code
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('code', customerCode!)
        .single();

      if (!customer) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data.map((o) => ({
          ...o,
          items: (Array.isArray(o.items) ? o.items : []) as Order['items'],
        })));
      }
      setLoading(false);
    };

    fetchOrders();
  }, [customerCode, isLoggedIn]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing': return <Package className="w-5 h-5 text-primary" />;
      case 'shipped': return <Truck className="w-5 h-5 text-primary" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-primary" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusProgress = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="section-title mb-3">
                Meus <span className="section-title-accent">Pedidos</span>
              </h1>
            </div>

            {!isLoggedIn ? (
              <div className="text-center card-dark rounded-xl p-8 space-y-4">
                <p className="text-muted-foreground">Faça login com seu código de cliente para ver seus pedidos.</p>
                <p className="text-sm text-muted-foreground">Use o botão "Entrar" no topo do site.</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center card-dark rounded-xl p-8 space-y-4">
                <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Você ainda não tem pedidos.</p>
                <button onClick={() => navigate('/pedido')} className="btn-fire rounded-lg text-sm px-8 mx-auto">
                  Fazer Pedido
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const progress = getStatusProgress(order.status);
                  return (
                    <div key={order.id} className="card-dark rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-heading font-bold">Pedido: {order.order_number}</p>
                            <p className="text-xs text-muted-foreground">
                              Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-heading text-primary uppercase">
                          {statusMap[order.status] || order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.brand} {item.weight}
                          </p>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-1">
                        {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => (
                          <div key={s} className="flex items-center flex-1">
                            <div className={`w-3 h-3 rounded-full ${i <= progress ? 'bg-primary' : 'bg-muted'}`} />
                            {i < 3 && <div className={`flex-1 h-0.5 ${i < progress ? 'bg-primary' : 'bg-muted'}`} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto mt-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeusPedidos;
