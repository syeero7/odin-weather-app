export async function getWeather(location) {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=L4MRVGFNZH6HMXRFWVR69DKDY&contentType=json`;

    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw res;
    const data = await res.json();

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export function getFilteredWeather(data) {
  const { currentConditions, days, resolvedAddress } = data;

  return {
    current: {
      location: resolvedAddress,
      date: days[0].datetime,
      condition: currentConditions.conditions.split(",")[0],
      temp: currentConditions.temp,
      icon: currentConditions.icon,
    },
    daily: days.slice(1, 7).map((day) => ({
      date: day.datetime,
      icon: day.icon,
      tempMin: day.tempmin,
      tempMax: day.tempmax,
    })),
  };
}
