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

// Theme Version 2: Teal, Coral, Sand
export const themeV2 = {
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
      paper: '#000000', // Black (matching background)
      elevated: '#8A2BE2', // Violet
      gradient: {
        start: '#000000',
        end: '#000000',
      }
    },
    text: {
      primary: '#FFFFFF', // White
      secondary: '#C0C0C0', // Silver
      disabled: '#666666'
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    shadow: 'rgba(0, 0, 0, 0.3)',
    action: {
      active: '#8A2BE2', // Violet
      hover: '#9B4BFF',
      selected: '#6B1FB3'
    },
    border: {
      main: '#000000' // Black (matching background)
    }
  },
  light: {
    primary: {
      main: '#87CEEB', // Sky Blue
      light: '#B0E2FF',
      dark: '#5F9EA0'
    },
    secondary: {
      main: '#556B2F', // Dark Green
      light: '#6B8E23',
      dark: '#3D4F21'
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#FFFFFF', // White (matching background)
      elevated: '#87CEEB', // Sky Blue
      gradient: {
        start: '#FFFFFF',
        end: '#FFFFFF',
      }
    },
    text: {
      primary: '#000000', // Black
      secondary: '#556B2F', // Dark Green
      disabled: '#999999'
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    shadow: 'rgba(0, 0, 0, 0.1)',
    action: {
      active: '#87CEEB', // Sky Blue
      hover: '#B0E2FF',
      selected: '#5F9EA0'
    },
    border: {
      main: '#FFFFFF' // White (matching background)
    }
  }
};

// Theme Version 3: Deep Blue, Amber, Slate
export const themeV3 = {
  dark: {
    primary: {
      main: '#1E88E5', // Deep Blue
      light: '#42A5F5',
      dark: '#1565C0'
    },
    secondary: {
      main: '#FFC107', // Amber
      light: '#FFD54F',
      dark: '#FFA000'
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
      elevated: '#2D2D2D',
      gradient: {
        start: '#121212',
        end: '#1E1E1E',
      }
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#78909C'
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    shadow: 'rgba(0, 0, 0, 0.3)',
    action: {
      active: '#1E88E5',
      hover: '#42A5F5',
      selected: '#1565C0'
    }
  },
  light: {
    primary: {
      main: '#87CEEB', // Sky Blue
      light: '#B0E2FF',
      dark: '#5F9EA0'
    },
    secondary: {
      main: '#E6E6FA', // Light Purple
      light: '#F0F0FF',
      dark: '#D8BFD8'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
      elevated: '#E9ECEF',
      gradient: {
        start: '#FFFFFF',
        end: '#F8F9FA',
      }
    },
    text: {
      primary: '#000000',
      secondary: '#6C757D',
      disabled: '#90A4AE'
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    shadow: 'rgba(0, 0, 0, 0.1)',
    action: {
      active: '#87CEEB',
      hover: '#B0E2FF',
      selected: '#5F9EA0'
    }
  }
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