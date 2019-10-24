const APIKEY = "79564d65443999fbd44fa53717a9b123";

$("#citySearchBtn").on("click", function(event) {
  event.preventDefault();
  // let citySearched = $("citySearch").val(); // TODO: Uncomment for live version.
  let citySearched = "seattle"; // For testing
  getCurrentWeatherConditions(citySearched);
  getFiveDayForecast(citySearched);
});

function getCurrentWeatherConditions(citySearched) {
  let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${APIKEY}`;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(results) {
    populateCurrentWeatherConditions(results);
  });
}

function populateCurrentWeatherConditions(results) {
  let cityName = results.name;
  let today = new Date();
  let temp = results.main.temp;
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
  $("#todaysTemp").text(temp);
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

function getFiveDayForecast(citySearched) {
  let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearched}&units=imperial&appid=${APIKEY}`;

  $.ajax({
    url: forecastURL,
    method: "GET"
  }).then(function(results) {
    populateForecast(results);
  });
}

function populateForecast(results) {
  let list = results.list;
  let daysForecasted = 0; // Used to check that only 5 days are forecasted
  for (let i = 0; i < list.length && daysForecasted < 6; i++) {
    let time = list[i].dt_txt.split(" ")[1];

    if (time == "12:00:00") {
      let colDiv = $("<div class='col-md'>");
      let cardDiv = $("<div class='card'>");
      let cardBodyDiv = $("<div class='card-body'>");

      let dateDiv = $("<div class='forecast-date'>");
      let date = formatDate(list[i].dt_txt.split(" ")[0]);
      dateDiv.text(date);

      let imgElem = $("<img>");
      let iconURL = `http://openweathermap.org/img/w/${list[i].weather[0].icon}.png`;
      imgElem.attr("src", iconURL);
      let temp = list[i].main.temp;
      let pTemp = $(`<p>Temp: ${temp} &degF</p>`);
      let humidity = list[i].main.humidity;
      let pHumid = $(`<p>Humidity: ${humidity}%</p>`);

      cardBodyDiv.append(dateDiv, imgElem, pTemp, pHumid);
      cardDiv.append(cardBodyDiv);
      colDiv.append(cardDiv);
      $(".weather-conditions").append(colDiv);

      daysForecasted++;
    }
  }
}

function formatDate(date) {
  let arr = date.split(" ")[0].split("-");
  let formattedDate = `${arr[1]}/${arr[2]}/${arr[0]}`;
  return formattedDate;
}
