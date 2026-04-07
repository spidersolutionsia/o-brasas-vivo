import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageMeta from '@/components/PageMeta';
import StepRegister from '@/components/order/StepRegister';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { toast } from 'sonner';
import { trackLead } from '@/lib/metaPixel';

const Cadastro = () => {
  const navigate = useNavigate();
  const { login } = useCustomerSession();

  const handleRegistered = (id: string, name: string, email: string) => {
    login(email, name);
    trackLead(name);
    toast.success('Conta criada com sucesso!');
    navigate('/meus-pedidos');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageMeta title="Cadastro" description="Crie sua conta de revendedor Carvão Mascate e faça pedidos online." path="/cadastro" />
      <Header />
      <main className="flex-1 flex items-start justify-center pt-28 pb-16 px-4">
        <div className="w-full max-w-xl">
          <StepRegister onBack={() => navigate('/')} onRegistered={handleRegistered} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
