import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material'; // Fix incorrect import
import { getTitleColor } from '../theme';
import { Tag } from '../db';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

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
  const [tagSuggestions, setTagSuggestions] = useState<{ name: string; highlight: string; isNew?: boolean }[]>([]);

  const handleContentEditableChange = (e: ContentEditableEvent) => {
    const div = document.createElement('div');
    div.innerHTML = e.target.value; // Parse the HTML content
    const textContent = div.textContent || ''; // Extract plain text
    setNewTodo(textContent);

    const match = textContent.match(/#(\w*)$/); // Match the last tag being typed
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
          isNew: false, // Default to not new
        }));

      // Add the new tag suggestion at the end of the list
      if (!tags.some((tag) => tag.name.toLowerCase() === `#${query}`) && query.trim() !== '') {
        suggestions.push({
          name: `#${query}`,
          highlight: query,
          isNew: true, // Mark as new
        });
      }

      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  };

  const formatTagsInContent = (content: string) => {
    const div = document.createElement('div');
    content.split(/(#[^\s]+)/).forEach((part) => {
      const span = document.createElement('span');
      const matchingTag = part.startsWith('#') ? tags.find((tag) => tag.name === part) : null;

      if (matchingTag) {
        span.style.backgroundColor = matchingTag.color;
        span.style.color = 'white';
        span.style.borderRadius = '9999px';
        span.style.padding = '0 4px';
        span.textContent = part;
      } else if (part.startsWith('#')) {
        span.style.border = '1px dashed gray';
        span.style.color = 'gray';
        span.style.borderRadius = '9999px';
        span.style.padding = '0 4px';
        span.textContent = part;
      } else {
        span.textContent = part;
      }

      div.appendChild(span);
    });

    return div.innerHTML;
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
      onKeyDown={(e: React.KeyboardEvent) => { // Add explicit type for the event parameter
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
          <ContentEditable
            html={formatTagsInContent(newTodo)}
            onChange={handleContentEditableChange}
            tagName="div"
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              minHeight: '40px',
              outline: 'none',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              textAlign: 'left', // Align text to the left
              fontSize: '1.2rem', // Increase font size
            }}
          />
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
            {tagSuggestions.map(({ name, highlight, isNew }) => (
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
                  color: isNew ? 'black' : 'white', // Black text for new tags
                  border: isNew ? '1px dotted black' : 'none', // Dotted outline for new tags
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                  position: 'relative',
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
                {isNew && (
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
                      userSelect: 'none', // Prevent editing
                      pointerEvents: 'none', // Prevent interaction
                    }}
                  >
                    new
                  </Box>
                )}
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
