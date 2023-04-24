/* ELEMENTOS DEL DOM */
const contenedorPrincipal = document.querySelector('#contenedor-principal')
const textoError = document.querySelector('#texto-error')
const ubicacion = document.querySelector('.ubicacion')
const grados = document.querySelector('.grados')
const sensacion = document.querySelector('.sensacion')
const descripcion = document.querySelector('.descripcion')
const iconoTiempo = document.querySelector('.icono-tiempo')
const amanecer = document.querySelector('.amanecer')
const atardecer = document.querySelector('.atardecer')

// apikey
const apiKey = "c91ca6bfc2f5335f3b244afd51e4f7bb"


/**
 * Hace la llamada a la API y muestra los datos
 * @param {Object} posicion 
 */
function obtenerDatos(posicion) {

    // tomo la longitud y la latitud del usuario
    let lat= posicion.coords.latitude
    let lon = posicion.coords.longitude

    // creo la url con la ubicación y la clave de la API
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
    
    const api = new XMLHttpRequest()

    api.open('GET', url, true)
    api.send()

    api.onreadystatechange = function () {
      if (this.status == 200 && this.readyState == 4) {
        // recupero los datos de la API
        let datos = JSON.parse(this.responseText)
        
        // muestro los datos en los distintos apartados del DOM
        ubicacion.textContent = datos.name
        grados.textContent = Math.floor(datos.main.temp) + "°"
        sensacion.textContent = `Sensación térmica de ${Math.floor(datos.main.feels_like)}°`
        descripcion.textContent = datos.weather[0].description
        amanecer.textContent = convertirHora(datos.sys.sunrise) 
        atardecer.textContent = convertirHora(datos.sys.sunset) 
        iconoTiempo.src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}.png`
        
      }
    }
  




}

/**
 * Toma una fecha en formato unix y devuelve la hora y los minutos
 * @param {number} unix 
 * @returns 
 */
function convertirHora(unix){
  let date = new Date(unix * 1000)
  let hora = date.getHours()
  let minutos = date.getMinutes()


  return `${hora}:${parsearMinutos(minutos)}`
}

/**
 * Obtiene la ubicación del usuario o muestra un error si no lo permite
 */
function obtenerUbicacion() {
  if (navigator.geolocation) { //check if geolocation is available
    navigator.geolocation.getCurrentPosition(obtenerDatos, mostrarError);
  } 
}

/**
 * Esconde el contenedor principal y muestra un mensaje de error
 * 
 */
function mostrarError(){
  
  contenedorPrincipal.remove()
  textoError.textContent = "Activa la ubicación para ver el tiempo :("
}

/**
 * Devuelve los minutos parseados para que muestren el cero a la izquierda
 * @param {number} minutos 
 * @returns 
 */
function parsearMinutos(minutos){
  
  if(minutos.toString().length === 1){
    return "0"+minutos
  }

  return minutos
}

// inicia la aplicación
obtenerUbicacion()


