import {parse, parseISO, isValid, formatDistanceToNow} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';

const timeZones = {
  PDT: 'America/Los_Angeles',
  PST: 'America/Los_Angeles',
  EDT: 'America/New_York',
  EST: 'America/New_York',
  CDT: 'America/Chicago',
  CST: 'America/Chicago',
  MDT: 'America/Denver',
  MST: 'America/Denver',
  // Add other time zones as needed
};

const parseDateWithTimeZone = (dateString, formatString) => {
  const tzAbbr = dateString.slice(-3);
  const timeZone = timeZones[tzAbbr];

  if (!timeZone) {
    return null;
  }

  const dateWithoutTz = dateString.slice(0, -4).trim();
  const parsedDate = parse(dateWithoutTz, formatString, new Date());

  if (isValid(parsedDate)) {
    return utcToZonedTime(parsedDate, timeZone);
  }

  return null;
};

const parseDateString = dateString => {
  const dateFormats = [
    "EEE, dd MMM yyyy HH:mm:ss 'GMT'", // For 'Thu, 16 May 2024 05:54:10 GMT'
    "yyyy-MM-dd'T'HH:mm:ssXXX", // For '2024-05-16T03:00:00-04:00'
    'yyyy-MM-dd', // For simple '2024-05-16'
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // e.g. 2024-05-16T03:00:00.000Z
    'EEE, dd MMM yyyy HH:mm:ss xx', // e.g. Thu, 16 May 2024 05:54:10 GMT
    'EEE, dd MMM yyyy HH:mm:ss xxxx', // e.g. Thu, 16 May 2024 05:54:10 +0000
  ];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }

    // Try parsing with timezone abbreviations
    const parsedDateWithTz = parseDateWithTimeZone(dateString, format);
    if (parsedDateWithTz) {
      return parsedDateWithTz;
    }
  }

  // Fallback to ISO parsing if all formats fail
  const isoDate = parseISO(dateString);
  if (isValid(isoDate)) {
    return isoDate;
  }

  return null; // or throw an Error depending on how you want to handle unparseable dates
};

const formatDate = dateString => {
  try {
    const date = parseDateString(dateString);
    if (!date) {
      throw new Error('Invalid date');
    }
    return formatDistanceToNow(date, {addSuffix: true});
  } catch (error) {
    console.error('Failed to format date:', dateString, error);
    return dateString; // return original date string if parsing fails
  }
};

export default formatDate;
