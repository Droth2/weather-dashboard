var submitFormEl = document.getElementById('city-form');
var currentWeatherEl = document.getElementById('current-weather');

var getWeather = function() {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=38.5816&lon=-121.4944&units=imperial&exclude=minutely,hourly&appid=10074fa01ce60102513489d0299d91f1";
    fetch(weatherUrl).then(function(response) {   
        response.json().then(function(data) {
            console.log(data);
            formatCurrentWeather(data);
        });
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    getWeather();
}

submitFormEl.addEventListener('submit', formSubmitHandler);

var formatCurrentWeather = function(data) {
    var timeDateStamp = data.current.dt;
    var timeMili = timeDateStamp * 1000;
    var dateObject = new Date(timeMili);
    var dated = dateObject.toLocaleString('en-US', {day: "numeric"});
    var datem = dateObject.toLocaleString('en-US', {month: "numeric"});
    var datey = dateObject.toLocaleString('en-US', {year: "numeric"});

    var heading = document.createElement('h3');
    heading.classList = 'px-2';
    heading.innerHTML = "Sacramento (" + datem + "/" + dated + "/" + datey + ") <img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>";

    var temp = document.createElement('p');
    temp.classList = 'px-2';
    temp.textContent = 'Temp: ' + data.current.temp + '°F';
    
    var wind = document.createElement('p');
    wind.classList = 'px-2';
    wind.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
    
    var humidity = document.createElement('p');
    humidity.classList = 'px-2';
    humidity.textContent = 'Humidity: ' + data.current.humidity + '%';
    
    var uvIndex = document.createElement('p');
    uvIndex.classList = 'px-2';
    uvIndex.textContent = 'UV Index: ';
    var uvIndexSpan = document.createElement('span');
    if (data.current.uvi <= 2) {
        uvIndexSpan.classList = 'uv-index-favorable';
    } else if (data.current.uvi <= 5) {
        uvIndexSpan.classList = 'uv-index-moderate';
    } else if (data.current.uvi > 5) {
        uvIndexSpan.classList = 'uv-index-severe';
    }
    uvIndexSpan.textContent = data.current.uvi;
    uvIndex.appendChild(uvIndexSpan);
    
    currentWeatherEl.append(heading, temp, wind, humidity, uvIndex);
}