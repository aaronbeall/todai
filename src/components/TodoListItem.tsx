import { Box, Typography, Checkbox, Chip, IconButton, Tooltip } from '@mui/material';
import { RadioButtonUnchecked as RadioButtonUncheckedIcon, CheckCircle as CheckCircleIcon, MoreHoriz, CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate, formatRelativeTime } from '../utils/dateTimeTranslator';
import { Todo, Tag } from '../db';
import tinycolor from 'tinycolor2';

export const TodoListItem = ({
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
        opacity: todo.status === 'completed' ? 0.5 : 1, // Add opacity for completed items
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
                    border: `1px solid ${tinycolor(tagColor).darken().toString()}`, // Use theme primary color with opacity
                    backgroundColor: tagColor,
                    color: 'white',
                    marginLeft: 0.5,
                    marginRight: 0.5,
                    textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
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