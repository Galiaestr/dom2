const data = [
  { id: "p01", title: "Montaña", desc: "Rocas y niebla", src: "https://picsum.photos/id/1018/1200/675" },
  { id: "p02", title: "Mar", desc: "Horizontes y calma", src: "https://picsum.photos/id/1015/1200/675" },
  { id: "p03", title: "Rio", desc: "Tranquilidad", src: "https://picsum.photos/id/1011/1200/675" },
  { id: "p04", title: "Bosque", desc: " Alaska salvaje", src: "https://picsum.photos/id/1020/1200/675" },
  { id: "p05", title: "Cañon", desc: " Desierto rojizo", src: "https://picsum.photos/id/1016/1200/675" },
  { id: "p06", title: "Ruta", desc: "Camino en perspectiva", src: "https://picsum.photos/id/1005/1200/675" }
];

//recuperar elementos del DOM
const frame = document.querySelector(".frame");
const thumbs = document.querySelector("#thumbs"); //miniaturas
const heroImg = document.querySelector("#heroImg"); //imagen principal
const heroTitle = document.querySelector("#heroTitle"); //titulo de la imagen
const heroDesc = document.querySelector("#heroDesc"); //descripción de la imagen
const counter = document.querySelector("#counter"); //controlador de imagenes
const likeBtn = document.querySelector("#likeBtn"); //boton de "me gusta"

const prevBtn = document.querySelector("#prevBtn"); //boton de imagen "anterior"
const nextBtn = document.querySelector("#nextBtn"); //boton de imagen "siguiente"
const playBtn = document.querySelector("#playBtn"); //boton de "reproducir"

//trabajar con el estado de la aplicacion
let currentIndex = 0;//indice de la imagen actual
const likes = {}; //objeto para almacenar los "me gusta" por imagen

let autoPlayId = null; //variable para almacenar el id del intervalo de autoplay
let isPlaying = false; //estado de reproducción automática
const AUTO_TIME = 2500; //tiempo entre cambios automaticos (2 segundos y medio)

//dots y tracks no existen en el dom actual
//se intentan buscar, pero si no estan se crearan
//usando JS
let dots = document.querySelector("#dots");
let track = document.querySelector("#.track");

//variables para detectar swipe (deslizamiento)
let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;
//distancia minima para considerar un swipe  
const SWIPE_THRESHOLD = 50;

//vrear un track del carrusel
//crear un conenedor -track que tendra todas las imagenes
//alineadas horizontalmente 
//es la base el efectoo slode con translateX 
function createTrack() {
  // si existe no hacer nada
  if (track) return;

  //si no existe, crear el track
  track = document.createElement("div");
  track.className = "track";

  data.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.title;
    track.appendChild(img);
  });
  frame.prepend(track);
}

//crear dots
//crear los botones indicadores del carrusel
//cada dot va a representar una imagen
//el dot activo debe coincidir con currentIndex
function createDots() {
  if (!dots) {
    dots = document.createElement("div");
    dots.id = "dots";
    dots.className = "dots";
    frame.appendChild(dots);
  }

  dots.innerHTML = data.map((_, index) => {
    return `
      <button
      class = "dot ${index === currentIndex ?? "active"}
      type = "button"
      data-index = "${index}"
      aria-label = "Ir a la imagen ${index + 1}">
      </button>
    `;
  }).join("");


}


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

//funcion para mostrar
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

//listener para el boton de "me gusta
likeBtn.addEventListener("click", () => {
  const currentItem = data[currentIndex];
  //alternar el estado de "me gusta" para la imagen actual
  likes[currentItem.id] = !likes[currentItem.id];

  const isLiked = likes[currentItem.id]; //verificar el nuevo estado
  likeBtn.textContent = isLiked ? "❤️" : "🤍";
  likeBtn.classList.toggle("on", isLiked); //aplicar o quitar la clase visual
  likeBtn.setAttribute("aria-pressed", isLiked); //actualizar el atributo aria-pressed para accesibilidad
});

//cambiar el boton de play a pause
function updatePlayButton() {
  playBtn.textContent = isPlaying ? "⏸️" : "▶️";
  playBtn.dataset.state = isPlaying ? "pause" : "play";
}

function changeSlide(newIndex) {
  heroImg.classList.add("fade-out"); //agregar clase de animaciónv de salida
  setTimeout(() => {
    currentIndex = newIndex; //actualizar el indice actual 
    renderHero(currentIndex); //renderizar la nueva imagen principal
    heroImg.classList.remove("fade-out"); //quitar clase para animación de salida
  }, 350);
}

function nextSlide() {
  const newIndex = (currentIndex + 1) % data.length; //calcular el indice devla siguiente imagen
  changeSlide(newIndex);
}

function prevSlide() {
  const newIndex = (currentIndex - 1 + data.length) % data.length; // calcular
  changeSlide(newIndex);
}

function startAutoPlay() {
  autoPlayId = setInterval(() => {
    nextSlide();
  }, AUTO_TIME);
  isPlaying = true;
  updatePlayButton();
}

function stopAutoPlay() {
  clearInterval(autoPlayId);
  autoPlayId = null;
  isPlaying = false;
  updatePlayButton();
}

function toggleAutoPlay() {
  if (isPlaying) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
playBtn.addEventListener("click", toggleAutoPlay);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    prevSlide();
  }
});


renderThumbs(); //llamar a la función para mostrar las miniaturas
renderHero(currentIndex); // mostrar la imagen inicial