type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export function formatTimestamp(timestamp: Timestamp): string {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  return `${day}/${month}/${year}`;
}

