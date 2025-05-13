import React, { useState } from 'react';
import { Paper, IconButton, Button, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

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
        <motion.div
          key={item.key}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: index * 10, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ delay: (items.length - 1 - index) * 0.1, duration: 0.3 }}
          style={{ position: 'absolute', width: '100%', zIndex: items.length - index }}
        >
          <Paper
            elevation={3 - index}
            sx={{
              padding: 2,
              borderRadius: 2,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              transform: `scale(${1 - index * 0.02}) rotate(${-index * 0.1}deg)`,
              filter: `brightness(${1 - index * 0.2})`,
              transition: 'all 0.3s ease',
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
        </motion.div>
      ))}
    </Stack>
  );
};

export default PaperStack;
