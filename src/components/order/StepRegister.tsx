import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useViaCep } from '@/hooks/useViaCep';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const baseSchema = z.object({
  name: z.string().trim().min(2, 'Campo obrigatório').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  ddd: z.string().regex(/^\d{2}$/, 'DDD inválido'),
  phone: z.string().regex(/^\d{8,9}$/, 'Telefone inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
  cep: z.string().regex(/^\d{8}$/, 'CEP inválido'),
  city: z.string().min(1, 'Cidade obrigatória'),
  neighborhood: z.string().min(1, 'Bairro obrigatório'),
  street: z.string().min(1, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
});

const cnpjSchema = z.string().regex(/^\d{14}$/, 'CNPJ inválido (14 dígitos)');

function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

interface Props {
  onBack: () => void;
  onRegistered: (id: string, name: string, email: string) => void;
}

type PersonType = 'pf' | 'pj';

const StepRegister = ({ onBack, onRegistered }: Props) => {
  const [personType, setPersonType] = useState<PersonType>('pf');
  const [form, setForm] = useState({
    name: '', email: '', ddd: '', phone: '',
    password: '', confirmPassword: '',
    cep: '', city: '', neighborhood: '', street: '', number: '', complement: '',
    cnpj: '',
  });
  const [cnpjDisplay, setCnpjDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fetchAddress, loading: cepLoading, error: cepError } = useViaCep();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCnpjChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    updateField('cnpj', digits);
    setCnpjDisplay(formatCnpj(digits));
  };

  const handleCepChange = async (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 8);
    updateField('cep', clean);
    if (clean.length === 8) {
      const addr = await fetchAddress(clean);
      if (addr) {
        setForm((prev) => ({
          ...prev,
          cep: clean,
          city: addr.city,
          neighborhood: addr.neighborhood,
          street: addr.street,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = baseSchema.safeParse(form);
    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
    }

    if (form.password !== form.confirmPassword) {
      fieldErrors.confirmPassword = 'As senhas não coincidem.';
    }

    if (personType === 'pj') {
      const cnpjResult = cnpjSchema.safeParse(form.cnpj);
      if (!cnpjResult.success) {
        fieldErrors.cnpj = cnpjResult.error.errors[0].message;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const { data: codeData, error: codeErr } = await supabase.rpc('generate_customer_code');
    if (codeErr || !codeData) {
      setErrors({ name: 'Erro ao gerar código. Tente novamente.' });
      setLoading(false);
      return;
    }

    const customerCode = codeData as string;
    const fullPhone = form.ddd + form.phone;

    const insertPayload: Record<string, unknown> = {
      code: customerCode,
      name: form.name,
      email: form.email,
      phone: fullPhone,
      password_hash: form.password, // trigger will hash this
      cep: form.cep,
      city: form.city,
      neighborhood: form.neighborhood,
      street: form.street,
      number: form.number,
      complement: form.complement || null,
      cnpj: personType === 'pj' ? form.cnpj : null,
    };

    const { data: insertData, error: insertErr } = await supabase
      .from('customers')
      .insert(insertPayload as any)
      .select('id')
      .single();

    setLoading(false);

    if (insertErr || !insertData) {
      if (insertErr?.message?.includes('customers_email_unique')) {
        setErrors({ email: 'Já existe um cadastro com esse email.' });
      } else if (insertErr?.message?.includes('customers_phone_unique')) {
        setErrors({ phone: 'Já existe um cadastro com esse telefone.' });
      } else if (insertErr?.message?.includes('customers_cnpj_unique')) {
        setErrors({ cnpj: 'Já existe um cadastro com esse CNPJ.' });
      } else {
        setErrors({ name: 'Erro ao salvar cadastro. Tente novamente.' });
      }
      return;
    }

    // Send welcome email (non-blocking)
    supabase.functions.invoke('send-welcome-email', {
      body: {
        customerName: form.name,
        customerEmail: form.email,
        customerCode,
      },
    }).catch((err) => console.error('Failed to send welcome email:', err));

    // Send customer_created webhook to n8n (non-blocking)
    fetch('https://n8n.spidersolutions.com.br/webhook/carvaomascatesite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'customer_created',
        customer_code: customerCode,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: fullPhone,
        customer_cnpj: personType === 'pj' ? form.cnpj : null,
        person_type: personType,
        customer_address: {
          street: form.street,
          number: form.number,
          complement: form.complement || null,
          neighborhood: form.neighborhood,
          city: form.city,
          cep: form.cep,
        },
        created_at: new Date().toISOString(),
      }),
    }).catch((err) => console.error('Failed to send customer_created webhook:', err));

    onRegistered(insertData.id, customerCode, form.name);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Person Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tipo de cadastro</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPersonType('pf')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                personType === 'pf'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              Pessoa Física
            </button>
            <button
              type="button"
              onClick={() => setPersonType('pj')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                personType === 'pj'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              Pessoa Jurídica
            </button>
          </div>
        </div>

        {/* CNPJ (only for PJ) */}
        {personType === 'pj' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">CNPJ *</label>
            <Input
              value={cnpjDisplay}
              onChange={(e) => handleCnpjChange(e.target.value)}
              placeholder="00.000.000/0000-00"
              className="h-11 bg-background border-border"
              maxLength={18}
            />
            {errors.cnpj && <p className="text-destructive text-xs mt-1">{errors.cnpj}</p>}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {personType === 'pj' ? 'Razão Social ou Nome Fantasia *' : 'Nome completo *'}
          </label>
          <Input
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder={personType === 'pj' ? 'Nome da empresa' : 'Seu nome'}
            className="h-11 bg-background border-border"
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
          <Input value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" placeholder="email@exemplo.com" className="h-11 bg-background border-border" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Telefone *</label>
          <div className="flex gap-2">
            <Input
              value={form.ddd}
              onChange={(e) => updateField('ddd', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="DDD"
              className="h-11 bg-background border-border w-20 text-center"
              maxLength={2}
            />
            <Input
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="999999999"
              className="h-11 bg-background border-border flex-1"
              maxLength={9}
            />
          </div>
          {(errors.ddd || errors.phone) && <p className="text-destructive text-xs mt-1">{errors.ddd || errors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Senha *</label>
          <div className="relative">
            <Input
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              className="h-11 bg-background border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Confirmar Senha *</label>
          <div className="relative">
            <Input
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              className="h-11 bg-background border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* CEP */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">CEP *</label>
          <Input
            value={form.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000000"
            className="h-11 bg-background border-border"
            maxLength={9}
          />
          {cepLoading && <p className="text-primary text-xs mt-1">Buscando endereço...</p>}
          {(cepError || errors.cep) && <p className="text-destructive text-xs mt-1">{cepError || errors.cep}</p>}
        </div>

        {/* City + Neighborhood */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Cidade *</label>
            <Input value={form.city} onChange={(e) => updateField('city', e.target.value)} className="h-11 bg-background border-border" />
            {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Bairro *</label>
            <Input value={form.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)} className="h-11 bg-background border-border" />
            {errors.neighborhood && <p className="text-destructive text-xs mt-1">{errors.neighborhood}</p>}
          </div>
        </div>

        {/* Street + Number + Complement */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Rua *</label>
          <Input value={form.street} onChange={(e) => updateField('street', e.target.value)} className="h-11 bg-background border-border" />
          {errors.street && <p className="text-destructive text-xs mt-1">{errors.street}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Número *</label>
            <Input value={form.number} onChange={(e) => updateField('number', e.target.value)} className="h-11 bg-background border-border" />
            {errors.number && <p className="text-destructive text-xs mt-1">{errors.number}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Complemento</label>
            <Input value={form.complement} onChange={(e) => updateField('complement', e.target.value)} placeholder="Opcional" className="h-11 bg-background border-border" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-fire rounded-lg w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>
      </form>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
    </div>
  );
};

export default StepRegister;
