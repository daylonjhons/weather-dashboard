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
  