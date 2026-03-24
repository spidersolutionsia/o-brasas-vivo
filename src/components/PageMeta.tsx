import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
}

const BASE_URL = 'https://carvaomascate.com.br';
const SITE_NAME = 'Carvão Mascate';

const PageMeta = ({ title, description, path = '' }: PageMetaProps) => {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', `${BASE_URL}${path}`, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) canonical.href = `${BASE_URL}${path}`;

    return () => {
      document.title = `${SITE_NAME} | Mais Brasa, Menos Fumaça`;
    };
  }, [title, description, path]);

  return null;
};

export default PageMeta;
