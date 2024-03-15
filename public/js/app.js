const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn"); // Corrected variable name
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_Key = "31f64186e29e6749682497ba6eca5e92";

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details">
              <h4 class="md:text-xl font-medium">${cityName}  (${weatherItem.dt_txt.split(" ")[0]})</h4>
              <p class="text-sm md:text-base mt-3">temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
              <p class="text-sm md:text-base mt-1">wind: ${weatherItem.wind.speed}M/S</p>
              <p class="text-sm md:text-base mt-1">Humidity: ${weatherItem.main.humidity}%</p>
            </div>
            <div class="icon">
              <img class="h-28 md:h-48" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
              <h4 class="text-xl text-center font-medium mt-2">${weatherItem.weather[0].description}</h4>
            </div>`;
  } else {
    return `<div class="card bg-green-500 text-white rounded-md shadow-lg p-4">
                <h4>(${weatherItem.dt_txt.split(" ")[0]})</h4>
                <img class="shadow-md h-24" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <p class="text-sm md:text-base mt-3">temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
                <p class="text-sm md:text-base mt-1">wind: ${weatherItem.wind.speed}M/S</p>
                <p class="text-sm md:text-base mt-1">Humidity: ${weatherItem.main.humidity}%</p>
              </div>`;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const weather_api_url = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_Key}`;

  fetch(weather_api_url)
    .then(res => res.json())
    .then(data => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();

        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }
      });
    })
    .catch(() => {
      alert("nothing found");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  const geocoding_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_Key}`;

  fetch(geocoding_api)
    .then(res => res.json())
    .then(data => {
      if (!data.length) return alert(`NO coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    // .catch(() => {
    //   alert("nothing found");
    // });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      const reverseGeoCoding_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_Key}`;

      fetch(reverseGeoCoding_url)
        .then(res => res.json())
        .then(data => {
          if (!data.length) return alert(`NO coordinates found for ${cityName}`);
          const { name, lat, lon } = data[0];
          getWeatherDetails(name, lat, lon);
        })
        // .catch(() => {
        //   alert("nothing found city");
        // });
    },
    error => {
      if (error.PERMISSION_DENIED) {
        alert("Geolocation request denied.");
      }
    }
  );
};

document.addEventListener("DOMContentLoaded", function () {
  function clickLocationButton() {
    locationButton.click();
  }
  clickLocationButton();
});

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
