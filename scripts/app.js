const APIKEY = "79564d65443999fbd44fa53717a9b123";

$("#citySearchBtn").on("click", function(event) {
  event.preventDefault();
  getWeatherConditions();
});

function getWeatherConditions() {
  // let citySearched = $("citySearch").val(); // TODO: Uncomment for live version.
  let citySearched = "seattle"; // For testing
  let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${APIKEY}`;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    populateCurrentWeatherConditions(response);
  });
}

function populateCurrentWeatherConditions(results) {
  let cityName = results.name;
  let temperature = results.main.temp;
  let humidity = results.main.humidity;
  let windSpeed = results.wind.speed;
  let currentWeather = results.weather.main;
  let iconURL = `http://openweathermap.org/img/w/${results.weather[0].icon}.png`;

  $("#currentCity").text(cityName);
  $("#todaysDate").text("(10/21/29)"); // TODO: Get current date and format.
  $("#currentWeatherIcon").attr("src", iconURL);
  $("#currentWeatherIcon").attr("alt", currentWeather + " icon");
  $("#todaysTemp").text(temperature);
  $("#todaysHumidity").text(humidity);
  $("#todaysWindSpeed").text(windSpeed);
  $("#todaysUvIndex").text();
}
