//Connect API
let cityName = "Amsterdam";
let apiKey = "d4c486d391c1e53132be6cfbb096c3a8";
let units = "metric";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
axios.get(apiUrl).then(getWeatherInformation);

// Select current location
let currentLocbtn = document.querySelector("#currentLoc");
currentLocbtn.addEventListener("click", runLocationData);
function runLocationData() {
  let geoData = navigator.geolocation.getCurrentPosition(showGeoLocationData);
  function showGeoLocationData(geodata) {
    let longitude = geodata.coords.longitude;
    let latitude = geodata.coords.latitude;
    console.log(geodata);
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(getWeatherInformation);
  }
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
}

//get data
function getWeatherInformation(response) {
  //get current weather temperature
  let apiCurrentTemp = response.data.main.temp;
  let apifeelsLikeTemp = response.data.main.feels_like;
  let visibility = response.data.visibility;
  let pressure = response.data.main.pressure;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let locationName = response.data.name;
  let countryName = response.data.sys.country;
  console.log(response);

  let locationh3 = (document.querySelector(
    "#current-location"
  ).innerText = `${locationName}, ${countryName}`);

  let visibilityIcon = (document.querySelector(
    "#visibility"
  ).innerText = `Visibility: ${Math.round(visibility)}`);

  let pressureIcon = (document.querySelector(
    "#pressure"
  ).innerText = `Pressure: ${Math.round(pressure)}hpa`);

  let humidityIcon = (document.querySelector(
    "#humidity"
  ).innerText = `Humidity: ${Math.round(humidity)}%`);

  if (units === "metric") {
    let currentTemp = (document.querySelector(
      "#currentTempInfo"
    ).innerText = `${Math.round(apiCurrentTemp)}°C`);

    let feelsLikeTemp = (document.querySelector(
      "#feelsLikeTemp"
    ).innerText = `Feels like: ${Math.round(apifeelsLikeTemp)}°C`);

    let windInfo = (document.querySelector(
      "#wind-info"
    ).innerText = `Wind: ${Math.round(wind)} m/s`); //meters per sec
  } else {
    let currentTemp = (document.querySelector(
      "#currentTempInfo"
    ).innerText = `${Math.round(apiCurrentTemp)}°F`);
    let feelsLikeTemp = (document.querySelector(
      "#feelsLikeTemp"
    ).innerText = `Feels like: ${Math.round(apifeelsLikeTemp)}°F`);

    let windInfo = (document.querySelector(
      "#wind-info"
    ).innerText = `Wind: ${Math.round(wind)} m/h`); //miles per hour
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

  let sunriseData = (document.querySelector(
    "#sunrise"
  ).innerText = sunriseTime);
  let sunsetData = (document.querySelector("#sunset").innerText = sunsetTime);
}

//Searchbar search
let searchbtn = document.querySelector("#searchbtn");
searchbtn.addEventListener("click", search);
function search(event) {
  event.preventDefault();
  cityName = document.querySelector("#searchBar").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getWeatherInformation);
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
