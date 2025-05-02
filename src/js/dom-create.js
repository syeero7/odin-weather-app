import { getVerboseDate } from "./utils.js";

export async function createCurrentWeatherElements(current) {
  const section = document.createElement("section");
  section.classList.add("main-container");

  const h1 = document.createElement("h1");
  h1.classList.add("location");
  h1.textContent = current.location;

  const article = document.createElement("article");

  const h2 = document.createElement("h2");
  h2.classList.add("weather-date");
  const { weekday, month, day } = getVerboseDate(current.date, "long");
  h2.textContent = `${weekday}, ${month} ${day}`;

  const div = document.createElement("div");
  div.classList.add("img-container");

  const img = document.createElement("img");
  img.classList.add("weather-img");
  const module = await import(`../assets/${current.icon}.svg`);
  img.src = module.default;
  img.alt = current.icon.replace(/-/g, " ");

  const h3 = document.createElement("h3");
  h3.classList.add("weather-temp");
  h3.textContent = `${Math.round(current.temp)}°`;
  h3.dataset.tempUnit = "Fahrenheit";

  const para = document.createElement("p");
  para.classList.add("weather-condition");
  para.textContent = current.condition;

  div.appendChild(img);
  article.append(h2, div, h3, para);
  section.append(h1, article);
  return section;
}

export async function createDailyWeatherElements(daily) {
  const section = document.createElement("section");
  section.classList.add("daily-container");

  const promises = daily.map(async (day) => {
    const article = document.createElement("article");

    const h2 = document.createElement("h2");
    h2.classList.add("weather-date");
    const { weekday, month, day: d } = getVerboseDate(day.date, "short");
    h2.textContent = `${weekday}, ${month} ${d}`;

    const div = document.createElement("div");
    div.classList.add("img-container");

    const img = document.createElement("img");
    img.classList.add("weather-img");
    const module = await import(`../assets/${day.icon}.svg`);
    img.src = module.default;
    img.alt = day.icon.replace(/-/g, " ");

    const div2 = document.createElement("div");
    div2.classList.add("temp-minmax");

    const h3 = document.createElement("h3");

    const spanMax = document.createElement("span");
    spanMax.classList.add("weather-temp", "temp-max");
    spanMax.dataset.tempUnit = "Fahrenheit";
    spanMax.textContent = `${Math.round(day.tempMax)}°`;

    const spanMin = document.createElement("span");
    spanMin.classList.add("weather-temp", "temp-min");
    spanMin.dataset.tempUnit = "Fahrenheit";
    spanMin.textContent = `${Math.round(day.tempMin)}°`;

    div.appendChild(img);
    h3.append(spanMax, spanMin);
    article.append(h2, div, h3);
    return article;
  });

  const dailyElements = await Promise.all(promises);
  section.append(...dailyElements);
  return section;
}

export function createErrorElements(data) {
  const section = document.createElement("section");
  section.classList.add("error-container");

  const h1 = document.createElement("h1");
  const locationError = `"${data.location}": Invalid location. Maybe it's on another planet?`;
  h1.textContent = `${data.statusCode === 400 ? locationError : "Fetch failed"}`;

  section.appendChild(h1);
  return section;
}
