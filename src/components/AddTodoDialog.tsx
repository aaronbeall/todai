import React, { useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Slider } from '@mui/material';
import { getTitleColor } from '../theme';

interface AddTodoDialogProps {
  open: boolean;
  onClose: () => void;
  onAddTodo: () => void;
  newTodo: string;
  setNewTodo: (value: string) => void;
  timeOffset: number;
  setTimeOffset: (value: number) => void;
}

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({
  open,
  onClose,
  onAddTodo,
  newTodo,
  setNewTodo,
  timeOffset,
  setTimeOffset,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          if (newTodo.trim()) {
            onAddTodo();
            setTimeout(onClose);
          }
        } else if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '2rem', color: getTitleColor(timeOffset) }}>
        🎉 Add a New Todo 📝
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: getTitleColor(timeOffset) }}>
          What do you want to accomplish today? 🌟
        </Typography>
        <TextField
          variant="outlined"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          fullWidth
          inputRef={inputRef}
          placeholder="e.g., Buy groceries #errands"
          sx={{
            marginTop: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: getTitleColor(timeOffset),
              },
              '&:hover fieldset': {
                borderColor: getTitleColor(timeOffset),
              },
              '&.Mui-focused fieldset': {
                borderColor: getTitleColor(timeOffset),
              },
            },
            '& .MuiInputLabel-root': {
              color: getTitleColor(timeOffset),
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: getTitleColor(timeOffset),
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ fontSize: '1rem', padding: '0.5rem 2rem' }}
        >
          ❌ Cancel
        </Button>
        <Button
          onClick={() => {
            onAddTodo();
            onClose();
          }}
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', padding: '0.5rem 2rem', backgroundColor: getTitleColor(timeOffset) }}
        >
          ✅ Add Todo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTodoDialog;
