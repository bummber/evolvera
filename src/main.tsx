import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/shell.css';
import './styles/components.css';
import './styles/today.css';
import './styles/gallery.css';
import './styles/detail.css';
import './styles/evolution.css';
import './styles/information.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
