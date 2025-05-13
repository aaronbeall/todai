import React from 'react';
import { Paper, IconButton, Button, Stack } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

interface PaperStackProps {
  items: Array<{
    content: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
    dismissible?: boolean;
    onDismiss?: () => void;
  }>;
}

const PaperStack: React.FC<PaperStackProps> = ({ items }) => {
  return (
    <Stack sx={{ marginBottom: 4, position: 'relative' }}>
      {items.map((item, index) => (
        <Paper
          key={index}
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
            transform: `scale(${1 - index * 0.02}) rotate(${-index * .1}deg)`,
            top: index * 10,
            // top: 0,
            backgroundColor: '#ffffff',
            // opacity: .5,
            left: 0,
            right: 0,
            filter: `brightness(${1 - index * 0.2})`,
          }}
        >
          {item.content}
          <div style={{ display: 'flex', gap: '8px' }}>
            {item.action && (
              <Button size="small" variant="contained" onClick={item.action.onClick}>
                {item.action.label}
              </Button>
            )}
            {item.dismissible && (
              <IconButton size="small" onClick={item.onDismiss}>
                <MoreHoriz />
              </IconButton>
            )}
          </div>
        </Paper>
      ))}
    </Stack>
  );
};

export default PaperStack;
