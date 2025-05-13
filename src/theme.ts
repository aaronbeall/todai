const defaultTheme = {
  earlyMorning: {
    gradientBackground: 'linear-gradient(to bottom, #1A1A2E, #16213E)',
    solidBackground: '#1A1A2E',
    titleColor: '#E94560',
    primaryColor: '#E94560',
    secondaryColor: '#E76A7A', // Subtle version of primaryColor
    emoji: '🌙',
  },
  morning: {
    gradientBackground: 'linear-gradient(to bottom, #FF7E5F, #FEB47B)',
    solidBackground: '#FF7E5F',
    titleColor: '#0F3460',
    primaryColor: '#0F3460',
    secondaryColor: '#0E2F50', // Subtle version of primaryColor
    emoji: '☀️',
  },
  earlyAfternoon: {
    gradientBackground: 'linear-gradient(to bottom, #FFE0B2, #FFCC80)',
    solidBackground: '#FFE0B2',
    titleColor: '#FF6F61',
    primaryColor: '#ff4c3a',
    secondaryColor: '#E64530', // Subtle version of primaryColor
    emoji: '🌤️',
  },
  lateAfternoon: {
    gradientBackground: 'linear-gradient(to bottom, #43C6AC, #F8FFAE)',
    solidBackground: '#43C6AC',
    titleColor: '#2D4059',
    primaryColor: '#2D4059',
    secondaryColor: '#24384A', // Subtle version of primaryColor
    emoji: '🌤️',
  },
  evening: {
    gradientBackground: 'linear-gradient(to bottom, #5A3D6A, #A43931)',
    solidBackground: '#5A3D6A',
    titleColor: '#ff6f61',
    primaryColor: '#ff8f8f',
    secondaryColor: '#E67A7A', // Subtle version of primaryColor
    emoji: '🌇',
  },
  night: {
    gradientBackground: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)',
    solidBackground: '#0F2027',
    titleColor: '#287c9a',
    primaryColor: '#50c2ea',
    secondaryColor: '#3F9AC0', // Subtle version of primaryColor
    emoji: '🌙',
  },
};

export const getHourOfDay = (timeOffset = 0) => {
  return (new Date().getHours() + timeOffset + 24) % 24; // Ensure hour is within 0-23
};

export const getThemeProperty = (property: keyof typeof defaultTheme.earlyMorning, timeOffset = 0) => {
  const hour = getHourOfDay(timeOffset);
  if (hour < 6) return defaultTheme.earlyMorning[property];
  if (hour < 12) return defaultTheme.morning[property];
  if (hour < 15) return defaultTheme.earlyAfternoon[property];
  if (hour < 18) return defaultTheme.lateAfternoon[property];
  if (hour < 21) return defaultTheme.evening[property];
  return defaultTheme.night[property];
};

export const getGradientBackground = (timeOffset = 0) => getThemeProperty('gradientBackground', timeOffset);
export const getSolidBackground = (timeOffset = 0) => getThemeProperty('solidBackground', timeOffset);
export const getTitleColor = (timeOffset = 0) => getThemeProperty('titleColor', timeOffset);
export const getPrimaryColor = (timeOffset = 0) => getThemeProperty('primaryColor', timeOffset);
export const getSecondaryColor = (timeOffset = 0) => getThemeProperty('secondaryColor', timeOffset);
export const getTimeOfDayEmoji = (timeOffset = 0) => getThemeProperty('emoji', timeOffset);
