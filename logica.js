
"use strict";
// Basada en plantilla de internet del autor CodingManish
const API = "1e3943c3f0a4c1c79361ad8f78e518af";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

// Mostrar el día
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Mostrar la fecha
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Agregar evento
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // Verificar si el botón fue enviado vacío
  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
    console.log("Por favor ingrese una ciudad o un país");
  }
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
<<<<<<< HEAD
    const response = await fetch(API_URL);
    
    if (!response.ok) {  // Si la respuesta no es 'ok', se lanza un error
      throw new Error(response.status);
=======
    const data = await fetch(API_URL);
    const result = await data.json();
    console.log(result);

    if (result.cod !== "404") {
      // Mostrar imagen en caso de que no coloque una ciudad o pais correctamente
      const ImageContent = displayImageContent(result);

      
      const rightSide = rightSideContent(result);

      // funcion para los pronosticos
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
>>>>>>> 3a6f4b1189e0451659b89a0a3ce592179f57829d
    }

    const result = await response.json();

    // Mostrar la información solo si la ciudad es encontrada
    const ImageContent = displayImageContent(result);
    const rightSide = rightSideContent(result);
    displayForeCast(result.coord.lat, result.coord.lon);

    setTimeout(() => {
      iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
      iconsContainer.classList.add("fadeIn");
      dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
    }, 1500);

  } catch (error) {
    // Capturar errores y mostrar el mensaje de 'Ciudad no encontrada'
    const message = `<h2 class="weather_temp">404</h2>
    <h3 class="cloudtxt">Ciudad no encontrada</h3>`;
    iconsContainer.insertAdjacentHTML("afterbegin", message);
    
    // Mostrar un popup con el mensaje
    alert("Ciudad no encontrada");
    
    console.log("Error:", error.message);
  }
}

// Mostrar la imagen y la temperatura
function displayImageContent(data) {
  return `
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Mostrar el contenido de la búsqueda
function rightSideContent(result) {
  return `<div class="content">
          <p class="title">NOMBRE</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMPERATURA</p>
          <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
        </div>
        <div class="content">
          <p class="title">HUMEDAD</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">VELOCIDAD VIENTO</p>
          <span class="value">${result.wind.speed} Km/h</span>
        </div>`;
}

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();

  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });

  daysForecast.forEach((content, indx) => {
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// Pronóstico de datos en el HTML
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@2x.png" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
</li>`;
}
