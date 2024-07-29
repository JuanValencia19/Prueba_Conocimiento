"use strict";
// Utilizando la api de openWheater
const API = "1e3943c3f0a4c1c79361ad8f78e518af";

const dayEl = document.querySelector("dia_predeterminado");
const dateEl = document.querySelector("fecha_predeterminado");
const btnEl = document.querySelector("btn_busqueda");
const inputEl = document.querySelector("buscador");

const IconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
];

// Mostrar el dia
const day = new Date();
const dayName = dias[day.getDay()];
dayEl.textContent = dayName;

//Mostrar la fecha
let mes = day.toLocaleString("default", {month: "long"});
let fecha = day.getDate();
let ano = getFullYear();

console.log();
dateEl.textContent = fecha + "" + mes + "" + ano;

//Agregar evento
btnEl.addEventListener("click", (e) =>{
    e.preventDefault();

    // Revisar que el campo este vacio
    if(inputEl.value !== ""){
        const busqueda = inputEl.value;
        inputEl.value = "";
        findLocation(busqueda);
    } else{
        console.log("Por favor ingresa una ciudad o el nombre de un Pais");
    }
});

async function findLocation(nombre) {
    IconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";

try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();
    console.log(result);

    if (result.cod !== "404") {
      // display image content
      const ImageContent = displayImageContent(result);

      // display right side content
      const rightSide = rightSideContent(result);

      // forecast function
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
    }
  } catch (error) {}
}

