import React from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import { applyTheme, getSavedTheme } from './utils/theme.js';
import App from './App.jsx';
import './styles/main.scss';

applyTheme(getSavedTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
