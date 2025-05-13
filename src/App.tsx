import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Stack, Card, CardContent, Typography, Box, IconButton, Drawer, List, ListItem, ListItemText, Chip, ListItemIcon, Badge, ListItemButton, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Checkbox, Alert, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Add, MoreHoriz } from '@mui/icons-material';
import { addTodo, getTodos, getTags, Todo, Tag } from './db';
import './App.css';
import AddTodoDialog from './components/AddTodoDialog';
import { formatRelativeTime, formatDate } from './utils/dateTimeTranslator'; // Import relative time formatter and formatDate function
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import Material-UI calendar icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the Material-UI CheckCircle icon
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // Import Material-UI RadioButtonUnchecked icon
import { SideDrawer } from './components/SideDrawer';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip from Material-UI
import { sortAndCategorizeTodos } from './utils/todoSorter'; // Import the sorting utility
import PaperStack from './components/PaperStack';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { getGradientBackground, getSolidBackground, getTitleColor, getTimeOfDayEmoji, timeOffset, setTimeOffset, getPrimaryColor, getSecondaryColor } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [useSolidBackground, setUseSolidBackground] = useState(false); // State to toggle background type

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

  const categorizedTodos = sortAndCategorizeTodos(
    todos
      .filter((todo) => todo.status === 'active') // Only active todos
      .filter((todo) => !selectedTag || todo.tags.includes(selectedTag)) // Filter by selectedTag if applicable
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 2,
        background: useSolidBackground ? getSolidBackground() : getGradientBackground(),
        transition: 'background 3s ease',
        color: getPrimaryColor(), // Use primary color for text
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: 16, left: 16, color: getPrimaryColor() }} // Use primary color for icon
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <SideDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        tags={tags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        todos={todos}
      />
      
      <Typography
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: '0.9rem',
          opacity: 0.7,
          color: getSecondaryColor(), // Use secondary color for specific text
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
              color: getTitleColor(),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <Checkbox
              checked={useSolidBackground}
              onChange={(e) => setUseSolidBackground(e.target.checked)}
            />
            <Typography>Use Solid Background</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTimeDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ color: getTitleColor(), display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {getSimulatedDay()}
          <span role="img" aria-label="time-of-day">
            {getTimeOfDayEmoji()}
          </span>
        </Typography>
        <IconButton
          onClick={handleDialogOpen}
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

      <PaperStack
        items={[
          {
            key: '1',
            content: '🌟 Make the most of your day! Start with what matters most. 🌟',
          },
          {
            key: '2',
            content: '💡 Tip: Review your "Next" tasks to plan ahead.',
            action: {
              label: 'View Next',
              onClick: () => console.log('Navigated to Next tasks'),
            },
          },
          {
            key: '3',
            content: '🎯 Focus on completing at least one "Now" task today.',
            action: {
              label: 'View Now',
              onClick: () => console.log('Navigated to Now tasks'),
            },
          },
        ]}
      />

      {/* Spacer to ensure lists appear below the PaperStack */}
      <Box sx={{ height: 75 }} />

      <AddTodoDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onAddTodo={(todoData) => handleAddTodo(todoData)} // Adjust to match the updated handler
        tags={tags} // Pass tags from App.tsx to AddTodoDialog
      />

      <Typography variant="h4" sx={{ marginBottom: 2, color: getTitleColor() }}>Now</Typography>
      <Box sx={{ padding: 2, backgroundColor: `rgba(0, 0, 0, 0.05)`, borderRadius: 2 }}>
        <Stack spacing={1}>
          {categorizedTodos.now.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              tags={tags}
              handleToggleComplete={handleToggleComplete}
            />
          ))}
        </Stack>
      </Box>

      <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 4, color: getTitleColor() }}>Next</Typography>
      <Box sx={{ padding: 2, backgroundColor: `rgba(0, 0, 0, 0.05)`, borderRadius: 2 }}>
        <Stack spacing={1}>
          {categorizedTodos.next.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              tags={tags}
              handleToggleComplete={handleToggleComplete}
            />
          ))}
        </Stack>
      </Box>

      <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 4, color: getTitleColor() }}>Later</Typography>
      <Box sx={{ padding: 2, backgroundColor: `rgba(0, 0, 0, 0.05)`, borderRadius: 2 }}>
        <Stack spacing={1}>
          {categorizedTodos.later.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              tags={tags}
              handleToggleComplete={handleToggleComplete}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default App;

const TodoListItem = ({
  todo,
  tags,
  handleToggleComplete,
}: {
  todo: Todo;
  tags: Tag[];
  handleToggleComplete: (id: number, completed: boolean) => void;
}) => {
  const { getPrimaryColor, getSecondaryColor } = useTheme(); // Use useTheme to get primary color

  return (
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
          icon={<RadioButtonUncheckedIcon style={{ fontSize: '20px', color: getPrimaryColor() }} />} // Use primary color
          checkedIcon={<CheckCircleIcon style={{ fontSize: '20px', color: getPrimaryColor() }} />} // Use primary color
          sx={{
            padding: 0,
          }}
        />
        <Typography
          component="div"
          sx={{
            textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
            color: getPrimaryColor(), // Use primary color
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
                    color: getPrimaryColor(), // Use primary color
                    marginLeft: 0.5,
                    marginRight: 0.5,
                  }}
                />
              );
            }
            return <span key={index}>{part}</span>;
          })}
          {todo.date && (
            <Tooltip title={todo.date != null ? formatDate(todo.date) : ''} arrow enterTouchDelay={0}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  border: `1px solid ${getSecondaryColor()}`, // Use theme primary color with opacity
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  marginLeft: 1,
                  color: `${getSecondaryColor()}`, // Use theme primary color with opacity
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
                  {todo.date != null && formatRelativeTime(todo.date)}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Typography>
      </Box>
      <IconButton onClick={() => console.log('Options menu clicked')} sx={{ color: getPrimaryColor() }}>
        <MoreHoriz />
      </IconButton>
    </Box>
  );
};