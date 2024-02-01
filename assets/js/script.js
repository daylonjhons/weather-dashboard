var searchedCityEl = document.getElementById("city-search");
var submitSearchEl = document.getElementById("search-button");
var previousSearchEl = document.getElementById("previous-search");
var currentCityEl = document.getElementById("current-city");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humid");
var descriptionEl = document.getElementById("description");
var fiveDayEl = document.getElementById("five-day");

var currentCity = searchedCityEl.value;
var previousCitySearches = [];

var date = dayjs();
var currentDate = date.format("MM/DD/YYYY");

var lon, lat, state, temp, wind, humidity, description, icon, iconImg, iconVar;
var apiKey = "aabca1893f2719756c7db71cc89ba0af";

var parsedCities = localStorage.getItem("cities");
console.log(parsedCities);
if (parsedCities) {
  previousCitySearches = JSON.parse(parsedCities);
  for (let i = 0; i < previousCitySearches.length; i++) {
    var cityName = document.createElement("button");
    cityName.classList.add("previous-btn");
    cityName.textContent = previousCitySearches[i];
    cityName.addEventListener("click", function () {
      searchedCityEl.value = previousCitySearches[i];
      getLocation(new Event("click"));
    });
    previousSearchEl.appendChild(cityName);
  }
}

function capitalizeFirstLetter(str) {
    return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function getLocation(event) {
    event.preventDefault();
    currentCity = capitalizeFirstLetter(searchedCityEl.value);
    var urlGeo =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      currentCity +
      "&appid=" +
      apiKey;
    fetch(urlGeo)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('City not found. Please enter a valid city name.');
        }
        return response.json();
      })
      .then(function (data) {
        if (!data || data.length === 0) {
          throw new Error('City not found. Please enter a valid city name.');
        }
        lat = data[0].lat;
        lon = data[0].lon;
        state = data[0].state;
        getWeather(lat, lon, state);
        updateCurrentCity();
      })
      .catch(function (error) {
        alert(error.message);
      });
}

function updateCurrentCity() {
    currentCityEl.textContent = `${currentCity} (${currentDate})`;
    searchedCityEl.value = "";

    if (!previousCitySearches.includes(currentCity)) {
      previousCitySearches.unshift(currentCity);
    }

    previousCitySearches = Array.from(new Set(previousCitySearches));

    var stringifiedCity = JSON.stringify(previousCitySearches);
    localStorage.setItem("cities", stringifiedCity);

    previousSearchEl.innerHTML = "";

    for (let i = 0; i < previousCitySearches.length; i++) {
      var cityName = document.createElement("button");
      cityName.classList.add("previous-btn");
      cityName.textContent = previousCitySearches[i];
      cityName.addEventListener("click", function () {
        searchedCityEl.value = previousCitySearches[i];
        getLocation(new Event("click"));
      });
      previousSearchEl.appendChild(cityName);
    }
}

function getWeather(lat, lon, state) {
    var urlCurrentWeather =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;
    fetch(urlCurrentWeather)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        icon = data.weather[0].icon;
        temp = Math.round(data.main.temp);
        wind = Math.round(data.wind.speed);
        humidity = data.main.humidity;
        description = data.weather[0].description;
        getFuture(lat, lon);
        updateCurrentWeather(temp, wind, humidity);
      });
}

function updateCurrentWeather(temp, wind, humidity) {
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidEl.textContent = `Humidity: ${humidity}%`;
    iconImg = document.createElement("img");
    iconImg.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
}

function getFuture(lat, lon) {
    var urlFutureForecast =
      "https://api.openweathermap.org/data/2.5/forecast?units=imperial&cnt=5&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;
    fetch(urlFutureForecast)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var forecastContainer = document.getElementById("forecast-container");
        forecastContainer.innerHTML = "";

        for (var i = 0; i < 5; i++) {
          var x = i + 1;
          var tomorrow = dayjs().add(x, "day").format("M/D/YYYY");

          var forecastDiv = document.createElement("div");
          forecastDiv.classList.add("future");
          forecastDiv.id = `day-${x}`;

          var dateElement = document.createElement("p");
          dateElement.id = `day-${x}-date`;
          dateElement.textContent = tomorrow;
          forecastDiv.appendChild(dateElement);

          var tempElement = document.createElement("p");
          tempElement.id = `day-${x}-temp`;
          tempElement.textContent = `Temp: ${Math.round(data.list[i].main.temp)}°F`;
          forecastDiv.appendChild(tempElement);

          var windElement = document.createElement("p");
          windElement.id = `day-${x}-wind`;
          windElement.textContent = `Wind: ${Math.round(data.list[i].wind.speed)}MPH`;
          forecastDiv.appendChild(windElement);

          var humidityElement = document.createElement("p");
          humidityElement.id = `day-${x}-humidity`;
          humidityElement.textContent = `Humidity: ${data.list[i].main.humidity}%`;
          forecastDiv.appendChild(humidityElement);

          var descriptionElement = document.createElement("p");
          descriptionElement.id = `day-${x}-description`;
          descriptionElement.textContent = data.list[i].weather[0].description;
          forecastDiv.appendChild(descriptionElement);

          forecastContainer.appendChild(forecastDiv);
        }
      })
      .catch(function (error) {
        console.error("Error fetching forecast data:", error);
      });
}

document.getElementById("search-form").addEventListener("submit", getLocation);