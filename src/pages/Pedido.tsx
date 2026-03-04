import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepProducts from '@/components/order/StepProducts';
import StepIdentify from '@/components/order/StepIdentify';
import StepRegister from '@/components/order/StepRegister';
import StepConfirmation from '@/components/order/StepConfirmation';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { supabase } from '@/integrations/supabase/client';

type Step = 'products' | 'identify' | 'register' | 'confirmation';

const stepLabels: Record<Step, string> = {
  products: 'Produtos',
  identify: 'Identificação',
  register: 'Cadastro',
  confirmation: 'Confirmação',
};

const Pedido = () => {
  const navigate = useNavigate();
  const { isLoggedIn, customerEmail: sessionEmail, login } = useCustomerSession();
  const [step, setStep] = useState<Step>('products');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerId, setCustomerId] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [customerName, setCustomerName] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const handleNextFromProducts = async () => {
    if (isLoggedIn && sessionEmail) {
      const { data } = await supabase
        .from('customers')
        .select('id, code, name')
        .eq('email', sessionEmail)
        .maybeSingle();
      if (data) {
        setCustomerId(data.id);
        setCustomerCode(data.code);
        setCustomerName(data.name);
        setStep('confirmation');
        return;
      }
    }
    setStep('identify');
  };

  const handleCustomerFound = (id: string, code: string, name: string) => {
    // After authentication, fetch email for session
    supabase.from('customers').select('email').eq('id', id).single().then(({ data }) => {
      login(data?.email || '', name, code);
    });
    setCustomerId(id);
    setCustomerCode(code);
    setCustomerName(name);
    setStep('confirmation');
  };

  const handleRegistered = (id: string, code: string, name: string) => {
    supabase.from('customers').select('email').eq('id', id).single().then(({ data }) => {
      login(data?.email || '', name, code);
    });
    setCustomerId(id);
    setCustomerCode(code);
    setCustomerName(name);
    setStep('confirmation');
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  const stepsOrder: Step[] = ['products', 'identify', 'confirmation'];
  const activeStepIndex = stepsOrder.indexOf(step === 'register' ? 'identify' : step);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="section-title mb-3">
                Faça seu <span className="section-title-accent">Pedido</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Selecione os produtos, identifique-se e finalize pelo WhatsApp.
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {stepsOrder.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i <= activeStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs font-heading uppercase tracking-wider hidden sm:inline ${
                    i <= activeStepIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {stepLabels[s]}
                  </span>
                  {i < stepsOrder.length - 1 && (
                    <div className={`w-8 h-0.5 ${i < activeStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Steps */}
            {step === 'products' && (
              <StepProducts
                quantities={quantities}
                onUpdateQuantity={updateQuantity}
                onNext={handleNextFromProducts}
              />
            )}
            {step === 'identify' && (
              <StepIdentify
                onBack={() => setStep('products')}
                onCustomerFound={handleCustomerFound}
                onRegister={() => setStep('register')}
              />
            )}
            {step === 'register' && (
              <StepRegister
                onBack={() => setStep('identify')}
                onRegistered={handleRegistered}
              />
            )}
            {step === 'confirmation' && (
              <StepConfirmation
                quantities={quantities}
                customerId={customerId}
                customerCode={customerCode}
                customerName={customerName}
                onBack={() => setStep('products')}
                onComplete={() => navigate('/')}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pedido;
