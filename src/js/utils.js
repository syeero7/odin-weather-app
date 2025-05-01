export function getVerboseDate(date, format) {
  const d = new Date(date);

  return {
    weekday: d.toLocaleString("en-US", { weekday: format }),
    month: d.toLocaleString("en-US", { month: format }),
    day: d.getDate(),
  };
}
