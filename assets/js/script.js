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
