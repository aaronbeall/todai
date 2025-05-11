import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge, ListItemButton, Dialog, DialogActions, DialogContent, DialogTitle, Slider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Edit, Archive, Delete, Add, ViewList } from '@mui/icons-material';
import { addTodo, getTodos, deleteTodo, getTags, Todo, Tag } from './db';
import { getGradientBackground, getTitleColor } from './theme';
import './App.css';
import TodoCard from './components/TodoCard';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
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

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
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
        touchedAt: Date.now(), 
        priority: 'now', 
        activity: [],
      };
      await addTodo(todo);
      setTodos(await getTodos());
      setTags(await getTags());
      setNewTodo('');
    }
  };

  const handleEditTodo = (id: number) => {
    console.log(`Edit todo with id: ${id}`);
  };

  const handleArchiveTodo = (id: number) => {
    console.log(`Archive todo with id: ${id}`);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(await getTodos());
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName);
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
          sx={{ color: getTitleColor(timeOffset) }}
        >
          {getSimulatedDay()}
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

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (newTodo.trim()) {
              handleAddTodo();
              setTimeout(handleDialogClose);
            }
          } else if (e.key === 'Escape') {
            handleDialogClose();
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
            onClick={handleDialogClose}
            variant="outlined"
            color="secondary"
            sx={{ fontSize: '1rem', padding: '0.5rem 2rem' }}
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddTodo();
              handleDialogClose();
            }}
            variant="contained"
            color="primary"
            sx={{ fontSize: '1rem', padding: '0.5rem 2rem', backgroundColor: getTitleColor(timeOffset) }}
          >
            ✅ Add Todo
          </Button>
        </DialogActions>
      </Dialog>

      <Stack spacing={2}>
        <Stack spacing={2}>
          {filteredTodos
            .filter((todo) => todo.status !== 'completed')
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.text}
                tags={todo.tags}
                completed={todo.status === 'completed'}
                onEdit={handleEditTodo}
                onArchive={handleArchiveTodo}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
                onTagClick={handleTagClick}
                tagData={tags}
              />
            ))}
        </Stack>
        <Typography
          variant="h5"
          sx={{ color: getTitleColor() }}
        >
          Completed
        </Typography>
        <Stack spacing={2}>
          {filteredTodos
            .filter((todo) => todo.status === 'completed')
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.text}
                tags={todo.tags}
                completed={todo.status === 'completed'}
                onEdit={handleEditTodo}
                onArchive={handleArchiveTodo}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
                onTagClick={handleTagClick}
                tagData={tags}
              />
            ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;
