const API_KEY = "6beb315ae649578e0359eaa1f6a18321";

const BASE_URL =
    "https://api.openweathermap.org/data/2.5/weather";




const form =
    document.querySelector("#searchForm");

const input =
    document.querySelector("#cityInput");

const loading =
    document.querySelector("#loading");

const errorBox =
    document.querySelector("#error");

const result =
    document.querySelector("#weatherResult");

const cityName =
    document.querySelector("#cityName");

const weatherIcon =
    document.querySelector("#weatherIcon");

const temperature =
    document.querySelector("#temperature");

const description =
    document.querySelector("#description");

const humidity =
    document.querySelector("#humidity");

const toggleTemp =
    document.querySelector("#toggleTemp");

const historyList =
    document.querySelector("#historyList");

const clearHistory =
    document.querySelector("#clearHistory");




let currentWeather = null;

let isCelsius = true;




const showLoading = () => {

    loading.classList.remove("hidden");

    result.classList.add("hidden");

    errorBox.classList.add("hidden");

};


const hideLoading = () => {

    loading.classList.add("hidden");

};




const showError = (message) => {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

};


const hideError = () => {

    errorBox.classList.add("hidden");

};




const getWeather = async (city) => {

    try {

        showLoading();

        hideError();


        const url =
            `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;


        const response =
            await fetch(url);


        

        if (response.status === 404) {

            throw new Error(
                `Kota "${city}" tidak ditemukan.`
            );

        }


        

        if (!response.ok) {

            throw new Error(
                `Terjadi kesalahan server: ${response.status}`
            );

        }


        

        const data =
            await response.json();


        currentWeather = data;


        displayWeather();


        saveHistory(data.name);


    } catch (error) {

        

        if (error.name === "TypeError") {

            showError(
                "Network error. Periksa koneksi internet Anda."
            );

        } else {

            showError(error.message);

        }

    } finally {

        hideLoading();

    }

};




const displayWeather = () => {

    if (!currentWeather) return;


    const tempCelsius =
        currentWeather.main.temp;


    const tempFahrenheit =
        (tempCelsius * 9 / 5) + 32;


    cityName.textContent =
        currentWeather.name;


    

    if (isCelsius) {

        temperature.textContent =
            `${Math.round(tempCelsius)}°C`;

        toggleTemp.textContent =
            "Ubah ke °F";

    } else {

        temperature.textContent =
            `${Math.round(tempFahrenheit)}°F`;

        toggleTemp.textContent =
            "Ubah ke °C";

    }


    description.textContent =
        currentWeather.weather[0].description;


    humidity.textContent =
        `💧 Kelembaban: ${currentWeather.main.humidity}%`;


    weatherIcon.src =
        `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;


    result.classList.remove("hidden");

};




toggleTemp.addEventListener("click", () => {

    isCelsius = !isCelsius;

    displayWeather();

});




form.addEventListener("submit", (event) => {

    event.preventDefault();


    const city =
        input.value.trim();


    

    if (!city) {

        showError(
            "Nama kota tidak boleh kosong!"
        );

        return;

    }


    

    isCelsius = true;


    getWeather(city);

});




const saveHistory = (city) => {

    const history =
        JSON.parse(
            localStorage.getItem("weatherHistory")
        ) || [];


    

    const newHistory =
        history.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    

    newHistory.unshift(city);


    

    const limitedHistory =
        newHistory.slice(0, 5);


    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(limitedHistory)
    );


    displayHistory();

};




const displayHistory = () => {

    const history =
        JSON.parse(
            localStorage.getItem("weatherHistory")
        ) || [];


    historyList.innerHTML = "";


    

    history.forEach((city) => {

        const li =
            document.createElement("li");


        li.textContent =
            `📍 ${city}`;


        

        li.addEventListener("click", () => {

            input.value = city;

            isCelsius = true;

            getWeather(city);

        });


        historyList.appendChild(li);

    });

};




clearHistory.addEventListener("click", () => {

    localStorage.removeItem(
        "weatherHistory"
    );


    displayHistory();

});




displayHistory();