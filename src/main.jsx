import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { initFx } from './lib/fx.js';
import { initPwa } from './lib/pwa.js';
import { IN_APP, openLinksInBrowser } from './lib/platform.js';
import { trackEvent } from './lib/analytics.js';

initFx();
initPwa();
openLinksInBrowser();
if (IN_APP) trackEvent('app-open');

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
