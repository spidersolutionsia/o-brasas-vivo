import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const EMAIL_KEY = 'customer_email';
const NAME_KEY = 'customer_name';

interface CustomerSessionContextType {
  customerEmail: string | null;
  customerName: string | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const CustomerSessionContext = createContext<CustomerSessionContextType | null>(null);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    const storedName = localStorage.getItem(NAME_KEY);
    if (storedEmail) setCustomerEmail(storedEmail);
    if (storedName) setCustomerName(storedName);

    // Clean up legacy key
    localStorage.removeItem('customer_code');

    if (storedEmail && !storedName) {
      supabase
        .from('customers')
        .select('name')
        .eq('email', storedEmail)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.name) {
            localStorage.setItem(NAME_KEY, data.name);
            setCustomerName(data.name);
          }
        });
    }
  }, []);

  const login = useCallback((email: string, name?: string) => {
    localStorage.setItem(EMAIL_KEY, email);
    setCustomerEmail(email);
    if (name) {
      localStorage.setItem(NAME_KEY, name);
      setCustomerName(name);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
    setCustomerEmail(null);
    setCustomerName(null);
  }, []);

  return (
    <CustomerSessionContext.Provider value={{ customerEmail, customerName, isLoggedIn: !!customerEmail, login, logout }}>
      {children}
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession() {
  const ctx = useContext(CustomerSessionContext);
  if (!ctx) throw new Error('useCustomerSession must be used within CustomerSessionProvider');
  return ctx;
}
