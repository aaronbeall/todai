import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, IconButton, TextField } from '@mui/material'; // Removed unused Grid import
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close'; // Add CloseIcon import
import { Tag } from '../db';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { translateToDateTime, formatRelativeTime, combineDateAndTime } from '../utils/dateTimeTranslator'; // Removed unused `combineDateAndTime` import.
import { useTheme } from '../contexts/ThemeContext';

interface AddTodoDialogProps {
  open: boolean;
  onClose: () => void;
  onAddTodo: (newTodo: { text: string; date: number | null }) => void; // Update onAddTodo to accept an object with text and date
  tags: Tag[]; // Add tags prop to pass available tags
}

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({
  open,
  onClose,
  onAddTodo,
  tags, // Removed timeOffset prop
}) => {
  const { getTitleColor } = useTheme(); // Use theme context

  const [newTodo, setNewTodo] = useState<string>(""); // Move newTodo state inside AddTodoDialog
  const [tagSuggestions, setTagSuggestions] = useState<{ name: string; highlight: string; isNew?: boolean }[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false); // State to toggle date-time picker
  const [selectedDate, setSelectedDate] = useState<number | null>(null); // State for selected date
  const [selectedTime, setSelectedTime] = useState<number | null>(null); // State for selected time
  const [matchedDateTimeWords, setMatchedDateTimeWords] = useState<string[]>([]); // State to store matched date-time words
  const inputRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedDate(null); // Reset the selected date when the dialog opens
      setSelectedTime(null); // Reset the selected time when the dialog opens
      setShowDateTimePicker(false); // Ensure the date-time picker is hidden when the dialog opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0); // Delay focus to ensure the element is rendered
    }
  }, [open]);

  useEffect(() => {
    if (!showDateTimePicker) {
      setSelectedDate(null); // Reset the selected date when the picker is hidden
      setSelectedTime(null); // Reset the selected time when the picker is hidden
    }
  }, [showDateTimePicker]);

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

    const parsedDateTime = translateToDateTime(textContent);
    if (parsedDateTime.date || parsedDateTime.time) {
      setSelectedDate(parsedDateTime.date);
      setSelectedTime(parsedDateTime.time);
      setShowDateTimePicker(true); // Show the date-time picker if a date or time is detected
    }
    setMatchedDateTimeWords(parsedDateTime.matchedWords); // Update matched date-time words state
  };

  const formatTagsInContent = (content: string) => {
    const div = document.createElement('div');
    content.split(/(#[^\s]+|\b\w+\b)/).forEach((part) => {
      const span = document.createElement('span');
      const matchingTag = part.startsWith('#') ? tags.find((tag) => tag.name === part) : null;

      if (matchingTag) {
        // Matching tag found
        span.style.backgroundColor = matchingTag.color;
        span.style.color = 'white';
        span.style.borderRadius = '9999px';
        span.style.padding = '0 4px';
        span.textContent = part;
      } else if (part.startsWith('#')) {
        // New tag input
        span.style.border = '1px dashed gray';
        span.style.color = 'gray';
        span.style.borderRadius = '9999px';
        span.style.padding = '0 4px';
        span.textContent = part;
      } else if (matchedDateTimeWords.includes(part)) {
        // Highlight matched date-time words in yellow
        span.style.backgroundColor = 'yellow';
        span.style.color = 'black';
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

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const timestamp = combineDateAndTime({ date: selectedDate, time: selectedTime });

      // console.log("Adding Todo:", newTodo, "with timestamp:", timestamp);
      // selectedDate && console.log("selectedDate", new Date(selectedDate)); // Log the date in local format
      // selectedTime && console.log("selectedTime", new Date(selectedTime)); // Log the time in local format
      // timestamp && console.log(new Date(timestamp)); // Log the date in local format

      onAddTodo({ text: newTodo, date: timestamp });
      setNewTodo(""); // Clear the input after adding
      setSelectedDate(null); // Reset the date picker
      setSelectedTime(null); // Reset the time picker
      onClose();
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = event.target.value.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 0, 0, 0, 0).getTime(); // Construct a local timestamp
    setSelectedDate(localDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const time = hours * 60 + minutes; // Convert to minutes since midnight
    setSelectedTime(time);
  };

  const getInputStyle = (value: number | null) => ({
    opacity: value === null ? 0.5 : 1, // Fade out if value is null
  });

  const formatDateForInput = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (minutes: number | null): string => {
    return minutes !== null
      ? `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`
      : '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          if (newTodo.trim()) {
            handleAddTodo();
          }
        } else if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'Tab' && tagSuggestions.length > 0) {
          e.preventDefault(); // Prevent default tab behavior
          handleTagSelect(tagSuggestions[0].name); // Automatically select the first suggested tag
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '2rem', color: getTitleColor() }}>
        🎉 Add a New Todo 📝
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: getTitleColor() }}>
          What do you want to accomplish today? 🌟
        </Typography>
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <ContentEditable
            innerRef={(ref: HTMLElement | null) => {
              inputRef.current = ref; // Assign the ref to inputRef
            }}
            autoFocus // Automatically focus the input on open
            html={formatTagsInContent(newTodo)}
            onChange={handleContentEditableChange}
            tagName="div"
            style={{
              paddingRight: '40px', // Add padding to prevent text overlap with the icon
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              outline: 'none',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              textAlign: 'left', // Align text to the left
              fontSize: '1.2rem', // Increase font size
            }}
          />
          <IconButton
            onClick={() => setShowDateTimePicker((prev) => !prev)}
            sx={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)', // Center the icon vertically
            }}
          >
            <AccessTimeIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            marginTop: 1,
            display: tagSuggestions.length > 0 ? 'none' : 'block', // Hide when there are tag suggestions
            color: 'gray',
            fontStyle: 'italic',
            fontSize: '0.9rem',
          }}
        >
          Example: "Finish the #project and review the #code"
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
        {showDateTimePicker && (
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: 2,
              marginTop: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                type="date"
                fullWidth
                value={formatDateForInput(selectedDate)} // Use helper function for date formatting
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                sx={getInputStyle(selectedDate)} // Apply dynamic style to fade when null
              />
              <TextField
                type="time"
                fullWidth
                value={formatTimeForInput(selectedTime)} // Use helper function for time formatting
                onChange={handleTimeChange}
                InputLabelProps={{ shrink: true }}
                sx={getInputStyle(selectedTime)} // Apply dynamic style to fade when null
              />
              <IconButton
                onClick={() => setShowDateTimePicker(false)}
                sx={{
                  color: 'red',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Add a relative time label under the date and time inputs */}
            {(selectedDate || selectedTime !== null) && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  marginTop: 1,
                  color: 'gray',
                  textAlign: 'center',
                }}
              >
                {(selectedDate || selectedTime) && formatRelativeTime(combineDateAndTime({ date: selectedDate, time: selectedTime })!)}
              </Typography>
            )}
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
          onClick={handleAddTodo} // Use the new handleAddTodo function
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', padding: '0.5rem 2rem', backgroundColor: getTitleColor() }}
        >
          ✅ Add Todo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTodoDialog;
