const formulario = document.getElementById("formulario");
const region = document.getElementById("region");
const entrada = document.getElementById("entrada");
const salida = document.getElementById("salida");
const personas = document.getElementById("personas");
const mensaje = document.getElementById("mensaje");
const lista = document.getElementById("lista-alojamientos");
const estadoVacio = document.getElementById("estado-vacio");
const titulo = document.getElementById("titulo-resultados");
const texto = document.getElementById("texto-resultados");
const filtros = document.querySelectorAll(".filtro");
const orden = document.getElementById("orden");

let filtroActual = "todos";
let regionActual = "";

const imagenes = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80"
];

const tipos = [
  {
    nombre: "Hospedaje acogedor",
    tipo: "economico",
    descripcion: "Ejemplo de una opción sencilla para descansar durante tu viaje.",
    precio: 90,
    imagen: imagenes[0]
  },
  {
    nombre: "Estadía con encanto",
    tipo: "confort",
    descripcion: "Ejemplo de una habitación cómoda para disfrutar tu escapada.",
    precio: 180,
    imagen: imagenes[1]
  },
  {
    nombre: "Descanso especial",
    tipo: "confort",
    descripcion: "Ejemplo de un alojamiento con espacios pensados para relajarte.",
    precio: 250,
    imagen: imagenes[2]
  }
];

function fechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

const hoy = new Date();
const hoyTexto = fechaLocal(hoy);

entrada.min = hoyTexto;
salida.min = hoyTexto;

entrada.addEventListener("change", () => {
  salida.min = entrada.value || hoyTexto;

  if (salida.value && salida.value <= entrada.value) {
    salida.value = "";
  }
});

function mostrarAlojamientos() {
  if (!regionActual) {
    lista.innerHTML = "";
    estadoVacio.hidden = false;
    return;
  }

  let resultados = tipos.filter(alojamiento => {
    return filtroActual === "todos" || alojamiento.tipo === filtroActual;
  });

  if (orden.value === "precio") {
    resultados.sort((a, b) => a.precio - b.precio);
  }

  lista.innerHTML = "";

  resultados.forEach(alojamiento => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const imagen = document.createElement("img");
    imagen.src = alojamiento.imagen;
    imagen.alt = "Fotografía ilustrativa de alojamiento";
    imagen.loading = "lazy";

    const contenido = document.createElement("div");
    contenido.className = "tarjeta-contenido";

    const etiqueta = document.createElement("span");
    etiqueta.className = "region-tag";
    etiqueta.textContent = regionActual;

    const nombre = document.createElement("h3");
    nombre.textContent = alojamiento.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = alojamiento.descripcion;

    const pie = document.createElement("div");
    pie.className = "tarjeta-pie";

    const tipo = document.createElement("span");
    tipo.className = "tipo " + alojamiento.tipo;
    tipo.textContent = alojamiento.tipo === "economico"
      ? "Económico"
      : "Confort";

    const precio = document.createElement("div");
    precio.className = "precio";
    precio.textContent = `S/ ${alojamiento.precio}`;

    const detallePrecio = document.createElement("small");
    detallePrecio.textContent = "Precio de ejemplo por noche";
    precio.appendChild(detallePrecio);

    pie.append(tipo, precio);
    contenido.append(etiqueta, nombre, descripcion, pie);
    tarjeta.append(imagen, contenido);
    lista.appendChild(tarjeta);
  });

  estadoVacio.hidden = resultados.length > 0;

  if (resultados.length === 0) {
    estadoVacio.querySelector("h3").textContent =
      "No hay opciones para este filtro";
    estadoVacio.querySelector("p").textContent =
      "Prueba seleccionando otro filtro.";
  }

  titulo.textContent = `Alojamientos en ${regionActual}`;
  texto.textContent =
    `Explora ejemplos de diseño para ${personas.value} viajero(s).`;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!region.value) {
    mensaje.textContent = "Por favor, selecciona una región.";
    return;
  }

  if (!entrada.value || !salida.value) {
    mensaje.textContent = "Selecciona tus fechas de llegada y salida.";
    return;
  }

  if (entrada.value < hoyTexto) {
    mensaje.textContent = "La fecha de llegada no puede estar en el pasado.";
    return;
  }

  if (salida.value <= entrada.value) {
    mensaje.textContent =
      "La fecha de salida debe ser posterior a la llegada.";
    return;
  }

  regionActual = region.value;
  filtroActual = "todos";

  filtros.forEach(boton => {
    boton.classList.toggle(
      "activo",
      boton.dataset.filtro === "todos"
    );
  });

  mensaje.textContent =
    "Mostrando tarjetas de demostración. Los precios no son reales.";

  mostrarAlojamientos();

  document.getElementById("alojamientos").scrollIntoView({
    behavior: "smooth"
  });
});

document.querySelectorAll(".destino").forEach(boton => {
  boton.addEventListener("click", () => {
    region.value = boton.dataset.region;
    document.querySelector(".buscador").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    mensaje.textContent =
      `Elegiste ${boton.dataset.region}. Selecciona las fechas y pulsa Buscar.`;
  });
});

filtros.forEach(boton => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filtro;

    filtros.forEach(item => {
      item.classList.toggle("activo", item === boton);
    });

    mostrarAlojamientos();
  });
});

orden.addEventListener("change", mostrarAlojamientos);
personas.addEventListener("change", mostrarAlojamientos);