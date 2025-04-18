import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box } from '@mui/material';
import { addTodo, getTodos, deleteTodo } from './db';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const todosFromDB = await getTodos();
      setTodos(todosFromDB);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const tags = Array.from(newTodo.matchAll(/#\w+/g)).map((match) => match[0]);
      const todo = { text: newTodo, completed: false, tags };
      await addTodo(todo);
      setTodos(await getTodos());
      setNewTodo('');
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    setTodos(await getTodos());
  };

  const gradientBackground = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'linear-gradient(to right, #FFDEE9, #B5FFFC)';
    if (hour < 18) return 'linear-gradient(to right, #FF9A8B, #FF6A88, #FF99AC)';
    return 'linear-gradient(to right, #1E3C72, #2A5298)';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 2,
        background: gradientBackground(),
        color: 'white',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Todo List
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
        <Typography variant="h5">Incomplete Todos</Typography>
        <Stack spacing={2}>
          {todos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <Card key={todo.id}>
                <CardContent>
                  <Typography>{todo.text}</Typography>
                  <Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
        </Stack>
        <Typography variant="h5">Completed Todos</Typography>
        <Stack spacing={2}>
          {todos
            .filter((todo) => todo.completed)
            .map((todo) => (
              <Card key={todo.id}>
                <CardContent>
                  <Typography>{todo.text}</Typography>
                  <Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default App;
