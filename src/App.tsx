import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge, ListItemButton, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Checkbox } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Add, MoreHoriz } from '@mui/icons-material';
import { addTodo, getTodos, getTags, Todo, Tag } from './db';
import { getGradientBackground, getTitleColor, getTimeOfDayEmoji } from './theme';
import './App.css';
import AddTodoDialog from './components/AddTodoDialog';
import { formatRelativeTime, splitDateAndTime } from './utils/dateTimeTranslator'; // Import relative time formatter
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import Material-UI calendar icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the Material-UI CheckCircle icon
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // Import Material-UI RadioButtonUnchecked icon

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodosAndTags = async () => {
      const todosFromDB = await getTodos();
      const tagsFromDB = await getTags();
      setTodos(todosFromDB);
      setTags(tagsFromDB);
    };
    fetchTodosAndTags();
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // Delay to ensure dialog is fully rendered

      return () => clearTimeout(timer);
    }
  }, [dialogOpen]);

  const handleAddTodo = async (todoData: { text: string; date: number | null }) => {
    const { text, date } = todoData;
    if (text.trim()) {
      const tags = Array.from(text.matchAll(/#\w+/g)).map((match) => match[0]);
      const todo: Todo = {
        id: Date.now(),
        text,
        tags,
        status: 'active',
        createdAt: Date.now(),
        priority: 'normal',
        activity: [],
        date: date || undefined, // Use the provided date or undefined if null
      };
      await addTodo(todo);
      setTodos(await getTodos());
      setTags(await getTags());
    }
  };

  // Fix the status type in handleToggleComplete to match the TodoStatus type
  const handleToggleComplete = async (id: number, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, status: completed ? 'completed' as const : 'active' as const }; // Ensure status matches TodoStatus type
      await addTodo(updatedTodo); // Update the todo in the database
      setTodos(await getTodos()); // Refresh the todos
    }
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleTimeClick = () => setTimeDialogOpen(true);
  const handleTimeDialogClose = () => setTimeDialogOpen(false);

  const getSimulatedTime = () => {
    const simulatedDate = new Date();
    simulatedDate.setHours(simulatedDate.getHours() + timeOffset);
    return simulatedDate.toLocaleTimeString();
  };

  const getSimulatedDay = () => {
    const simulatedDate = new Date();
    simulatedDate.setHours(simulatedDate.getHours() + timeOffset);
    return simulatedDate.toLocaleDateString(undefined, { weekday: 'long' });
  };

  const filteredTodos = selectedTag
    ? todos.filter((todo) => todo.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
    : todos;

  const relativeTimeLabel = (date: number | null) => {
    // return date ? new Date(date).toString() : "";
    return date ? formatRelativeTime(date) : '';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 2,
        background: getGradientBackground(timeOffset),
        color: 'white',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: 16, left: 16 }}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon style={{ color: 'white' }} />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white
            backdropFilter: 'blur(10px)', // Blur effect
          },
        }}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tags
          </Typography>
          <List>
            <ListItemButton
              onClick={() => setSelectedTag(null)}
              selected={selectedTag === null}
              sx={{
                textTransform: 'none',
                color: selectedTag === null ? 'white' : 'inherit',
                backgroundColor: selectedTag === null ? getTitleColor() : 'transparent',
                '&.Mui-selected': {
                  backgroundColor: getTitleColor(),
                  color: 'white',
                },
              }}
            >
              <ListItemIcon>
                <span role="img" aria-label="all-items" style={{ fontSize: '1.5rem', color: selectedTag === null ? 'white' : 'inherit' }}>🌟</span>
              </ListItemIcon>
              <ListItemText primary="All" />
            </ListItemButton>
            {tags.map((tag) => {
              const incompleteCount = todos.filter(
                (todo) => todo.status !== 'completed' && todo.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
              ).length;

              return (
                <ListItemButton
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.name)}
                  selected={selectedTag?.toLowerCase() === tag.name.toLowerCase()}
                  sx={{
                    textTransform: 'none',
                    color: selectedTag?.toLowerCase() === tag.name.toLowerCase() ? 'white' : 'inherit',
                    backgroundColor: selectedTag?.toLowerCase() === tag.name.toLowerCase() ? getTitleColor() : 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: getTitleColor(),
                      color: 'white',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Chip
                      sx={{
                        backgroundColor: tag.color,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={tag.name} />
                  <Badge
                    badgeContent={incompleteCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 'red',
                        color: 'white',
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Typography
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: '0.9rem',
          opacity: 0.7,
          color: getTitleColor(timeOffset),
          cursor: 'pointer',
        }}
        onClick={handleTimeClick}
      >
        {getSimulatedTime()}
      </Typography>

      <Dialog open={timeDialogOpen} onClose={handleTimeDialogClose}>
        <DialogTitle>Simulate Time Offset</DialogTitle>
        <DialogContent>
          <Slider
            value={timeOffset}
            onChange={(_, newValue) => setTimeOffset(newValue)} // Ignore `e` parameter
            min={-12}
            max={12}
            step={1}
            marks
            valueLabelDisplay="on"
            sx={{
              color: getTitleColor(timeOffset),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTimeDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ color: getTitleColor(timeOffset), display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {getSimulatedDay()}
          <span role="img" aria-label="time-of-day">
            {getTimeOfDayEmoji(timeOffset)}
          </span>
        </Typography>
        <IconButton
          onClick={handleDialogOpen}
          sx={{
            backgroundColor: getTitleColor(timeOffset),
            color: 'white',
            '&:hover': {
              backgroundColor: getTitleColor(timeOffset),
              opacity: 0.9,
            },
          }}
        >
          <Add />
        </IconButton>
      </Box>

      <AddTodoDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        timeOffset={timeOffset}
        onAddTodo={(todoData) => handleAddTodo(todoData)} // Adjust to match the updated handler
        tags={tags} // Pass tags from App.tsx to AddTodoDialog
      />

      <Box sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, boxShadow: 1 }}>
        <Stack spacing={1}>
          {filteredTodos.map((todo) => (
            <Box
              key={todo.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingY: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={todo.status === 'completed'}
                  onChange={() => handleToggleComplete(todo.id, todo.status !== 'completed')}
                  icon={<RadioButtonUncheckedIcon style={{ fontSize: '20px', color: 'white' }} />}
                  checkedIcon={<CheckCircleIcon style={{ fontSize: '20px', color: 'white' }} />}
                  sx={{
                    padding: 0,
                  }}
                />
                <Typography
                  component="div"
                  sx={{
                    textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                    color: 'white',
                  }}
                >
                  {todo.text.split(/(#[^\s]+)/g).map((part, index) => {
                    if (part.startsWith('#')) {
                      const tagColor = tags.find((tag) => tag.name === part)?.color || 'rgba(255, 255, 255, 0.3)';
                      return (
                        <Chip
                          key={index}
                          label={part}
                          size="small"
                          sx={{
                            backgroundColor: tagColor,
                            color: 'white',
                            marginLeft: 0.5,
                            marginRight: 0.5,
                          }}
                        />
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                  {todo.date && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '9999px',
                        padding: '2px 8px',
                        marginLeft: 1,
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{
                          fontSize: '1rem',
                          marginRight: '4px',
                          color: 'inherit',
                          alignSelf: 'center',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'inherit' }}
                      >
                        {relativeTimeLabel(todo.date)}
                      </Typography>
                    </Box>
                  )}
                </Typography>
              </Box>
              <IconButton onClick={() => console.log('Options menu clicked')} sx={{ color: 'white' }}>
                <MoreHoriz />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
