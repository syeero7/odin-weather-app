import { getWeather, getFilteredWeather } from "./weather.js";
import { convertToCelsius, convertToFahrenheit } from "./utils.js";
import {
  createCurrentWeatherElements,
  createDailyWeatherElements,
  createErrorElements,
} from "./dom-create.js";

const content = document.querySelector("main");
const weatherForm = document.querySelector(".weather-form");
const tempToggle = document.querySelector(".temp-toggle");

export function initialize() {
  weatherForm.addEventListener("submit", handleSubmit);
  tempToggle.addEventListener("change", updateTempValues);
}

async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(weatherForm);
  const location = formData.get("location");
  if (!location.trim()) return;

  weatherForm.reset();
  setLoadingState(true);
  setFormDisabledState(true);

  const { data, error } = await getWeather(location);
  setFormDisabledState(false);
  removeContent();

  if (error) {
    const errorElements = createErrorElements({ statusCode: error.status, location });
    content.appendChild(errorElements);
    setLoadingState(false);

    return;
  }

  const { current, daily } = getFilteredWeather(data);
  const currentWeather = await createCurrentWeatherElements(current);
  const dailyWeather = await createDailyWeatherElements(daily);

  content.append(currentWeather, dailyWeather);
  updateTempValues();
  setLoadingState(false);
}

function updateTempValues() {
  const update = shouldUpdateTempValues();
  if (!update) return;

  const selectedTempUnit = tempToggle.querySelector("input:checked").value;
  const tempElements = document.querySelectorAll("[data-temp-unit]");
  const convertTemperature =
    selectedTempUnit === "Fahrenheit" ? convertToFahrenheit : convertToCelsius;

  tempElements.forEach((element) => {
    const prevTempValue = Number(element.textContent.replace("°", ""));
    const newTempValue = convertTemperature(prevTempValue);
    element.textContent = `${Math.round(newTempValue)}°`;
    element.dataset.tempUnit = selectedTempUnit;
  });
}

function shouldUpdateTempValues() {
  const currentTemp = document.querySelector("[data-temp-unit]");
  if (!currentTemp) return false;

  const selectedTempUnit = tempToggle.querySelector("input:checked").value;
  const displayedTempUnit = currentTemp.dataset.tempUnit;

  return selectedTempUnit !== displayedTempUnit;
}

function removeContent() {
  while (content.firstChild) {
    content.firstChild.remove();
  }
}

function setLoadingState(state) {
  document.querySelector("[data-loading]").dataset.loading = state;
}

function setFormDisabledState(state) {
  weatherForm.dataset.disabled = state;
}
