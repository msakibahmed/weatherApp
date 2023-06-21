const form = (document.querySelector("form"))
const search = (document.getElementById("weatherSearch"))
const apiKey = `3cafaa59f1bb4719ba983312232006`;


//Get Location Temperature by Async Request
async function getWeatherData(cityName) {
    try {
        const apiUrl = `//api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5&aqi=no`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();

            let { location: { country }, location: { name }, current: { condition: { icon } }, current: { temp_c }, current: { humidity }, current: { condition: { text } }, forecast: { forecastday } } = data
            getWeatherDataContent(country, name, icon, temp_c, humidity, text, false)
            getWeatherDataforecast(forecastday)
        } else {
            let text = `
                <div class="alert alert-danger" role="alert">
                    City name not matched!
                </div>`;
            document.getElementById("tempSection").innerHTML = text;
        }
    } catch (error) {
        console.error(error);
    }
}


// Current Location using XMLHttp Request
const currentIpLocation = (position) => {
    const latLong = position.coords.latitude + ',' + position.coords.longitude
    const apiUrl = `//api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latLong}&days=5&aqi=no`

    const Http = new XMLHttpRequest();
    Http.open("GET", apiUrl);
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            const data = JSON.parse(Http.responseText);
            let { location: { country }, location: { name }, current: { condition: { icon } }, current: { temp_c }, current: { humidity }, current: { condition: { text } }, forecast: { forecastday } } = data

            getWeatherDataContent(country, name, icon, temp_c, humidity, text, true)
            getWeatherDataforecast(forecastday)
        }
    }
};
const errorCallback = (error) => {
    console.log(error);
};
navigator.geolocation.getCurrentPosition(currentIpLocation, errorCallback);


// Content Update by Parameters
getWeatherDataContent = (countyName, City, img, temp, humidity, text, browserLocation) => {
    console.log(browserLocation);
    let content = `
    <div class="location"> ${browserLocation ? 'Current location: ' : 'Location: '} ${countyName + ', ' + City}</div>
    <div class="temperature">
        <img src="${img}" alt="weather-icon">
        <span>${temp}°</span>
    </div>

    <div class="bottom-section">
        <span class="humidity"> <i class="fa-solid fa-droplet"></i> <span>${humidity}°</span></span>
        <span class="description">Condition: <span>${text}</span></span>
    </div>`;
    document.getElementById("tempSection").innerHTML = content;
}

// Show Next 5 Days Content
getWeatherDataforecast = (futureContent) => {
    let forecast = '';
    for (let futureC of futureContent) {
        // Date to day convert 
        const dateStr = futureC.date;
        const date = new Date(dateStr);
        const options = { weekday: 'long' };
        const dayName = new Intl.DateTimeFormat('en-US', options).format(date);

        forecast += `
        <div class="weather-card mobile">
            <div class="day">${dayName}</div>
            <img src="${futureC.day.condition.icon}" alt="Weather Icon">
            <div class="temperatures">
                <span class="high">${futureC.day.maxtemp_c}°C</span>
                <span class="low">${futureC.day.mintemp_c}°C</span>
            </div>
        </div>`;
    }
    document.getElementById("futureTemp").innerHTML = forecast;
}

// Form Handling by Submit Event
form.addEventListener("submit", function (e) {
    e.preventDefault();
    //const data = new FormData(form);
    let cityName = search.value
    getWeatherData(cityName)
})