import { addDays, isToday, isTomorrow, format } from 'date-fns';

// Define a reusable type for date and time
export type DateTime = {
  date: number | null; // Unix timestamp for the date
  time: number | null; // Minutes since midnight for the time
};

export const translateToDateTime = (input: string): DateTime => {
  const now = new Date();
  const lowerInput = input.toLowerCase();

  let date: number | null = null;
  let time: number | null = null;

  if (lowerInput.includes("tomorrow")) {
    date = addDays(now, 1).getTime();
  } else if (lowerInput.includes("today")) {
    date = now.getTime();
  }

  if (lowerInput.includes("morning")) {
    time = 9 * 60; // 9:00 AM in minutes since midnight
  } else if (lowerInput.includes("afternoon")) {
    time = 15 * 60; // 3:00 PM
  } else if (lowerInput.includes("evening")) {
    time = 19 * 60; // 7:00 PM
  } else if (lowerInput.includes("night")) {
    time = 21 * 60; // 9:00 PM
  } else if (lowerInput.includes("noon")) {
    time = 12 * 60; // 12:00 PM
  } else if (lowerInput.includes("midnight")) {
    time = 0; // 12:00 AM
  }

  return { date, time };
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
