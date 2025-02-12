// Clase base que contiene las propiedades y métodos comunes
class Entidad {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Método común para actualizar la posición
  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
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
  constructor() {
    super(Math.random() * 700 + 50, Math.random() * 250 + 50, 30, 30); // Llamada al constructor de la clase base

    this.element = document.createElement("div");
    this.element.classList.add("moneda");
    this.actualizarPosicion();
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

    this.crearEscenario();
    this.agregarEventos();
  }

  // Crear el escenario inicial
  crearEscenario() {
    this.container.appendChild(this.personaje.element); // Añadir el personaje al contenedor

    // Crear las monedas
    for (let i = 0; i < 5; i++) {
      const moneda = new Moneda(); // Crear una moneda
      this.monedas.push(moneda);
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

