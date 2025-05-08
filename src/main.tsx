
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import GlobalStyles from './styles.tsx';

// Initialize global styles
GlobalStyles();

createRoot(document.getElementById("root")!).render(
  <App />
);
