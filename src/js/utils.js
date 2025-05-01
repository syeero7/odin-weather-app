export function convertToCelsius(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

export function convertToFahrenheit(celsius) {
  return celsius * (9 / 5) + 32;
}

export function getVerboseDate(date, format) {
  const d = new Date(date);

  return {
    weekday: d.toLocaleString("en-US", { weekday: format }),
    month: d.toLocaleString("en-US", { month: format }),
    day: d.getDate(),
  };
}

export function getObjectKey(object, value) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (object[key] === value) return key;
    }
  }
}
