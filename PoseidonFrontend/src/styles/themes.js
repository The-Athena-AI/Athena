// Theme Version 1: Greek-inspired theme
export const themeV1 = {
  light: {
    primary: {
      main: '#B89F65', // Warm Bronze
      light: '#CDA434', // Aged Gold
      dark: '#9c4a2f',  // Terracotta
    },
    secondary: {
      main: '#2E5A88', // Aegean Blue
      light: '#4b6b8a', // Lighter Aegean Blue
      dark: '#6B8E23', // Olive Green
    },
    background: {
      default: '#f8f9fa', // Soft Marble White
      paper: '#f5f0e6', // Warmer Marble White
      elevated: '#ffffff', // Pure White
    },
    text: {
      primary: '#2d3436', // Deep Charcoal Gray
      secondary: '#3a3a3a', // Slightly Lighter Charcoal
      disabled: '#666666'
    },
    border: {
      main: '#B89F65', // Warm Bronze
    },
    success: {
      main: '#6B8E23', // Olive Green
    },
    warning: {
      main: '#CDA434', // Aged Gold
    },
    error: {
      main: '#9c4a2f', // Terracotta
    }
  },
  dark: {
    primary: {
      main: '#8A2BE2', // Violet
      light: '#9B4BFF',
      dark: '#6B1FB3'
    },
    secondary: {
      main: '#C0C0C0', // Silver
      light: '#D3D3D3',
      dark: '#A9A9A9'
    },
    background: {
      default: '#000000', // Black
      paper: '#121212',
      elevated: '#242424'
    },
    text: {
      primary: '#FFFFFF', // White
      secondary: '#C0C0C0', // Silver
      disabled: '#666666'
    },
    border: {
      main: '#000000' // Black
    },
    success: {
      main: '#4CAF50'
    },
    warning: {
      main: '#FF9800'
    },
    error: {
      main: '#F44336'
    }
  }
};

// CSS Variables Generator
export const generateCSSVariables = (theme, mode) => {
  const selectedTheme = theme[mode];
  
  return `
    [data-theme="${mode}"] {
      --primary-main: ${selectedTheme.primary.main};
      --primary-light: ${selectedTheme.primary.light};
      --primary-dark: ${selectedTheme.primary.dark};
      
      --secondary-main: ${selectedTheme.secondary.main};
      --secondary-light: ${selectedTheme.secondary.light};
      --secondary-dark: ${selectedTheme.secondary.dark};
      
      --background-default: ${selectedTheme.background.default};
      --background-paper: ${selectedTheme.background.paper};
      --background-elevated: ${selectedTheme.background.elevated};
      
      --text-primary: ${selectedTheme.text.primary};
      --text-secondary: ${selectedTheme.text.secondary};
      --text-disabled: ${selectedTheme.text.disabled};
      
      --border-main: ${selectedTheme.border.main};
      
      --success-main: ${selectedTheme.success.main};
      --warning-main: ${selectedTheme.warning.main};
      --error-main: ${selectedTheme.error.main};
    }
  `;
};

export const THEME_OPTIONS = {
  GREEK: 'greek',
  GOLD_PURPLE: 'gold_purple',
  TEAL_CORAL: 'teal_coral',
  DEEP_BLUE: 'deep_blue'
};


// Theme context helper functions
export const getThemeTokens = (mode, selectedTheme = themeV1) => {
  return selectedTheme[mode];
};

export const applyTheme = (mode, selectedTheme = themeV1) => {
  const theme = getThemeTokens(mode, selectedTheme);
  document.documentElement.setAttribute('data-theme', mode);
  const cssVariables = generateCSSVariables(selectedTheme, mode);
  
  // Apply CSS variables
  const styleElement = document.createElement('style');
  styleElement.textContent = cssVariables;
  document.head.appendChild(styleElement);
  
  return theme;
};