import ReactDOM, { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { StrictMode } from 'react';
import './index.css';

const container = document.getElementById('app');

const EntireApp = () => (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(<EntireApp />);
} else {
  hydrateRoot(container!, <EntireApp />);
}
