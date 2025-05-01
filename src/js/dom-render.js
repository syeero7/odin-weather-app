import { getWeather, getFilteredWeather } from "./weather.js";
import { convertToCelsius, convertToFahrenheit, getObjectKey } from "./utils.js";
import {
  createCurrentWeatherElements,
  createDailyWeatherElements,
  createErrorElements,
} from "./dom-create.js";

const TEMP_UNITS = { "℉": "Fahrenheit", "℃": "Celsius" };

const content = document.querySelector("main");
const weatherForm = document.querySelector(".weather-form");
const tempToggle = document.querySelector(".temp-toggle");

export function initialize() {
  weatherForm.addEventListener("submit", handleSubmit);
  tempToggle.addEventListener("change", updateTempValues);
}

async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const location = formData.get("location");
  if (!location.trim()) return;

  const { data, error } = await getWeather(location);
  removeContent();

  if (error) {
    const errorElements = createErrorElements({ statusCode: error.status, location });
    content.appendChild(errorElements);

    return;
  }

  const { current, daily } = getFilteredWeather(data);
  const currentWeather = await createCurrentWeatherElements(current);
  const dailyWeather = await createDailyWeatherElements(daily);

  content.append(currentWeather, dailyWeather);
  updateTempValues();
}

function updateTempValues() {
  const update = shouldUpdateTempValues();
  if (!update) return;

  const selectedTempUnit = tempToggle.querySelector("input:checked").value;
  const tempElements = document.querySelectorAll(".weather-temp");
  const temperatureUnit = getObjectKey(TEMP_UNITS, selectedTempUnit);
  const convertTemperature =
    selectedTempUnit === "Fahrenheit" ? convertToFahrenheit : convertToCelsius;

  tempElements.forEach((element) => {
    const prevTempValue = Number(element.textContent.split(" ")[0]);
    const newTempValue = convertTemperature(prevTempValue);
    element.textContent = `${Math.round(newTempValue)} ${temperatureUnit}`;
  });
}

function shouldUpdateTempValues() {
  const currentTemp = document.querySelector(".weather-temp");
  if (!currentTemp) return false;

  const selectedTempUnit = tempToggle.querySelector("input:checked").value;
  const displayedTempUnit = TEMP_UNITS[currentTemp.textContent.split(" ")[1]];

  return selectedTempUnit !== displayedTempUnit;
}

function removeContent() {
  while (content.firstChild) {
    content.firstChild.remove();
  }
}
