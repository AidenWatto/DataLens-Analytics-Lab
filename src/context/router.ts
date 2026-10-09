import { useState, useEffect, useCallback } from 'react';

export type Page =
  | 'home'
  | 'workspace'
  | 'data'
  | 'visual'
  | 'relationships'
  | 'analysis'
  | 'decision'
  | 'insights'
  | 'reports'
  | 'student'
  | 'about';

export function useRouter() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    const hash = window.location.hash.slice(1) as Page;
    if (hash && isValidPage(hash)) {
      setPage(hash);
    }
    const handler = () => {
      const h = window.location.hash.slice(1) as Page;
      if (isValidPage(h)) {
        setPage(h);
      } else if (h.length === 0) {
        setPage('home');
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((p: Page) => {
    window.location.hash = p;
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  return { page, navigate };
}

function isValidPage(p: string): boolean {
  return ['home', 'workspace', 'data', 'visual', 'relationships', 'analysis', 'decision', 'insights', 'reports', 'student', 'about'].includes(p);
}
