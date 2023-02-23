import { differenceInDays, isDate, parse } from 'date-fns';

export function calculateDaysDifference(dateStr: string): number | null {
  const formatsToTry = [
    'eeee', // Day of the week (e.g. Monday)
    'MMM d', // Month and day (e.g. Feb 10)
  ];
  let parsedDate = null;
  for (const format of formatsToTry) {
    parsedDate = parse(dateStr, format, new Date());
    if (isDate(parsedDate)) {
      break;
    }
  }

  if (isDate(parsedDate)) {
    const daysDiff = differenceInDays(parsedDate, new Date());
    return daysDiff;
  } else {
    console.log(`Could not parse date string: ${dateStr}`);
    return null;
  }
}
