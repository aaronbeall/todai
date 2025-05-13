export const getHourOfDay = (timeOffset = 0) => {
  return (new Date().getHours() + timeOffset + 24) % 24; // Ensure hour is within 0-23
};

export const getGradientBackground = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return 'linear-gradient(to bottom, #2C3E50, #4CA1AF)'; // Early morning
  if (hour < 12) return 'linear-gradient(to bottom, #FFDEE9, #B5FFFC)'; // Morning
  if (hour < 15) return 'linear-gradient(to bottom, #FF9A8B, #FF6A88, #FF99AC)'; // Early afternoon
  if (hour < 18) return 'linear-gradient(to bottom, #FFD194, #D1913C)'; // Late afternoon
  if (hour < 21) return 'linear-gradient(to bottom, #1E3C72, #2A5298)'; // Evening
  return 'linear-gradient(to bottom, #141E30, #243B55)'; // Night
};

export const getSolidBackground = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#2C3E50'; // Early morning
  if (hour < 12) return '#FFDEE9'; // Morning
  if (hour < 15) return '#FF9A8B'; // Early afternoon
  if (hour < 18) return '#FFD194'; // Late afternoon
  if (hour < 21) return '#1E3C72'; // Evening
  return '#141E30'; // Night
};

export const getTitleColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#4CA1AF'; // Early morning matching color
  if (hour < 12) return '#FF6F91'; // Morning matching color
  if (hour < 15) return '#FF3D68'; // Early afternoon matching color
  if (hour < 18) return '#D1913C'; // Late afternoon matching color
  if (hour < 21) return '#2A5298'; // Evening matching color
  return '#243B55'; // Night matching color
};

export const getForegroundColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#AEEFFF'; // Early morning
  if (hour < 12) return '#075854'; // Morning
  if (hour < 15) return '#710c23'; // Early afternoon
  if (hour < 18) return '#420412'; // Late afternoon
  if (hour < 21) return '#d7ebff'; // Evening
  return '#d9ecff'; // Night
};

export const getPrimaryColor = (timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return '#0fd0ff'; // Early morning
  if (hour < 12) return '#00aba3'; // Morning
  if (hour < 15) return '#a70026'; // Early afternoon
  if (hour < 18) return '#9a0000'; // Late afternoon
  if (hour < 21) return '#6bb5ff'; // Evening
  return '#51a1f1'; // Night
};

export function getTimeOfDayEmoji(timeOffset = 0): string {
  const hour = getHourOfDay(timeOffset);
  if (hour >= 5 && hour < 12) return '☀️'; // Morning
  if (hour >= 12 && hour < 18) return '🌤️'; // Afternoon
  if (hour >= 18 && hour < 21) return '🌇'; // Evening
  return '🌙'; // Night
}
