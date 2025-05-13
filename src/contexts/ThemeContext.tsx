import React, { createContext, useContext, useState } from 'react';
import { getGradientBackground as originalGetGradientBackground, getTitleColor as originalGetTitleColor, getTimeOfDayEmoji as originalGetTimeOfDayEmoji, getHourOfDay, getForegroundColor as originalGetForegroundColor } from '../theme';

interface ThemeContextProps {
  timeOffset: number;
  setTimeOffset: (offset: number) => void;
  getGradientBackground: (timeOffset?: number) => string;
  getTitleColor: (timeOffset?: number) => string;
  getTimeOfDayEmoji: (timeOffset?: number) => string;
  getForegroundColor: (timeOffset?: number) => string;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeOffset, setTimeOffset] = useState(0);

  const getGradientBackground = () => originalGetGradientBackground(timeOffset);
  const getTitleColor = () => originalGetTitleColor(timeOffset);
  const getTimeOfDayEmoji = () => originalGetTimeOfDayEmoji(timeOffset);
  const getForegroundColor = () => originalGetForegroundColor(timeOffset);

  return (
    <ThemeContext.Provider
      value={{
        timeOffset,
        setTimeOffset,
        getGradientBackground,
        getTitleColor,
        getTimeOfDayEmoji,
        getForegroundColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
