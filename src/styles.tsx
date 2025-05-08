
import { createGlobalStyle } from 'styled-components';

// Add custom CSS variables for our application
export const GlobalStyles = createGlobalStyle`
  :root {
    --sales-blue: #0EA5E9;
    --sales-purple: #9b87f5;
    --sales-orange: #F97316;
  }
`;

export default GlobalStyles;
