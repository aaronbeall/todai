import { addDays, isToday, isTomorrow, format, formatDistanceToNow } from 'date-fns';

// Define a reusable type for date and time
export type DateTime = {
  date: number | null; // Unix timestamp for the date
  time: number | null; // Minutes since midnight for the time
  matchedWords: string[]; // Array of matched words or phrases
};

export const translateToDateTime = (input: string): DateTime => {
  const now = new Date();
  const lowerInput = input.toLowerCase();

  let date: number | null = null;
  let time: number | null = null;
  const matchedWords: string[] = [];

  if (lowerInput.includes("tomorrow")) {
    date = addDays(now, 1).getTime();
    matchedWords.push("tomorrow");
  } else if (lowerInput.includes("today")) {
    date = now.getTime();
    matchedWords.push("today");
  } else {
    const daysMatch = lowerInput.match(/(\d+) days?/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      date = addDays(now, days).getTime();
      matchedWords.push(`${days} days`);
    } else if (lowerInput.includes("next week")) {
      date = addDays(now, 7).getTime();
      matchedWords.push("next week");
    } else if (lowerInput.includes("next month")) {
      date = addDays(now, 30).getTime(); // Approximation for next month
      matchedWords.push("next month");
    } else if (lowerInput.includes("next year")) {
      date = addDays(now, 365).getTime(); // Approximation for next year
      matchedWords.push("next year");
    } else {
      const weeksMatch = lowerInput.match(/(\d+) weeks?/);
      if (weeksMatch) {
        const weeks = parseInt(weeksMatch[1], 10);
        date = addDays(now, weeks * 7).getTime();
        matchedWords.push(`${weeks} weeks`);
      } else {
        const monthsMatch = lowerInput.match(/(\d+) months?/);
        if (monthsMatch) {
          const months = parseInt(monthsMatch[1], 10);
          date = addDays(now, months * 30).getTime(); // Approximation for months
          matchedWords.push(`${months} months`);
        } else {
          const yearsMatch = lowerInput.match(/(\d+) years?/);
          if (yearsMatch) {
            const years = parseInt(yearsMatch[1], 10);
            date = addDays(now, years * 365).getTime(); // Approximation for years
            matchedWords.push(`${years} years`);
          }
        }
      }
    }
  }

  if (lowerInput.includes("morning")) {
    time = 9 * 60; // 9:00 AM in minutes since midnight
    matchedWords.push("morning");
  } else if (lowerInput.includes("afternoon")) {
    time = 15 * 60; // 3:00 PM
    matchedWords.push("afternoon");
  } else if (lowerInput.includes("evening")) {
    time = 19 * 60; // 7:00 PM
    matchedWords.push("evening");
  } else if (lowerInput.includes("night")) {
    time = 21 * 60; // 9:00 PM
    matchedWords.push("night");
  } else if (lowerInput.includes("noon")) {
    time = 12 * 60; // 12:00 PM
    matchedWords.push("noon");
  } else if (lowerInput.includes("midnight")) {
    time = 0; // 12:00 AM
    matchedWords.push("midnight");
  }

  return { date, time, matchedWords };
};

export const translateToWords = (date: number | null, time: number | null): string => {
  let datePart = "";
  let timePart = "";

  if (date) {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      datePart = "today";
    } else if (isTomorrow(dateObj)) {
      datePart = "tomorrow";
    } else {
      datePart = format(dateObj, 'MM/dd/yyyy');
    }
  }

  if (time !== null) {
    if (time >= 5 * 60 && time < 12 * 60) {
      timePart = "morning";
    } else if (time >= 12 * 60 && time < 17 * 60) {
      timePart = "afternoon";
    } else if (time >= 17 * 60 && time < 21 * 60) {
      timePart = "evening";
    } else {
      timePart = "night";
    }
  }

  if (datePart && timePart) {
    return `${datePart} ${timePart}`;
  } else if (datePart) {
    return datePart;
  } else if (timePart) {
    return timePart;
  } else {
    return "unknown";
  }
};

export const formatRelativeTime = (date: number | null): string => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const combineDateAndTime = ({ date, time }: { date?: number | null; time?: number | null }): number | null => {
  if (!date && time == null) return null; // Adjusted null check for time

  // Treat the date as local time
  const dateObj = new Date();
  if (date != null) {
    dateObj.setFullYear(new Date(date).getUTCFullYear());
    dateObj.setMonth(new Date(date).getUTCMonth());
    dateObj.setDate(new Date(date).getUTCDate());
  }

  if (time != null) { // Ensured time is not null or undefined
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    dateObj.setHours(hours, minutes, 0, 0); // Set hours and minutes in local time
  } else {
    dateObj.setHours(0, 0, 0, 0); // Set to midnight if no time is provided
  }

  return dateObj.getTime();
};

export type DateTimeSetting = {
  day?: number;
  month?: number;
  year?: number;
  hour?: number;
  minute?: number;
}

export type DateTimeType = 'dateTime' | 'date' | 'time';

export const determineDateTimeType = (timestamp: number): DateTimeType => {
  const dateObj = new Date(timestamp);

  if (dateObj.getUTCFullYear() === 1970 && dateObj.getUTCMonth() === 0 && dateObj.getUTCDate() === 1) {
    return 'time'; // Unix epoch date with time
  }

  if (dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0 && dateObj.getUTCSeconds() === 0 && dateObj.getUTCMilliseconds() === 0) {
    return 'date'; // Date with no time
  }

  return 'dateTime'; // Date with time
};
