const form = (document.querySelector("form"))
const search = (document.getElementById("weatherSearch"))
const apiKey = `3cafaa59f1bb4719ba983312232006`;


//Get Location Temperature by Async Request
async function getWeatherData(cityName) {
    try {
        const apiUrl = `//api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            // const data = await response.json();
            getWeatherDataContent(data.location.country, data.location.name, data.current.condition.icon, data.current.temp_c, data.current.humidity, data.current.condition.text, false);
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
    const latLong = position.coords.latitude+','+position.coords.longitude
    const apiUrl = `//api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latLong}&aqi=no`

    const Http = new XMLHttpRequest();
    Http.open("GET", apiUrl);
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            const data = JSON.parse(Http.responseText);
            let browserLocation = true;
            getWeatherDataContent(data.location.country,data.location.name,data.current.condition.icon,data.current.temp_c,data.current.humidity,data.current.condition.text,browserLocation)
        }
    }
};
const errorCallback = (error) => {
    console.log(error);
};
navigator.geolocation.getCurrentPosition(currentIpLocation, errorCallback); 


// Content Update by Parameters
getWeatherDataContent = (countyName,City,img,temp,humidity,text,browserLocation) =>{
    console.log(browserLocation);
    let content = `
    <div class="location"> ${browserLocation ? 'Current location: ' : 'Location: '} ${countyName +', '+ City}</div>
    <div class="temperature">
        <img src="${img}" alt="weather-icon">
        <span>${temp}°</span>
    </div>

    <div class="bottom-section">
        <span class="humidity"> <i class="fa-solid fa-droplet"></i> <span>${humidity}°</span></span>
        <span class="description">Condition: <span>${text}</span></span>
    </div>`;
    document.getElementById("tempSection").innerHTML = content;
    return content
}


// Form Handling by Submit Event
form.addEventListener("submit", function (e) {
    e.preventDefault();
    //const data = new FormData(form);
    let cityName = search.value
    getWeatherData(cityName)
})