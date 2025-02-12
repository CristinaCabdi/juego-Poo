// Clase base que contiene las propiedades y métodos comunes
class Entidad {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Método para actualizar la posición del elemento
  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  // Método para verificar si dos objetos colisionan
  colisionaConOtroObjeto(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}


// Clase Personaje (Alumno)
class Personaje extends Entidad {
  constructor() {
    super(50, 300, 50, 70); // Posición inicial y tamaño (con mochila)
    this.velocidad = 10;
    this.saltando = false;
    this.alturaSalto = 220;

    this.element = document.createElement("div");
    this.element.classList.add("personaje"); // Clase CSS para el personaje

  // Establecemos la imagen inicial del personaje
    this.element.style.backgroundImage = "url('../public/img/caminando.png')";

    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.actualizarPosicion();
  }

  // Método para mover el personaje (izquierda/derecha)
  mover(evento) {
    const containerWidth = this.element.parentElement.offsetWidth;

    if (evento.key === "ArrowRight" && this.x + this.width < containerWidth) {
      this.x += this.velocidad; // Mueve el personaje a la derecha
      this.element.style.backgroundImage = "url('../public/img/caminando.png')"; // Cambiar imagen a caminar
      this.element.classList.add("caminando"); // Clase de caminar
      this.element.classList.remove("saltando"); // Aseguramos que se quite la clase de saltar mientras camina
    } else if (evento.key === "ArrowLeft" && this.x > 0) {
      this.x -= this.velocidad; // Mueve el personaje a la izquierda
      this.element.style.backgroundImage = "url('../public/img/saltando.png')"; // Cambiar imagen a caminar
      this.element.classList.add("caminando"); // Clase de caminar
      this.element.classList.remove("saltando"); // Aseguramos que se quite la clase de saltar mientras camina
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar(); // Si presionan la tecla "arriba", el personaje salta
    }

    this.actualizarPosicion();
  }

  // Método para saltar
  saltar() {
    if (!this.saltando) {
      this.saltando = true;
      let alturaMaxima = this.y - this.alturaSalto;

    // Cambiar la clase a "saltando" cuando el personaje empieza a saltar
    this.element.style.backgroundImage = "url('../public/img/saltando.png')"; // Cambiar la imagen a saltar
    this.element.classList.add("saltando");
    this.element.classList.remove("caminando"); // Aseguramos que se quite la clase de caminar mientras salta


      // Proceso de salto
      const salto = setInterval(() => {
        if (this.y > alturaMaxima) {
          this.y -= 10; // Subir el personaje
        } else {
          clearInterval(salto); // Termina el salto cuando llega a la altura máxima
          this.caer();
        }
        this.actualizarPosicion();
      }, 20);
    }
  }

  // Método para que el personaje caiga después de saltar
  caer() {
    const gravedad = setInterval(() => {
      if (this.y < 300) {
        this.y += 10; // El personaje cae hasta el suelo
      } else {
        clearInterval(gravedad); // Se detiene la caída cuando llega al suelo
        this.y = 300; // Aseguramos que quede en la posición final del suelo
        this.saltando = false; // El personaje ya no está saltando

         // Al finalizar el salto, volvemos a poner la imagen de caminar
         this.element.style.backgroundImage = "url('../public/img/caminando.png')"; // Cambiar la imagen a caminar
         this.element.classList.remove("saltando");
         this.element.classList.add("caminando");
       }
      this.actualizarPosicion();
    }, 20);
  }

  // Método para detectar colisiones (si el personaje choca con un objeto)
  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

// Clase Moneda (Objetivo)
class Moneda extends Entidad {
  constructor(tipo, listaErrores, listaMonedas) {
    // Generamos una posición aleatoria
    super(Math.random() * 700 + 250, Math.random() * 150 + 150, 30, 30);

    this.tipo = tipo;
    this.listaErrores = listaErrores;  // Lista de errores (para evitar colisiones)
    this.listaMonedas = listaMonedas;  // Lista de monedas (para evitar colisiones)
    
    // Crear el elemento de la "moneda"
    this.element = document.createElement("div");
    this.element.classList.add("moneda");

    // Definir qué imagen debe representar la moneda (HTML, CSS, JS)
    this.setContenido(); // Llamamos al método que asigna la imagen correspondiente
    
    // Verificamos que la moneda no colisione con ninguna otra moneda o error
    let colisionando = true;
    while (colisionando) {
      colisionando = false;
      
      // Comprobamos colisiones con otras monedas
      for (let moneda of this.listaMonedas) {
        if (this.colisionaConOtroObjeto(moneda)) {
          colisionando = true; // Si hay colisión, se marca como colisionando
          break;
        }
      }

      // Comprobamos colisiones con los errores de sintaxis
      for (let error of this.listaErrores) {
        if (this.colisionaConOtroObjeto(error)) {
          colisionando = true; // Si hay colisión con un error, también marcamos colisionando
          break;
        }
      }

      // Si colisiona, generamos nuevas coordenadas aleatorias para la moneda
      if (colisionando) {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
      }
    }

    // Actualizamos la posición de la moneda después de las verificaciones
    this.actualizarPosicion();
  }

  // Método para verificar si dos objetos colisionan
  colisionaConOtroObjeto(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }

  // Método para establecer el contenido visual del "símbolo" (usando imágenes)
  setContenido() {
    let imagenUrl = ""; // Variable para almacenar la URL de la imagen

    // Asignamos la imagen dependiendo del tipo de moneda
    if (this.tipo === "html") {
      if (Math.random() < 0.5) {
        imagenUrl = "./public/img/html-icon/7903652.png";
      } else {
        imagenUrl = "./public/img/html-icon/5986100.png";
      }
    }
    if (this.tipo === "css") {
      if (Math.random() < 0.5) {
        imagenUrl = "./public/img/css-icon/186319.png";
      } else {
        imagenUrl = "./public/img/css-icon/3368825.png";
      }
    }
    if (this.tipo === "js") {
      if (Math.random() < 0.5) {
        imagenUrl = "./public/img/js-icon/13192332.png";
      } else {
        imagenUrl = "./public/img/js-icon/16511135.png";
      }
    }

    // Crear una etiqueta <img> con la URL de la imagen
    const img = document.createElement("img");
    img.src = imagenUrl; // Asignar la URL de la imagen
    img.alt = this.tipo; // Establecer un texto alternativo
    img.style.width = "100%"; // Hacer que la imagen ocupe todo el tamaño de la moneda
    img.style.height = "100%"; // Hacer que la imagen ocupe todo el tamaño de la moneda

    // Limpiar el contenido de la moneda y agregar la imagen
    this.element.innerHTML = "";
    this.element.appendChild(img); // Agregar la imagen al elemento de la moneda
  }

  // Método para actualizar la posición de la moneda (en el contenedor)
  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

// Clase ErrorDeSintaxis (Obstáculo)
class ErrorDeSintaxis extends Entidad {
  constructor() {
    super(Math.random() * 700 + 50, Math.random() * 250 + 50, 40, 40); // Llamada al constructor de la clase base

    this.element = document.createElement("div");
    this.element.classList.add("error"); // Clase CSS para los errores de sintaxis
    this.actualizarPosicion();
  }
}

// Clase Game que gestiona el juego
class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.personaje = new Personaje(); // Crear el personaje
    this.monedas = [];
    this.errores = [];
    this.puntuacion = 0;

    //Crear monedas y
    this.crearEscenario();
    this.agregarEventos();
  }

 // Método para crear el escenario con diferentes tipos de monedas
crearEscenario() {
  this.container.appendChild(this.personaje.element); // Añadir el personaje al contenedor

  // Crear las monedas con símbolos de HTML, CSS y JS
  const tipos = ["html", "css", "js"];
  for (let i = 0; i < 5; i++) {
    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    const moneda = new Moneda(tipoAleatorio, this.errores, this.monedas);
    this.monedas.push(moneda); // Asegúrate de que la moneda se agrega a la lista
    this.container.appendChild(moneda.element); // Añadir la moneda al contenedor
  }

  // Crear los errores de sintaxis
  for (let i = 0; i < 3; i++) {
    const error = new ErrorDeSintaxis(); // Crear un error
    this.errores.push(error);
    this.container.appendChild(error.element); // Añadir el error al contenedor
  }
}


  // Agregar eventos de teclado
  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    this.checkColisiones();
  }

  // Comprobar las colisiones entre el personaje, las monedas y los errores
  checkColisiones() {
    setInterval(() => {
      // Comprobamos si el personaje recoge monedas
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.puntuacion += 10; // Aumentamos la puntuación por recoger una moneda
        }
      });

      // Comprobamos si el personaje choca con un error de sintaxis
      this.errores.forEach((error, index) => {
        if (this.personaje.colisionaCon(error)) {
          this.container.removeChild(error.element);
          this.errores.splice(index, 1);
          this.puntuacion -= 5; // Restamos puntos por chocar con un error
        }
      });
    }, 100);
  }
}

// Iniciar el juego
const juego = new Game();

