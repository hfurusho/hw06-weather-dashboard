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
  }).then(function(results) {
    console.log(results);
    populateCurrentWeatherConditions(results);
  });
}

function populateCurrentWeatherConditions(results) {
  let cityName = results.name;
  let today = new Date();
  let temperature = results.main.temp;
  let humidity = results.main.humidity;
  let windSpeed = results.wind.speed;
  let currentWeather = results.weather[0].main;
  let iconURL = `http://openweathermap.org/img/w/${results.weather[0].icon}.png`;
  let lon = results.coord.lon;
  let lat = results.coord.lat;

  $("#currentCity").text(cityName);
  $("#todaysDate").text(
    `(${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()})`
  ); // USE result.dt time (unix) and convert
  $("#currentWeatherIcon").attr("src", iconURL);
  $("#currentWeatherIcon").attr("alt", currentWeather + " icon");
  $("#todaysTemp").text(temperature);
  $("#todaysHumidity").text(humidity);
  $("#todaysWindSpeed").text(windSpeed);

  populateCurrentUVIndex(lon, lat);
}

function populateCurrentUVIndex(lon, lat) {
  let UVIndexURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`;
  $.ajax({
    url: UVIndexURL,
    method: "GET"
  }).then(function(results) {
    let UVIndex = results.value;
    $("#todaysUVIndex").text(UVIndex);
    if (UVIndex < 3) {
      $("#todaysUVIndex").addClass("uv-low");
    } else if (UVIndex < 6) {
      $("#todaysUVIndex").addClass("uv-mod");
    } else if (UVIndex < 8) {
      $("#todaysUVIndex").addClass("uv-high");
    } else if (UVIndex < 11) {
      $("#todaysUVIndex").addClass("uv-very-high");
    } else {
      $("#todaysUVIndex").addClass("uv-ext");
    }
  });
}
