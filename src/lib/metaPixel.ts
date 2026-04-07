declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const fbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
};

export const trackAddToCart = (productName: string, price: number, quantity: number) => {
  fbq('track', 'AddToCart', {
    content_name: productName,
    content_type: 'product',
    value: price * quantity,
    currency: 'BRL',
  });
};

export const trackPurchase = (orderNumber: string, items: { price: number; quantity: number }[]) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  fbq('track', 'Purchase', {
    content_type: 'product',
    value: total,
    currency: 'BRL',
    order_id: orderNumber,
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
};

export const trackInitiateCheckout = (numItems: number, totalValue: number) => {
  fbq('track', 'InitiateCheckout', {
    num_items: numItems,
    value: totalValue,
    currency: 'BRL',
  });
};

export const trackViewContent = (contentName: string) => {
  fbq('track', 'ViewContent', {
    content_name: contentName,
    content_type: 'product',
  });
};

export const trackLead = (customerName?: string) => {
  fbq('track', 'Lead', {
    content_name: customerName || 'Novo cadastro',
  });
};

export const trackCompleteRegistration = (customerName?: string) => {
  fbq('track', 'CompleteRegistration', {
    content_name: customerName || 'Login',
    status: true,
  });
};
