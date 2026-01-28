import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderStatus {
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  statusText: string;
  estimatedDelivery?: string;
  items?: string[];
}

const MeuPedido = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhone(formatted);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrderResult(null);

    if (!orderNumber.trim()) {
      setError('Por favor, digite o número do pedido.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, digite um telefone válido.');
      return;
    }

    setIsSearching(true);

    // Simulando uma busca (em produção, isso seria uma chamada à API)
    setTimeout(() => {
      // Simulação de resposta - em produção, seria substituído por uma chamada real à API
      const mockOrder: OrderStatus = {
        orderNumber: orderNumber,
        status: 'processing',
        statusText: 'Pedido em preparação',
        estimatedDelivery: '30/01/2026',
        items: ['Saco 5kg x2', 'Saco 2,5kg x1']
      };
      
      setOrderResult(mockOrder);
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-amber-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-primary" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-primary" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-primary" />;
      default:
        return <Package className="w-6 h-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 md:py-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="text-primary italic">Acompanhe</span> seu Pedido
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Digite o número do pedido e seu telefone para verificar o status
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber" className="text-foreground font-medium">
                    Número do Pedido
                  </Label>
                  <Input
                    id="orderNumber"
                    type="text"
                    placeholder="Ex: 1027"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.replace(/\D/g, ''))}
                    className="h-12 bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(22) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="h-12 bg-background border-border focus:border-primary"
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm mb-4 text-center">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                disabled={isSearching}
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Buscar Pedido
                  </span>
                )}
              </Button>
            </form>

            {/* Order Result */}
            {orderResult && (
              <div className="mt-8 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  {getStatusIcon(orderResult.status)}
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Pedido #{orderResult.orderNumber}
                    </h3>
                    <p className="text-primary font-medium">{orderResult.statusText}</p>
                  </div>
                </div>

                {orderResult.estimatedDelivery && (
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Previsão de entrega:</span>{' '}
                      {orderResult.estimatedDelivery}
                    </p>
                  </div>
                )}

                {orderResult.items && orderResult.items.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground mb-2">Itens:</p>
                    <ul className="space-y-1">
                      {orderResult.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Status Timeline */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div className={`flex flex-col items-center ${orderResult.status === 'pending' || orderResult.status === 'processing' || orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderResult.status === 'pending' || orderResult.status === 'processing' || orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs mt-1">Recebido</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${orderResult.status === 'processing' || orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex flex-col items-center ${orderResult.status === 'processing' || orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderResult.status === 'processing' || orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-xs mt-1">Preparando</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex flex-col items-center ${orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderResult.status === 'shipped' || orderResult.status === 'delivered' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-xs mt-1">Enviado</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${orderResult.status === 'delivered' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex flex-col items-center ${orderResult.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderResult.status === 'delivered' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs mt-1">Entregue</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MeuPedido;
