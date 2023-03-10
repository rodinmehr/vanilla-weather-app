function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

let celsiusTemperature = null;
let celsiusForecastMaxTemperatures = [];
let celsiusForecastMinTemperatures = [];

function displayForecast(response) {
  let forecast = response.data.daily;
  let weatherForecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = "";
  forecastHTML += `<div class="row">`;
  celsiusForecastMaxTemperatures = [];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      celsiusForecastMaxTemperatures.push(forecastDay.temp.max);
      celsiusForecastMinTemperatures.push(forecastDay.temp.min);

      forecastHTML += `
  <div class="col-2">
    <div class="weather-forecast-date">
        ${formatDay(forecastDay.dt)}
    </div>
    <img src="http://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }@2x.png" alt="" width="42">
    <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">
            ${Math.round(forecastDay.temp.max)}°
        </span>
        <span class="weather-forecast-temperature-min">
            ${Math.round(forecastDay.temp.min)}°
        </span>
    </div>
  </div>
  `;
    }
  });

  forecastHTML += `</div>`;
  weatherForecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "62231151ce343c4d68652e1617efc22f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}
function search(city) {
  let apiKey = "62231151ce343c4d68652e1617efc22f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

search("New York");

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let forecastMaxTemperatureElements = document.querySelectorAll(
    ".weather-forecast-temperature-max"
  );
  let forecastMinTemperatureElements = document.querySelectorAll(
    ".weather-forecast-temperature-min"
  );
  celsiusLinkElement.classList.remove("active");
  fahrenheitLinkElement.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitTemperature;

  forecastMaxTemperatureElements.forEach(
    (forecastMaxTemperatureElement, index) => {
      forecastMaxTemperatureElement.innerHTML =
        Math.round((celsiusForecastMaxTemperatures[index] * 9) / 5 + 32) + "°";
    }
  );
  forecastMinTemperatureElements.forEach(
    (forecastMinTemperatureElement, index) => {
      forecastMinTemperatureElement.innerHTML =
        Math.round((celsiusForecastMinTemperatures[index] * 9) / 5 + 32) + "°";
    }
  );
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let forecastMaxTemperatureElements = document.querySelectorAll(
    ".weather-forecast-temperature-max"
  );
  let forecastMinTemperatureElements = document.querySelectorAll(
    ".weather-forecast-temperature-min"
  );
  fahrenheitLinkElement.classList.remove("active");
  celsiusLinkElement.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  forecastMaxTemperatureElements.forEach(
    (forecastMaxTemperatureElement, index) => {
      forecastMaxTemperatureElement.innerHTML =
        Math.round(celsiusForecastMaxTemperatures[index]) + "°";
    }
  );
  forecastMinTemperatureElements.forEach(
    (forecastMinTemperatureElement, index) => {
      forecastMinTemperatureElement.innerHTML =
        Math.round(celsiusForecastMinTemperatures[index]) + "°";
    }
  );
}

let fahrenheitLinkElement = document.querySelector("#fahrenheit-link");
fahrenheitLinkElement.addEventListener("click", displayFahrenheitTemperature);

let celsiusLinkElement = document.querySelector("#celsius-link");
celsiusLinkElement.addEventListener("click", displayCelsiusTemperature);
