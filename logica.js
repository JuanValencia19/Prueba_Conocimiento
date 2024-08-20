"use strict";
// Basada en plantilla de internet del autor CodingManish
const API = "1e3943c3f0a4c1c79361ad8f78e518af";

// Selección de elementos del DOM donde se mostrarán los datos
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

// Mostrar el día actual en la interfaz
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Mostrar la fecha actual en la interfaz
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = `${date} ${month} ${year}`;

// Agregar evento al botón de búsqueda
btnEl.addEventListener("click", (e) => {
  e.preventDefault(); // Prevenir que el formulario se envíe

  // Verificar si el campo de entrada no está vacío
  if (inputEl.value !== "") {
    const Search = inputEl.value; // Obtener el valor ingresado
    inputEl.value = ""; // Limpiar el campo de entrada
    findLocation(Search); // Llamar a la función para buscar la ubicación
  } else {
    console.log("Por favor ingrese una ciudad o un país"); // Mensaje de consola si el campo está vacío
  }
});

// Función para buscar la ubicación utilizando la API
async function findLocation(name) {
  // Limpiar el contenido de los contenedores antes de mostrar nuevos datos
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    // Construir la URL de la API con la ciudad ingresada
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const response = await fetch(API_URL); // Realizar la solicitud a la API
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(response.status); // Lanzar un error si la respuesta no es 'ok'
    }

    const result = await response.json(); // Parsear la respuesta a JSON

    // Mostrar la información si la ciudad es encontrada
    const ImageContent = displayImageContent(result); // Mostrar imagen y temperatura
    const rightSide = rightSideContent(result); // Mostrar detalles del clima
    displayForeCast(result.coord.lat, result.coord.lon); // Mostrar el pronóstico extendido

    // Insertar el contenido en el DOM después de una pequeña animación
    setTimeout(() => {
      iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
      iconsContainer.classList.add("fadeIn");
      dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
    }, 1500);

  } catch (error) {
    // Manejo de errores: Mostrar mensaje si la ciudad no es encontrada
    const message = `<h2 class="weather_temp">404</h2>
    <h3 class="cloudtxt">Ciudad no encontrada</h3>`;
    iconsContainer.insertAdjacentHTML("afterbegin", message);

    // Mostrar un popup con el mensaje de error
    alert("Ciudad no encontrada");

    console.log("Error:", error.message); // Mostrar el error en la consola
  }
}

// Función para mostrar la imagen y la temperatura
function displayImageContent(data) {
  return `
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Función para mostrar los detalles del clima en la interfaz
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

// Función para mostrar el pronóstico extendido
async function displayForeCast(lat, long) {
  // Construir la URL de la API para el pronóstico
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(ForeCast_API); // Realizar la solicitud a la API
  const result = await data.json(); // Parsear la respuesta a JSON

  // Filtrar el pronóstico para obtener días únicos
  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });

  // Mostrar los primeros cuatro días del pronóstico
  daysForecast.forEach((content, indx) => {
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// Función para construir el HTML del pronóstico
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3); // Abreviar el nombre del día
  const joinDay = splitDay.join("");

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@2x.png" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
</li>`;
}
