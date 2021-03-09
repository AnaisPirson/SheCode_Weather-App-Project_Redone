let apiKey = "d4c486d391c1e53132be6cfbb096c3a8";
let units = "metric";
let cityName = "Amsterdam";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
let coordinates = [];
let longitude = 4.800469;
let latitude = 52.3598953;

//Connect API & provide default data (based on dafault city: Amsterdam)
function searchCity(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeatherInformation);
}
searchCity(cityName);

// Select current location
let currentLocbtn = document.querySelector("#currentLoc");
currentLocbtn.addEventListener("click", getCurrentLocation);
function getCurrentLocation() {
  let geoData = navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}
function searchCurrentLocation(position) {
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeatherInformation);
}

//Convert C & F
let temperatureToggle = document.querySelector("#flexSwitchCheckDefault");
temperatureToggle.addEventListener("click", checkTempToggle);
function checkTempToggle() {
  if (temperatureToggle.checked === true) {
    units = "imperial";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(getWeatherInformation);
  } else {
    units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(getWeatherInformation);
  }
  return units;
}

//get data from API
function getWeatherInformation(response) {
  let apiCurrentTemp = response.data.main.temp;
  let apifeelsLikeTemp = response.data.main.feels_like;
  let wind = response.data.wind.speed;
  let weatherIconId = response.data.weather[0].icon;
  cityName = response.data.name;
  coordinates[0] = response.data.coord.lon; //longitude
  coordinates[1] = response.data.coord.lat; //latitude

  console.log(response);

  //update h1 Location and country
  document.querySelector(
    "#current-location"
  ).innerText = `${response.data.name}, ${response.data.sys.country}`;

  //update description
  document.querySelector(
    "#weather-description"
  ).innerText = `${response.data.weather[0].description}`;

  //update main weather icon
  document
    .querySelector("#main-weather-icon")
    .setAttribute("src", `images/${weatherIconId}.svg`);

  //update visibility details
  document.querySelector("#visibility").innerText = `Visibility: ${Math.round(
    response.data.visibility
  )}`;

  //update pressure details
  document.querySelector("#pressure").innerText = `Pressure: ${Math.round(
    response.data.main.pressure
  )}hpa`;

  //update humidity details
  document.querySelector("#humidity").innerText = `Humidity: ${Math.round(
    response.data.main.humidity
  )}%`;

  if (units === "metric") {
    document.querySelector("#currentTempInfo").innerText = `${Math.round(
      apiCurrentTemp
    )}°C`;

    document.querySelector(
      "#feelsLikeTemp"
    ).innerText = `Feels like: ${Math.round(apifeelsLikeTemp)}°C`;

    document.querySelector("#wind-info").innerText = `Wind: ${Math.round(
      wind
    )} m/s`; //meters per sec
  } else {
    document.querySelector("#currentTempInfo").innerText = `${Math.round(
      apiCurrentTemp
    )}°F`;
    document.querySelector(
      "#feelsLikeTemp"
    ).innerText = `Feels like: ${Math.round(apifeelsLikeTemp)}°F`;

    document.querySelector("#wind-info").innerText = `Wind: ${Math.round(
      wind
    )} m/h`; //miles per hour
  }

  //get sunset/surise data
  let unix_timestamp_sunrise = response.data.sys.sunrise;
  let unix_timestamp_sunset = response.data.sys.sunset;
  let sunriseTime = new Date(unix_timestamp_sunrise * 1000).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
  let sunsetTime = new Date(unix_timestamp_sunset * 1000).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  document.querySelector("#sunrise").innerText = sunriseTime;
  document.querySelector("#sunset").innerText = sunsetTime;

  return coordinates;
}

//Searchbar search
let searchbtn = document.querySelector("#searchbtn");
searchbtn.addEventListener("click", handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  cityName = document.querySelector("#searchBar").value;
  searchCity(cityName);
}

//Get current time, date, month
function createDay() {
  let todayTime = new Date().toLocaleTimeString("en-us", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  let todayDate = new Date().toLocaleDateString("en-UK", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let currentDateH3 = (document.querySelector(
    ".current-date"
  ).innerText = `${todayDate}, ${todayTime}`);
}
createDay();

//Daily Forecast toggle
let forecastBtns = document.querySelectorAll(".forecastBtns");

forecastBtns.forEach(function (elem) {
  elem.addEventListener("click", checkForecastToggle);
});

function checkForecastToggle() {
  if (document.querySelector("#btnradio1").checked) {
    //update weekday info
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let day0 = new Date().getDay();
    let day1 = day0 + 1;
    let day2 = day0 + 2;
    let day3 = day0 + 3;
    let day4 = day0 + 4;
    document.querySelector("#time-period1-header").innerText = weekdays[day0];
    document.querySelector("#time-period2-header").innerText = weekdays[day1];
    document.querySelector("#time-period3-header").innerText = weekdays[day2];
    document.querySelector("#time-period4-header").innerText = weekdays[day3];
    document.querySelector("#time-period5-header").innerText = weekdays[day4];

    let apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl2).then(getDailyWeatherInfo);
  } else {
    let currentHour = new Date().getHours();
    document.querySelector("#time-period1-header").innerText = `${
      currentHour + 1
    }:00`;
    document.querySelector("#time-period2-header").innerText = `${
      currentHour + 2
    }:00`;
    document.querySelector("#time-period3-header").innerText = `${
      currentHour + 3
    }:00`;
    document.querySelector("#time-period4-header").innerText = `${
      currentHour + 4
    }:00`;
    document.querySelector("#time-period5-header").innerText = `${
      currentHour + 5
    }:00`;
    let apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl2).then(getHourlyWeatherInfo);
  }
}
checkForecastToggle();
function getDailyWeatherInfo(response) {
  console.log(response);
  document.querySelector("#time-period1-info").innerText = `${Math.round(
    response.data.daily[0].temp.min
  )}°C/${Math.round(response.data.daily[0].temp.max)}°C`;
  document
    .querySelector("#time-period2-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[1].weather[0].icon}.svg`
    );

  document
    .querySelector("#time-period1-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[0].weather[0].icon}.svg`
    );

  document.querySelector("#time-period2-info").innerText = `${Math.round(
    response.data.daily[1].temp.min
  )}°C/${Math.round(response.data.daily[1].temp.max)}°C`;
  document
    .querySelector("#time-period2-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[1].weather[0].icon}.svg`
    );

  document.querySelector("#time-period3-info").innerText = `${Math.round(
    response.data.daily[2].temp.min
  )}°C/${Math.round(response.data.daily[2].temp.max)}°C`;
  document
    .querySelector("#time-period3-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[2].weather[0].icon}.svg`
    );

  document.querySelector("#time-period4-info").innerText = `${Math.round(
    response.data.daily[3].temp.min
  )}°C/${Math.round(response.data.daily[3].temp.max)}°C`;
  document
    .querySelector("#time-period4-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[3].weather[0].icon}.svg`
    );

  document.querySelector("#time-period5-info").innerText = `${Math.round(
    response.data.daily[4].temp.min
  )}°C/${Math.round(response.data.daily[4].temp.max)}°C`;
  document
    .querySelector("#time-period5-icon")
    .setAttribute(
      "src",
      `images/${response.data.daily[4].weather[0].icon}.svg`
    );
}

function getHourlyWeatherInfo(response) {
  document.querySelector("#time-period1-info").innerText = `${Math.round(
    response.data.hourly[1].temp
  )}°C`;
  document
    .querySelector("#time-period1-icon")
    .setAttribute(
      "src",
      `images/${response.data.hourly[1].weather[0].icon}.svg`
    );

  document.querySelector("#time-period2-info").innerText = `${Math.round(
    response.data.hourly[2].temp
  )}°C`;
  document
    .querySelector("#time-period2-icon")
    .setAttribute(
      "src",
      `images/${response.data.hourly[2].weather[0].icon}.svg`
    );

  document.querySelector("#time-period3-info").innerText = `${Math.round(
    response.data.hourly[3].temp
  )}°C`;
  document
    .querySelector("#time-period3-icon")
    .setAttribute(
      "src",
      `images/${response.data.hourly[3].weather[0].icon}.svg`
    );

  document.querySelector("#time-period4-info").innerText = `${Math.round(
    response.data.hourly[4].temp
  )}°C`;
  document
    .querySelector("#time-period4-icon")
    .setAttribute(
      "src",
      `images/${response.data.hourly[4].weather[0].icon}.svg`
    );

  document.querySelector("#time-period5-info").innerText = `${Math.round(
    response.data.hourly[5].temp
  )}°C`;
  document
    .querySelector("#time-period5-icon")
    .setAttribute(
      "src",
      `images/${response.data.hourly[5].weather[0].icon}.svg`
    );
}

// longitude = coordinates[0];
// latitude = coordinates[1];
