// Must run before any schema parses: the page's CSP forbids eval, which
// zod would otherwise try for its fast path.
import './zod-config';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import './admin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp review={import.meta.env.DEV} />
  </StrictMode>,
);
