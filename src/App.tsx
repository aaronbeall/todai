import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Edit, Archive, Delete, Add } from '@mui/icons-material';
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

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const tags = Array.from(newTodo.matchAll(/#\w+/g)).map((match) => match[0]);
      const todo = { text: newTodo, completed: false, tags };
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

  const getCurrentDay = () => {
    return new Date().toLocaleDateString(undefined, { weekday: 'long' });
  };

  const filteredTodos = selectedTag
    ? todos.filter((todo) => todo.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
    : todos;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 2,
        background: getGradientBackground(),
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
              <ListItemText primary="All Todos" />
            </ListItemButton>
            {tags.map((tag) => {
              const incompleteCount = todos.filter(
                (todo) => !todo.completed && todo.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
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
          color: getTitleColor(),
        }}
      >
        {currentTime}
      </Typography>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ color: getTitleColor() }}
      >
        {getCurrentDay()}
      </Typography>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            variant="outlined"
            label="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: getTitleColor(),
                },
                '&:hover fieldset': {
                  borderColor: getTitleColor(),
                },
                '&.Mui-focused fieldset': {
                  borderColor: getTitleColor(),
                },
              },
              '& .MuiInputLabel-root': {
                color: getTitleColor(),
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: getTitleColor(),
              },
            }}
          />
          <IconButton
            onClick={handleAddTodo}
            sx={{
              backgroundColor: getTitleColor(),
              color: 'white',
              '&:hover': {
                backgroundColor: getTitleColor(),
                opacity: 0.9,
              },
            }}
          >
            <Add />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          {filteredTodos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.text}
                tags={todo.tags}
                completed={todo.completed}
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
            .filter((todo) => todo.completed)
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.text}
                tags={todo.tags}
                completed={todo.completed}
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
