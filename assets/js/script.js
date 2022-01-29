var submitFormEl = document.getElementById('city-form');
var currentWeatherEl = document.getElementById('current-weather');
var forcastContainerEl = document.getElementById('forcast');
var cityInputEl = document.getElementById('city');

var getWeather = function(lat, long, city) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=minutely,hourly&appid=10074fa01ce60102513489d0299d91f1";
    fetch(weatherUrl).then(function(response) {   
        response.json().then(function(data) {
            console.log(data);
            formatCurrentWeather(data, city);
            format5DayForcast(data);
        });
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim().split(' ').join('');
    if (cityName) {
        var apiUrl = "https://api.myptv.com/geocoding/v1/locations/by-text?searchText=" + cityName + "&countryFilter=US&apiKey=YjYzY2QyNTY5NzhjNDJlODhiYTc3YWY2MmEyZTU0NGU6ZTc4MTVkNTEtNTRkMC00ZWJmLWIxOTgtYzZlMjYxNDFjZGQ5";
        console.log(cityName);
        fetch(apiUrl).then(function(response) {
            response.json().then(function(data) {
                console.log(data);
                var lat = data.locations[0].referencePosition.latitude;
                var long = data.locations[0].referencePosition.longitude;
                var city = data.locations[0].formattedAddress.split(',')[0];
                getWeather(lat, long, city);
            });
        });
        cityInputEl.value = '';
    } else {
        alert('Please enter a valid city in US');
    };
};

submitFormEl.addEventListener('submit', formSubmitHandler);

var formatCurrentWeather = function(data, city) {
    reset(currentWeatherEl);
    var timeDateStamp = data.current.dt;
    var timeMili = timeDateStamp * 1000;
    var dateObject = new Date(timeMili);
    var dated = dateObject.toLocaleString('en-US', {day: "numeric"});
    var datem = dateObject.toLocaleString('en-US', {month: "numeric"});
    var datey = dateObject.toLocaleString('en-US', {year: "numeric"});

    var heading = document.createElement('h3');
    heading.classList = 'px-2';
    heading.innerHTML = city + " (" + datem + "/" + dated + "/" + datey + ") <img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>";

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

var format5DayForcast = function(data) {
    reset(forcastContainerEl);
    for (var i = 1; i < data.daily.length; i++) {
        if (i < 6) {
            var timeDateStamp = data.daily[i].dt;
            var timeMili = timeDateStamp * 1000;
            var dateObject = new Date(timeMili);
            var dated = dateObject.toLocaleString('en-US', {day: "numeric"});
            var datem = dateObject.toLocaleString('en-US', {month: "numeric"});
            var datey = dateObject.toLocaleString('en-US', {year: "numeric"});

            var mainDiv = document.createElement('div');
            mainDiv.classList = 'col-md-2';
            var card = document.createElement('div');
            card.classList = 'card forcast-card';
            var cardBody = document.createElement('div');
            cardBody.classList = 'card-body';

            var cardTitle = document.createElement('h5');
            cardTitle.classList = 'card-title mb-2';
            cardTitle.textContent = datem + '/' + dated + '/' + datey;

            var cardText = document.createElement('p');
            cardText.classList = 'card-text';
            cardText.innerHTML = "<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png'><br><br>Temp: " + data.daily[i].temp.day + "°F<br><br>Wind: " + data.daily[i].wind_speed + " MPH<br><br>Humidity: " + data.daily[i].humidity + "%";

            cardBody.append(cardTitle, cardText);
            card.appendChild(cardBody);
            mainDiv.appendChild(card);
            forcastContainerEl.appendChild(mainDiv);
        }
    }
}

var reset = function(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}