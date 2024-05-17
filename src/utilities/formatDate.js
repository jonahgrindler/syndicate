import {parse, parseISO, isValid, formatDistanceToNow} from 'date-fns';

const parseDateString = dateString => {
  const dateFormats = [
    "EEE, dd MMM yyyy HH:mm:ss 'GMT'", // For 'Thu, 16 May 2024 05:54:10 GMT'
    "yyyy-MM-dd'T'HH:mm:ssXXX", // For '2024-05-16T03:00:00-04:00'
    'yyyy-MM-dd', // For simple '2024-05-16'
  ];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return null; // or throw an Error depending on how you want to handle unparseable dates
};

const formatDate = dateString => {
  try {
    const date = parseDateString(dateString);
    // return format(date, 'dd MMM'); // 'PPpp' can be changed to any format you prefer
    // const date = parseISO(dateString);
    return formatDistanceToNow(date, {addSuffix: true});
  } catch (error) {
    console.error('Failed to format date:', error);
    return dateString; // return original date string if parsing fails
  }
};

export default formatDate;
