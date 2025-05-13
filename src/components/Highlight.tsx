import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getTitleColor, getSolidBackground } = useTheme();

  return (
    <Box
      component="span"
      sx={{
        backgroundColor: `${getSolidBackground()}66`,
        color: getTitleColor(),
        padding: '0 4px',
        borderRadius: '4px',
      }}
    >
      {children}
    </Box>
  );
};

export default Highlight;
