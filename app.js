const data = [
  { id: "p01", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Mar", desc: "Horizontes y calma", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Rio", desc: "Tranquilidad", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: " Alaska salvaje", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Cañon", desc: " Desierto rojizo", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

//recuperar elementos del DOM
const thumbs = document.querySelector("#thumbs"); //miniaturas
const heroImg = document.querySelector("#heroImg"); //imagen principal
const heroTitle = document.querySelector("#heroTitle"); //titulo de la imagen
const heroDesc = document.querySelector("#heroDesc"); //descripción de la imagen
const counter = document.querySelector("#counter"); //controlador de imagenes
const likeBtn = document.querySelector("#likeBtn"); //boton de "me gusta"

//trabajar con el estado de la aplicacion
let currentIndex = 0;//indice de la imagen actual
const likes = {}; //objeto para almacenar los "me gusta" por imagen

// renderizar las miniaturas
function renderThumbs() {
  thumbs.innerHTML = data.map((item, index) => {
    return `
      <article class="thumb ${index === currentIndex ? "active" : ""}" data-index="${index}">
        <span class="badge">${index + 1}</span>
        <img src="${item.src}" alt="${item.title}" /> 
      </article>
    `;
  }).join("");
}

function renderHero(index) {
  const item = data[index];

  //actualizar la imagen principal
  heroImg.src = item.src;
  heroImg.alt = item.title;

  //actualizar el titulo y la descripcion
  heroTitle.textContent = item.title;
  heroDesc.textContent = item.desc;

  //actualizar el contador
  counter.textContent = `${index + 1} / ${data.length}`;

  //recorrer miniaturas para marcar la activa
  document.querySelectorAll(".thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  //realizar si la imagen actual tiene like
  const isLiked = likes[item.id] === true;

  //cambiar el simbolo del boton
  likeBtn.textContent = isLiked ? "❤️" : "🤍";

  //aplicar o quitar la clase visual
  likeBtn.classList.toggle("on", isLiked);
}
 
  //listener para clicks en las miniaturas
  thumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return; //si no se hizo click en una miniatura, salir

    currentIndex = Number(thumb.dataset.index); //actualizar el indice actual
    renderHero(currentIndex); //renderizar la imagen principal
  });

  renderThumbs(); //llamar a la función para mostrar las miniaturas
  renderHero(currentIndex); // mostrar la imagen inicial