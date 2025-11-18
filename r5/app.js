const API_KEY = "e4021c7a2d0cb39a6fe44014e450f27c";

const URL = `https://gnews.io/api/v4/top-headlines?lang=es&country=es&max=10&apikey=e4021c7a2d0cb39a6fe44014e450f27c`;

const contenedor = document.getElementById("contenedor-noticias");
const btnRefrescar = document.getElementById("btn-refrescar");

async function cargarNoticias() {
  contenedor.innerHTML = `<p class="estado">Cargando noticias...</p>`;

  try {
    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
      throw new Error("Error al conectar con la API");
    }

    const datos = await respuesta.json();

    console.log(datos);

    if (!datos.articles || datos.articles.length === 0) {
      contenedor.innerHTML = `<p class="estado">No hay noticias disponibles.</p>`;
      return;
    }

    mostrarNoticias(datos.articles);

  } catch (error) {
    contenedor.innerHTML = `<p class="estado">❌ No se pudieron cargar las noticias. Intenta de nuevo más tarde.</p>`;
  }
}

function mostrarNoticias(noticias) {
  contenedor.innerHTML = "";

  noticias.forEach(noticia => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("noticia");

    tarjeta.innerHTML = `
    <h2><a href="${noticia.url}" target="_blank">${noticia.title}</a></h2>
    ${noticia.image ? `<img src="${noticia.image}" alt="Imagen de noticia">` : ""}
    <p>${noticia.description || "Sin descripción disponible."}</p>
    <span class="fuente">Fuente: ${noticia.source.name}</span>
    `;

    contenedor.appendChild(tarjeta);
  });
}

btnRefrescar.addEventListener("click", cargarNoticias);

cargarNoticias();
