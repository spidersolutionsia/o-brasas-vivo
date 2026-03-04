import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const EMAIL_KEY = 'customer_email';
const NAME_KEY = 'customer_name';
const CODE_KEY = 'customer_code';

interface CustomerSessionContextType {
  customerEmail: string | null;
  customerName: string | null;
  customerCode: string | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string, code?: string) => void;
  logout: () => void;
}

const CustomerSessionContext = createContext<CustomerSessionContextType | null>(null);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerCode, setCustomerCode] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    const storedName = localStorage.getItem(NAME_KEY);
    const storedCode = localStorage.getItem(CODE_KEY);
    if (storedEmail) setCustomerEmail(storedEmail);
    if (storedName) setCustomerName(storedName);
    if (storedCode) setCustomerCode(storedCode);

    if (storedEmail && !storedName) {
      supabase
        .from('customers')
        .select('name, code')
        .eq('email', storedEmail)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.name) {
            localStorage.setItem(NAME_KEY, data.name);
            setCustomerName(data.name);
          }
          if (data?.code) {
            localStorage.setItem(CODE_KEY, data.code);
            setCustomerCode(data.code);
          }
        });
    }
  }, []);

  const login = useCallback((email: string, name?: string, code?: string) => {
    localStorage.setItem(EMAIL_KEY, email);
    setCustomerEmail(email);
    if (name) {
      localStorage.setItem(NAME_KEY, name);
      setCustomerName(name);
    }
    if (code) {
      localStorage.setItem(CODE_KEY, code);
      setCustomerCode(code);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(CODE_KEY);
    setCustomerEmail(null);
    setCustomerName(null);
    setCustomerCode(null);
  }, []);

  return (
    <CustomerSessionContext.Provider value={{ customerEmail, customerName, customerCode, isLoggedIn: !!customerEmail, login, logout }}>
      {children}
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession() {
  const ctx = useContext(CustomerSessionContext);
  if (!ctx) throw new Error('useCustomerSession must be used within CustomerSessionProvider');
  return ctx;
}
