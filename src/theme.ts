export const getGradientBackground = () => {
  const hour = new Date().getHours();
  if (hour < 6) return 'linear-gradient(to bottom, #2C3E50, #4CA1AF)'; // Early morning
  if (hour < 12) return 'linear-gradient(to bottom, #FFDEE9, #B5FFFC)'; // Morning
  if (hour < 15) return 'linear-gradient(to bottom, #FF9A8B, #FF6A88, #FF99AC)'; // Early afternoon
  if (hour < 18) return 'linear-gradient(to bottom, #FFD194, #D1913C)'; // Late afternoon
  if (hour < 21) return 'linear-gradient(to bottom, #1E3C72, #2A5298)'; // Evening
  return 'linear-gradient(to bottom, #141E30, #243B55)'; // Night
};

export const getTitleColor = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '#4CA1AF'; // Early morning matching color
  if (hour < 12) return '#FF6F91'; // Morning matching color
  if (hour < 15) return '#FF3D68'; // Early afternoon matching color
  if (hour < 18) return '#D1913C'; // Late afternoon matching color
  if (hour < 21) return '#2A5298'; // Evening matching color
  return '#243B55'; // Night matching color
};
