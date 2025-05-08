
// Add custom CSS variables for our application
export const GlobalStyles = () => {
  // Add CSS variables to the root element
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    :root {
      --sales-blue: #0EA5E9;
      --sales-purple: #9b87f5;
      --sales-orange: #F97316;
    }
  `;
  document.head.appendChild(styleElement);
  
  return null; // No UI to render
};

export default GlobalStyles;
