import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App.jsx';
import { registerWebMcpTools } from './webmcp.js';
import './index.css';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// Expose read-only site tools to in-browser AI agents (WebMCP). No-op when the
// browser has no document/navigator.modelContext; a failure must never break the page.
try {
  registerWebMcpTools();
} catch (err) {
  console.warn('WebMCP unavailable', err);
}
