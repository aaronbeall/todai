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
  );
};