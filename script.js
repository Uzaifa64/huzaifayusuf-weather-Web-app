let apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function (position) {

    try {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //longitude and  latitude are used to get city name
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        var userdata = await map.json();
        let loc = userdata[0].name;
        //By using City name  we can get the weather details of that particular city from OpenWeatherMap API
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        let data = await respond.json();

        console.log(data);

        // display current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");

        cityMain.innerHTML = data.city.name;
        cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
        weatherMain[0].innerHTML = data.list[0].weather[0].description;
        weatherMain[1].innerHTML = data.list[0].weather[0].description;
        mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
        mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
        tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
        tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

        let weatherCondition = data.list[0].weather[0].main.toLowerCase();

        if (weatherCondition === "rain") {
            weatherImg.src ="https://i.ibb.co/2xf8Jtd/rain.jpg";
            weatherImgs.src ="https://i.ibb.co/2xf8Jtd/rain.jpg";
        } else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
            weatherImg.src ="https://i.ibb.co/5WGhkJdT/sun.jpg";
            weatherImgs.src ="https://i.ibb.co/5WGhkJdT/sun.jpg";
        } else if (weatherCondition === "snow") {
            weatherImg.src ="https://i.ibb.co/5gYCcvn7/snow.jpg";
            weatherImgs.src ="https://i.ibb.co/5gYCcvn7/snow.jpg";
        } else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherImg.src ="https://i.ibb.co/mFg5bL7d/cloud.jpg";
            weatherImgs.src = "https://i.ibb.co/mFg5bL7d/cloud.jpg";
        } else if (weatherCondition === "mist" || weatherCondition === "Fog") {
            weatherImg.src ="https://i.ibb.co/zVyWn0tY/mist.jpg";
            weatherImgs.src ="https://i.ibb.co/zVyWn0tY/mist.jpg";
        } else if (weatherCondition === "haze") {
            weatherImg.src ="https://i.ibb.co/ZpPCyRts/haze.png";
            weatherImgs.src = "https://i.ibb.co/ZpPCyRts/haze.png";
        } else if (data.weather[0].main === "Thunderstorm") {
            weatherImg.src = "https://i.ibb.co/rfw2jpDN/wind.jpg";
            weatherImgs.src ="https://i.ibb.co/rfw2jpDN/wind.jpg";
        }

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};
            let forecast = document.getElementById('future-forecast-box');
            let forecastbox = "";

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "https://i.ibb.co/2xf8Jtd/rain.jpg" ;
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc ="https://i.ibb.co/5WGhkJdT/sun.jpg" ;
                        break;
                    case "snow":
                        imgSrc ="https://i.ibb.co/5gYCcvn7/snow.jpg";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc ="https://i.ibb.co/mFg5bL7d/cloud.jpg";
                        break;
                    case "mist":
                        imgSrc ="https://i.ibb.co/zVyWn0tY/mist.jpg";
                        break;
                    case "haze":
                        imgSrc ="https://i.ibb.co/ZpPCyRts/haze.png";
                        break;
                    case "thunderstorm":
                        imgSrc = "https://i.ibb.co/rfw2jpDN/wind.jpg";

                        break;
                    default:
                        imgSrc ="https://i.ibb.co/5WGhkJdT/sun.jpg" ;
                }

                forecastbox += `
                <div class="weather-forecast-box">
                <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
                 </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;

            console.log(data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
},
() => {
    // Handle location retrieval error
    alert("Please turn on your location and refresh the page");
  });
  
  
   
        // Simulate loading time
        setTimeout(function() {
            document.getElementById('loaderContainer').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }, 3000); // Change this time to match your actual loading time
    
    
    document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loadingScreen');
            const weatherApp = document.getElementById('weatherApp');
            const percentageElement = document.querySelector('.percentages');
            const loadingBar = document.querySelector('.loading-bars');
            const loadingText = document.querySelector('.loading-texts');
            const statusMessage = document.querySelector('.status-message');
            
            const messages = [
                "Initializing weather application...",
                "Detecting your location...",
                "Connecting to weather services...",
                "Downloading forecast data...",
                "Processing weather information...",
                "Finalizing setup..."
            ];
            
            let percentage = 0;
            let messageIndex = 0;
            
            const interval = setInterval(() => {
                // Increase percentage with variable speed for more realistic feel
                let increment = 0;
                if (percentage < 30) {
                    increment = Math.random() * 5 + 3;
                } else if (percentage < 70) {
                    increment = Math.random() * 3 + 1;
                } else {
                    increment = Math.random() * 2 + 0.5;
                }
                
                percentage += increment;
                
                // Update message at certain percentages
                if (percentage > 15 && messageIndex === 0) {
                    loadingText.textContent = messages[1];
                    statusMessage.textContent = "Getting location data...";
                    messageIndex = 1;
                } else if (percentage > 30 && messageIndex === 1) {
                    loadingText.textContent = messages[2];
                    statusMessage.textContent = "Establishing secure connection...";
                    messageIndex = 2;
                } else if (percentage > 50 && messageIndex === 2) {
                    loadingText.textContent = messages[3];
                    statusMessage.textContent = "Retrieving weather information...";
                    messageIndex = 3;
                } else if (percentage > 75 && messageIndex === 3) {
                    loadingText.textContent = messages[4];
                    statusMessage.textContent = "Analyzing weather patterns...";
                    messageIndex = 4;
                } else if (percentage > 90 && messageIndex === 4) {
                    loadingText.textContent = messages[5];
                    statusMessage.textContent = "Final preparations...";
                    messageIndex = 5;
                }
                
                if (percentage >= 100) {
                    percentage = 100;
                    clearInterval(interval);
                    
                    // Final completion
                    setTimeout(() => {
                        loadingText.textContent = 'Complete!';
                        statusMessage.textContent = "";
                // Hide loading screen and show weather app
                        setTimeout(() => {
                            loadingScreen.style.opacity = '0';
                            loadingScreen.style.visibility = 'hidden';
                            
                            // Show weather app with fade in
                            weatherApp.style.display = 'block';
                            setTimeout(() => {
                                weatherApp.style.opacity = '1';
                            }, 100);
                        }, 1000);
                    }, 500);
                }
                
                percentageElement.textContent = Math.floor(percentage) + '%';
                loadingBar.style.width = percentage + '%';
            }, 200);
        });              
             
    
  