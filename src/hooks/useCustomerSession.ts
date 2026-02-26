import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CODE_KEY = 'customer_code';
const NAME_KEY = 'customer_name';

export function useCustomerSession() {
  const [customerCode, setCustomerCode] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const storedCode = localStorage.getItem(CODE_KEY);
    const storedName = localStorage.getItem(NAME_KEY);
    if (storedCode) setCustomerCode(storedCode);
    if (storedName) setCustomerName(storedName);

    if (storedCode && !storedName) {
      supabase
        .from('customers')
        .select('name')
        .eq('code', storedCode)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.name) {
            localStorage.setItem(NAME_KEY, data.name);
            setCustomerName(data.name);
          }
        });
    }
  }, []);

  const login = useCallback((code: string, name?: string) => {
    localStorage.setItem(CODE_KEY, code);
    setCustomerCode(code);
    if (name) {
      localStorage.setItem(NAME_KEY, name);
      setCustomerName(name);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CODE_KEY);
    localStorage.removeItem(NAME_KEY);
    setCustomerCode(null);
    setCustomerName(null);
  }, []);

  return { customerCode, customerName, isLoggedIn: !!customerCode, login, logout };
}
