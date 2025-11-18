const API_KEY = "pub_7d55c668d5c04cc493869479fe1e7e10";

const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=es&q=noticias&size=5`;

const contenedor = document.getElementById("contenedor-noticias");
const btnRefrescar = document.getElementById("btn-refrescar");

async function cargarNoticias() {
  contenedor.innerHTML = `<p class="estado">Cargando noticias...</p>`;

  try {
    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
      throw new Error("Error con la API.");
    }

    const datos = await respuesta.json();

    if (!datos.results || datos.results.length === 0) {
      contenedor.innerHTML = `<p class="estado">No hay noticias disponibles. Prueba ampliando la búsqueda.</p>`;
      return;
    }

    mostrarNoticias(datos.results);

  } catch (error) {
    contenedor.innerHTML = `<p class="estado">X Error al cargar noticias.</p>`;
    console.warn(error);
  }
}

function mostrarNoticias(noticias) {
  contenedor.innerHTML = "";

  noticias.forEach(noticia => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("noticia");

    tarjeta.innerHTML = `
    <h2><a href="${noticia.link}" target="_blank">${noticia.title}</a></h2>
    ${noticia.image_url ? `<img src="${noticia.image_url}" alt="Imagen de noticia">` : ""}
    <p>${noticia.description || "Sin descripción disponible."}</p>
    <span class="fuente">Fuente: ${noticia.source_id}</span>
    `;

    contenedor.appendChild(tarjeta);
  });
}

btnRefrescar.addEventListener("click", cargarNoticias);

cargarNoticias();
