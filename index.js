let apiKey = "d4c486d391c1e53132be6cfbb096c3a8";
let units = "metric";
let cityName = "Amsterdam";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

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
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
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
