import { useEffect } from 'react';

import { useLocation } from '@tanstack/react-router';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Rola suavemente para o topo quando a rota muda
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}
