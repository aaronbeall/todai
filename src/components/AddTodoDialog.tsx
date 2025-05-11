import React, { useRef, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from '@mui/material';
import { getTitleColor } from '../theme';
import { Tag } from '../db';

interface AddTodoDialogProps {
  open: boolean;
  onClose: () => void;
  onAddTodo: () => void;
  newTodo: string;
  setNewTodo: (value: string) => void;
  timeOffset?: number; // Make timeOffset optional in AddTodoDialogProps
  tags: Tag[]; // Add tags prop to pass available tags
}

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({
  open,
  onClose,
  onAddTodo,
  newTodo,
  setNewTodo,
  timeOffset,
  tags, // Destructure tags prop
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagSuggestions, setTagSuggestions] = useState<{ name: string; highlight: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTodo(value);

    const match = value.match(/#(\w*)$/); // Match the last tag being typed
    if (match) {
      const query = match[1].toLowerCase();
      const suggestions = tags
        .filter((tag) => tag.name.toLowerCase().startsWith(`#${query}`))
        .sort((a, b) => {
          const aTime = a.lastUsedAt || a.createdAt; // Use lastUsedAt if available, fallback to createdAt
          const bTime = b.lastUsedAt || b.createdAt;
          return bTime - aTime;
        })
        .map((tag) => ({
          name: tag.name,
          highlight: query,
        }));
      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  };

  const handleTagSelect = (tag: string) => {
    const updatedText = newTodo.replace(/#(\w*)$/, `#${tag.slice(1)} `); // Replace only the last tag being typed
    setNewTodo(updatedText);
    setTagSuggestions([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
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
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <TextField
            variant="outlined"
            value={newTodo}
            onChange={handleInputChange}
            fullWidth
            inputRef={inputRef}
            autoFocus
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
          <Box
            sx={{
              position: 'absolute',
              top: '30px',
              left: '5px',
              width: '100%',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {newTodo.split(/(#[^\s]+)/).map((part, index) => {
              if (!part) return null; // Skip empty parts
              const matchingTag = part.startsWith('#') ? tags.find((tag) => tag.name === part) : null;
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    paddingX: 1,
                    paddingY: 0.5,
                    backgroundColor: matchingTag ? matchingTag.color : 'transparent',
                    border: part.startsWith('#') && !matchingTag ? '1px dashed gray' : 'none',
                    borderRadius: '9999px',
                    color: matchingTag ? 'white' : 'transparent',
                    marginRight: -1.5,
                    position: 'relative',
                  }}
                >
                  {part}
                  {!matchingTag && part.startsWith('#') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        backgroundColor: 'red',
                        color: 'white',
                        fontSize: '0.6rem',
                        padding: '0 4px',
                        borderRadius: '4px',
                      }}
                    >
                      new
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
        {tagSuggestions.length > 0 && (
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: 1,
              padding: 1,
            }}
          >
            {tagSuggestions.map(({ name, highlight }) => (
              <Box
                key={name}
                onClick={() => handleTagSelect(name)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  paddingX: 1,
                  paddingY: 0.5,
                  backgroundColor: tags.find((t) => t.name === name)?.color || '#f0f0f0', // Use tag background color
                  borderRadius: '9999px', // Pill-shaped
                  cursor: 'pointer',
                  color: 'white', // White text
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                {name.split(new RegExp(`(${highlight})`, 'i')).map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.toLowerCase() === highlight ? 'bold' : 'normal',
                      backgroundColor: part.toLowerCase() === highlight ? 'rgba(255, 255, 0, 0.7)' : 'transparent', // Semi-transparent yellow for better contrast
                      color: part.toLowerCase() === highlight ? 'black' : 'inherit', // Black text for highlighted portion
                    }}
                  >
                    {part}
                  </span>
                ))}
              </Box>
            ))}
          </Box>
        )}
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
