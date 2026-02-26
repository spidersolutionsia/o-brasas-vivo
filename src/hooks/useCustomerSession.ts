import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'customer_code';

export function useCustomerSession() {
  const [customerCode, setCustomerCode] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCustomerCode(stored);
  }, []);

  const login = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setCustomerCode(code);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCustomerCode(null);
  }, []);

  return { customerCode, isLoggedIn: !!customerCode, login, logout };
}
