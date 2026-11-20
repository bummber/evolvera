// Must run before any schema parses: the page's CSP forbids eval, which
// zod would otherwise try for its fast path.
import './zod-config';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import { FavoritesApp } from './FavoritesApp';
import './admin.css';

const review = import.meta.env.DEV;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === '/favorites' ? (
      <FavoritesApp review={review} />
    ) : (
      <AdminApp review={review} />
    )}
  </StrictMode>,
);
