import { useState } from 'react';

interface ViaCepResult {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function useViaCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResult = await res.json();

      if (data.erro) {
        setError('CEP não encontrado.');
        return null;
      }

      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: `${data.localidade}/${data.uf}`,
      };
    } catch {
      setError('Erro ao buscar CEP.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAddress, loading, error };
}
