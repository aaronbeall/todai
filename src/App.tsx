import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Edit, Archive, Delete } from '@mui/icons-material';
import { addTodo, getTodos, deleteTodo, getTags, Todo, Tag } from './db';
import './App.css';

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
      await addTodo(todo); // This will also handle adding new tags to the database
      setTodos(await getTodos());
      setTags(await getTags()); // Refresh tags after adding new ones
      setNewTodo('');
    }
  };

  const handleEditTodo = (id: number) => {
    // Logic for editing a todo
    console.log(`Edit todo with id: ${id}`);
  };

  const handleArchiveTodo = (id: number) => {
    // Logic for archiving a todo
    console.log(`Archive todo with id: ${id}`);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(await getTodos());
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName);
  };

  const gradientBackground = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'linear-gradient(to bottom, #FFDEE9, #B5FFFC)';
    if (hour < 18) return 'linear-gradient(to bottom, #FF9A8B, #FF6A88, #FF99AC)';
    return 'linear-gradient(to bottom, #1E3C72, #2A5298)';
  };

  const getTitleColor = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '#FF6F91'; // Morning gradient matching color
    if (hour < 18) return '#FF3D68'; // Afternoon gradient matching color
    return '#A1C4FD'; // Evening gradient matching color
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
        background: gradientBackground(),
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
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tags
          </Typography>
          <List>
            <ListItem
              button
              onClick={() => setSelectedTag(null)}
              selected={selectedTag === null}
            >
              <ListItemText primary="All Todos" />
            </ListItem>
            {tags.map((tag) => {
              const incompleteCount = todos.filter(
                (todo) => !todo.completed && todo.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
              ).length;

              return (
                <ListItem
                  button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.name)}
                  selected={selectedTag?.toLowerCase() === tag.name.toLowerCase()}
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
                </ListItem>
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
        }}
      >
        {currentTime}
      </Typography>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ color: getTitleColor() }} // Set title color dynamically
      >
        {getCurrentDay()}
      </Typography>
      <Stack spacing={2}>
        <TextField
          variant="outlined"
          label="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddTodo}>
          Add Todo
        </Button>
        <Stack spacing={2}>
          {filteredTodos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <Card key={todo.id}>
                <CardContent sx={{ position: 'relative' }}>
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton onClick={() => handleEditTodo(todo.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleArchiveTodo(todo.id)}>
                      <Archive />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTodo(todo.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                  <Typography>{todo.text}</Typography>
                  <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                    {todo.tags.map((tag) => {
                      const tagObj = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
                      return (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={() => handleTagClick(tag)}
                          sx={{
                            backgroundColor: tagObj?.color || 'gray',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Stack>
        <Typography
          variant="h5"
          sx={{ color: getTitleColor() }} // Use dynamic color for "Completed" heading
        >
          Completed
        </Typography>
        <Stack spacing={2}>
          {filteredTodos
            .filter((todo) => todo.completed)
            .map((todo) => (
              <Card key={todo.id}>
                <CardContent sx={{ position: 'relative' }}>
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton onClick={() => handleEditTodo(todo.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleArchiveTodo(todo.id)}>
                      <Archive />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTodo(todo.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                  <Typography>{todo.text}</Typography>
                  <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                    {todo.tags.map((tag) => {
                      const tagObj = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
                      return (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={() => handleTagClick(tag)}
                          sx={{
                            backgroundColor: tagObj?.color || 'gray',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;
