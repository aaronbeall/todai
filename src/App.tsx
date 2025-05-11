import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge, ListItemButton, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Checkbox } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Add, MoreHoriz } from '@mui/icons-material';
import { addTodo, getTodos, getTags, Todo, Tag } from './db';
import { getGradientBackground, getTitleColor, getTimeOfDayEmoji } from './theme';
import './App.css';
import AddTodoDialog from './components/AddTodoDialog';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTodo, setNewTodo] = useState('');
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

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const tags = Array.from(newTodo.matchAll(/#\w+/g)).map((match) => match[0]);
      const todo: Todo = { 
        id: Date.now(), 
        text: newTodo, 
        tags, 
        status: 'active',
        createdAt: Date.now(), 
        priority: 'normal', 
        activity: [],
      };
      await addTodo(todo);
      setTodos(await getTodos());
      setTags(await getTags());
      setNewTodo('');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed };
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
            {getTimeOfDayEmoji(new Date().getHours() + timeOffset)}
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
        onAddTodo={handleAddTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
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
                  icon={<span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }} />}
                  checkedIcon={<span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                  }} />}
                  sx={{
                    padding: 0,
                  }}
                />
                <Typography
                  component="div" // Render Typography as a <div> instead of a <p>
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
                          sx={{ backgroundColor: tagColor, color: 'white', marginLeft: 0.5, marginRight: 0.5 }}
                        />
                      );
                    }
                    return part;
                  })}
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
