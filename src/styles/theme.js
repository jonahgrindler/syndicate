import React, {createContext, useContext, useState} from 'react';

const ThemeContext = createContext({
  primaryColor: '#007bff', // Default primary color
  secondaryColor: '#6c757d', // Default secondary color
  setTheme: () => {}, // Placeholder for function to update theme
});

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
  });

  const handleSetTheme = (primaryColor, secondaryColor) => {
    setTheme({primaryColor, secondaryColor});
  };

  return (
    <ThemeContext.Provider value={{...theme, setTheme: handleSetTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const colors = {
  primary: '#3A4048',
  slate: '#3A4048',
  grey: '#5C6673',
  secondaryText: 'rgba(58,64,72,0.4)',
  bgLight: 'rgba(58,64,72,0.05)',
  background: '#ffffff',
  error: '#ff4757',
  dark: {
    primary: '#fff',
    slate: '#3A4048',
    grey: '#5C6673',
    secondaryText: 'rgba(255,255,255,0.4)',
    bgLight: 'rgba(58,64,72,0.05)',
    background: '#000',
    error: '#ff4757',
    line: 'rgba(184,192,204,0.14)',
  },
};

export const fonts = {
  regular: 'OpenSans-Regular',
  bold: 'OpenSans-Bold',
  size: {
    small: 13,
    medium: 15,
    large: 20,
  },
  weight: {
    regular: '400',
    bold: '600',
  },
};

export const spacing = {
  row: 44,
  rowDouble: 88,
  leftRightMargin: 16,
};

export const images = {
  size: {
    small: {
      width: 166,
      height: 166,
    },
    large: {
      width: 288,
      height: 331,
    },
  },
  radius: {
    small: 3,
  },
};
