import { Card, CardContent, Typography, Stack, IconButton, Chip, Checkbox } from '@mui/material';
import { Edit, Archive, Delete } from '@mui/icons-material';
import { Tag } from '../db';

interface TodoCardProps {
  id: number;
  text: string;
  tags: string[];
  completed: boolean;
  onEdit: (id: number) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onTagClick: (tagName: string) => void;
  tagData: Tag[];
}

const TodoCard = ({
  id,
  text,
  tags,
  completed,
  onEdit,
  onArchive,
  onDelete,
  onToggleComplete,
  onTagClick,
  tagData,
}: TodoCardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
        backdropFilter: 'blur(10px)', // Blur effect
        opacity: completed ? 0.6 : 1, // Faded effect for completed todos
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={() => onEdit(id)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => onArchive(id)}>
            <Archive />
          </IconButton>
          <IconButton onClick={() => onDelete(id)}>
            <Delete />
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox
            checked={completed}
            onChange={(e) => onToggleComplete(id, e.target.checked)}
            sx={{ color: completed ? 'green' : 'gray' }}
          />
          <Typography sx={{ textDecoration: completed ? 'line-through' : 'none' }}>
            {text}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
          {tags.map((tag) => {
            const tagObj = tagData.find((t) => t.name.toLowerCase() === tag.toLowerCase());
            return (
              <Chip
                key={tag}
                label={tag}
                onClick={() => onTagClick(tag)}
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
  );
};

export default TodoCard;
