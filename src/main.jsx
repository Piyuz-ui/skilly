import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { initFx } from './lib/fx.js';
import { initPwa } from './lib/pwa.js';

initFx();
initPwa();

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
