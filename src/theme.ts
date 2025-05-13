export const getHourOfDay = (timeOffset = 0) => {
  return (new Date().getHours() + timeOffset + 24) % 24; // Ensure hour is within 0-23
};

export const getGradientBackground = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return 'linear-gradient(to bottom, #1A1A2E, #16213E)'; // Early morning
  if (hour < 12) return 'linear-gradient(to bottom, #FF7E5F, #FEB47B)'; // Morning (reverted to original vibrant gradient)
  if (hour < 15) return 'linear-gradient(to bottom, #FFE0B2, #FFCC80)'; // Early afternoon (lightened)
  if (hour < 18) return 'linear-gradient(to bottom, #43C6AC, #F8FFAE)'; // Late afternoon
  if (hour < 21) return 'linear-gradient(to bottom, #5A3D6A, #A43931)'; // Evening (lightened for better text visibility)
  return 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)'; // Night
};

export const getSolidBackground = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#1A1A2E'; // Early morning
  if (hour < 12) return '#FF7E5F'; // Morning (reverted to original design)
  if (hour < 15) return '#FFE0B2'; // Early afternoon (lightened)
  if (hour < 18) return '#43C6AC'; // Late afternoon
  if (hour < 21) return '#5A3D6A'; // Evening (lightened for better text visibility)
  return '#0F2027'; // Night
};

export const getTitleColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#E94560'; // Early morning
  if (hour < 12) return '#0F3460'; // Morning
  if (hour < 15) return '#FF6F61'; // Early afternoon
  if (hour < 18) return '#2D4059'; // Late afternoon
  if (hour < 21) return '#ff6f61'; // Evening (brightened for better visibility)
  return '#287c9a'; // Night (brighter for contrast)
};

export const getForegroundColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#E94560'; // Early morning
  if (hour < 12) return '#0F3460'; // Morning
  if (hour < 15) return '#FF6F61'; // Early afternoon
  if (hour < 18) return '#2D4059'; // Late afternoon
  if (hour < 21) return '#ff8f8f'; // Evening (brightened for better visibility)
  return '#50c2ea'; // Night (brighter for contrast)
};

export const getPrimaryColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#E94560'; // Early morning
  if (hour < 12) return '#0F3460'; // Morning
  if (hour < 15) return '#FF6F61'; // Early afternoon
  if (hour < 18) return '#2D4059'; // Late afternoon
  if (hour < 21) return '#ff8f8f'; // Evening
  return '#50c2ea'; // Night (brighter for contrast)
};

export function getTimeOfDayEmoji(timeOffset = 0): string {
  const hour = getHourOfDay(timeOffset);
  if (hour >= 5 && hour < 12) return '☀️'; // Morning
  if (hour >= 12 && hour < 18) return '🌤️'; // Afternoon
  if (hour >= 18 && hour < 21) return '🌇'; // Evening
  return '🌙'; // Night
}
