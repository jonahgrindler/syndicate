import React, {createContext, useContext, useState, useEffect} from 'react';
import {getSetting, saveSetting} from '../database';

const ThemeContext = createContext({
  primaryColor: '#54D6FD', // Default primary color
  secondaryColor: '#323232', // Default secondary color
  highlightColor: '#ffffff', // Default secondary color
  setTheme: (primaryColor, secondaryColor, highlightColor) => {}, // Placeholder for function to update theme
});

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState({
    primaryColor: '#54D6FD',
    secondaryColor: '#323232',
    highlightColor: '#ffffff',
  });

  const handleSetTheme = (primaryColor, secondaryColor, highlightColor) => {
    setTheme({primaryColor, secondaryColor, highlightColor});
    saveSetting('primaryColor', primaryColor);
    saveSetting('secondaryColor', secondaryColor);
    saveSetting('highlightColor', highlightColor);
  };

  useEffect(() => {
    const loadColorPalette = async () => {
      const primaryColor = await getSetting('primaryColor');
      const secondaryColor = await getSetting('secondaryColor');
      const highlightColor = await getSetting('highlightColor');
      if (primaryColor && secondaryColor) {
        handleSetTheme(primaryColor, secondaryColor, highlightColor);
      }
    };

    loadColorPalette();
  }, []);

  return (
    <ThemeContext.Provider value={{...theme, setTheme: handleSetTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const colors = {
  primary: '#54D6FD',
  secondary: '#323232',
  highlight: '#ffffff',
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
    nav: 22,
  },
  lineHeight: {
    nav: 26,
  },
  weight: {
    regular: '400',
    semibold: '600',
    bold: '700',
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
