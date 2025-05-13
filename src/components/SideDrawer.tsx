import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Chip, Badge } from '@mui/material';
import { Tag, Todo } from '../db';
import { useTheme } from '../contexts/ThemeContext';

export const SideDrawer = ({
  drawerOpen,
  setDrawerOpen,
  tags,
  selectedTag,
  setSelectedTag,
  todos,
}: {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  tags: Tag[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  todos: Todo[];
}) => {
  const { getTitleColor } = useTheme(); // Use getTitleColor from context

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
        },
      }}
    >
      <Box sx={{ width: 280, padding: 3 }}> {/* Increased width and padding for better spacing */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: getTitleColor(),
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
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
              borderRadius: 2, // Rounded corners for better aesthetics
              '&.Mui-selected': {
                backgroundColor: getTitleColor(),
                color: 'white',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <span
                role="img"
                aria-label="all-items"
                style={{ fontSize: '1.5rem', color: selectedTag === null ? 'white' : 'inherit' }}
              >
                🌟
              </span>
            </ListItemIcon>
            <ListItemText primary="All" sx={{ fontWeight: selectedTag === null ? 'bold' : 'normal' }} />
          </ListItemButton>
          {tags.map((tag) => {
            const incompleteCount = todos.filter(
              (todo) =>
                todo.status !== 'completed' &&
                todo.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
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
                  borderRadius: 2, // Rounded corners for better aesthetics
                  '&.Mui-selected': {
                    backgroundColor: getTitleColor(),
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <ListItemIcon>
                  <Chip
                    sx={{
                      backgroundColor: tag.color,
                      width: 28, // Slightly larger for better visibility
                      height: 28,
                      borderRadius: '50%',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={tag.name}
                  sx={{ fontWeight: selectedTag?.toLowerCase() === tag.name.toLowerCase() ? 'bold' : 'normal' }}
                />
                <Badge
                  badgeContent={incompleteCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: 'red',
                      color: 'white',
                      fontSize: '0.75rem',
                      minWidth: 20,
                      height: 20,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};