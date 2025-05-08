
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import GlobalStyles from './styles.tsx';

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyles />
    <App />
  </>
);
