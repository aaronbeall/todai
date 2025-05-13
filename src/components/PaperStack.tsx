import React, { useState } from 'react';
import { Paper, IconButton, Button, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';

interface PaperStackProps {
  items: Array<{
    key: string; // Unique key for each item
    content: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
}

const PaperStack: React.FC<PaperStackProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);

  const handleDismiss = (key: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  return (
    <Stack sx={{ marginBottom: 4, position: 'relative' }}>
      {items.map((item, index) => (
        <Paper
          key={item.key} // Use the unique key for each item
          elevation={3 - index}
          sx={{
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            position: 'absolute',
            zIndex: items.length - index,
            transform: `scale(${1 - index * 0.02}) rotate(${-index * 0.1}deg)`,
            top: index * 10,
            left: 0,
            right: 0,
            filter: `brightness(${1 - index * 0.2})`,
            transition: 'all 0.3s ease, opacity 0.3s ease',
            opacity: 1,
          }}
        >
          {item.content}
          <div style={{ display: 'flex', gap: '8px' }}>
            {item.action && (
              <Button size="small" variant="contained" onClick={item.action.onClick}>
                {item.action.label}
              </Button>
            )}
            <IconButton size="small" onClick={() => handleDismiss(item.key)}>
              <Close />
            </IconButton>
          </div>
        </Paper>
      ))}
    </Stack>
  );
};

export default PaperStack;
