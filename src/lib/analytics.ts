import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
};

export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

/**
 * Hook to track page views on route change.
 * Place in App or a top-level component inside BrowserRouter.
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};
