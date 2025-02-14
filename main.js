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
    this.element.classList.add("personaje");

    // Establecemos la imagen inicial del personaje
    this.element.style.backgroundImage = "url('./public/img/caminando.png')";

    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.actualizarPosicion();
  }

  // Método para mover el personaje (izquierda/derecha)
  mover(evento) {
    const containerWidth = this.element.parentElement.offsetWidth;

    if (evento.key === "ArrowRight" && this.x + this.width < containerWidth) {
      this.x += this.velocidad;
      this.element.style.backgroundImage = "url('./public/img/caminando.png')";
      this.element.classList.add("caminando");
      this.element.classList.remove("saltando");
    } else if (evento.key === "ArrowLeft" && this.x > 0) {
      this.x -= this.velocidad;
      this.element.style.backgroundImage = "url('./public/img/caminando.png')";
      this.element.classList.add("caminando");
      this.element.classList.remove("saltando");
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar(); 
    }

    this.actualizarPosicion();
  }

  // Método para saltar
  saltar() {
    this.element.style.backgroundImage = "url('./public/img/saltando.png')";
    if (!this.saltando && (this.puedeSaltarEnAire || !this.cayendo)) {
      if (this.cayendo) {
        this.puedeSaltarEnAire = false;
        clearInterval(this.intervaloGravedad);
        this.intervaloGravedad = null;
        this.cayendo = false;
      }

      this.saltando = true;
      let alturaMaxima = this.y - 170;

      this.intervaloSalto = setInterval(() => {
        if (this.y > alturaMaxima) {
          this.y -= 10;
        } else {
          clearInterval(this.intervaloSalto);
          this.intervaloSalto = null;
          this.saltando = false;
          this.caer();
        }
        this.actualizarPosicion();
      }, 20);
    }
  }

  caer() {
    this.cayendo = true;
    const containerHeight = this.element.parentElement.offsetHeight;
    this.intervaloGravedad = setInterval(() => {
      if (this.y + this.height < containerHeight) {
        this.y += 10;
      } else {
        clearInterval(this.intervaloGravedad);
        this.intervaloGravedad = null;
        this.cayendo = false;
        this.puedeSaltarEnAire = true;
        this.y = containerHeight - this.height;
        this.actualizarPosicion();
      }
      this.actualizarPosicion();
    }, 20);
  }
}

// Clase Moneda
class Moneda extends Entidad {
  constructor(tipo, listaErrores, listaMonedas) {
    const containerWidth = document.getElementById("game-container").offsetWidth;
    const containerHeight = document.getElementById("game-container").offsetHeight;
    let x, y;
    let colisionando = true;

    // Generamos la posición aleatoria hasta que no haya colisiones
    while (colisionando) {
      colisionando = false;
      x = Math.random() * (containerWidth - 80) + 40;
      y = Math.random() * (containerHeight - 80) + 40;

      // Verificación de colisiones con otras monedas
      for (let moneda of listaMonedas) {
        const distanciaX = Math.abs(x - moneda.x);
        const distanciaY = Math.abs(y - moneda.y);
        if (distanciaX < 50 && distanciaY < 50) {
          colisionando = true;
          break;
        }
      }

      // Comprobamos colisiones con errores de sintaxis
      for (let error of listaErrores) {
        const distanciaX = Math.abs(x - error.x);
        const distanciaY = Math.abs(y - error.y);
        if (distanciaX < 50 && distanciaY < 50) {
          colisionando = true;
          break;
        }
      }
    }

    super(x, y, 30, 30);
    this.tipo = tipo;
    this.listaErrores = listaErrores;
    this.listaMonedas = listaMonedas;

    this.element = document.createElement("div");
    this.element.classList.add("moneda");
    this.setContenido();
    this.actualizarPosicion();
  }

  setContenido() {
    let imagenUrl = "";
    if (this.tipo === "html") {
      imagenUrl = "./public/img/html-icon/7903652.png";
    } else if (this.tipo === "css") {
      imagenUrl = "./public/img/css-icon/186319.png";
    } else if (this.tipo === "js") {
      imagenUrl = "./public/img/js-icon/13192332.png";
    }

    const img = document.createElement("img");
    img.src = imagenUrl;
    img.alt = this.tipo;
    img.style.width = "100%";
    img.style.height = "100%";

    this.element.innerHTML = "";
    this.element.appendChild(img);
  }
}

// Clase ErrorDeSintaxis
class ErrorDeSintaxis extends Entidad {
  constructor() {
    super(Math.random() * 700 + 50, Math.random() * 250 + 50, 40, 40);
    this.element = document.createElement("div");
    this.element.classList.add("error");
    this.actualizarPosicion();
  }
}

// Clase Game
class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.personaje = new Personaje();
    this.monedas = [];
    this.errores = [];
    this.puntuacion = 0;
    this.contadorPuntosElement = document.getElementById("puntaje");
    this.crearEscenario();
    this.agregarEventos();
    this.comprobarMonedas();
    this.agregarMusicaDeFondo();
    this.agregarControlMusica();
  }

  // Método para agregar la música de fondo
  agregarMusicaDeFondo() {
    this.musicaFondo = new Audio("./sounds/o-coelhinho-que-cacava-baloes-258711.mp3");
    this.musicaFondo.loop = true;
    this.musicaFondo.volume = 0.2;
    this.musicaFondo.play();
    this.musicaEncendida = true;
  }

  // Método para agregar control de música
  agregarControlMusica() {
    const btnControlMusica = document.getElementById("btnControlMusica");
    btnControlMusica.addEventListener("click", () => {
      if (this.musicaEncendida) {
        this.musicaFondo.pause();
        btnControlMusica.textContent = "Encender Música";
      } else {
        this.musicaFondo.play();
        btnControlMusica.textContent = "Apagar Música";
      }
      this.musicaEncendida = !this.musicaEncendida;
    });
  }

  // Método para crear el escenario
  crearEscenario() {
    this.container.appendChild(this.personaje.element);

    const tipos = ["html", "css", "js"];
    for (let i = 0; i < 5; i++) {
      const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
      const moneda = new Moneda(tipoAleatorio, this.errores, this.monedas);
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
    }

    for (let i = 0; i < 3; i++) {
      const error = new ErrorDeSintaxis();
      this.errores.push(error);
      this.container.appendChild(error.element);
    }
  }

  // Agregar eventos de teclado
  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    this.checkColisiones();
  }

  // Comprobar colisiones
  checkColisiones() {
    setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaConOtroObjeto(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          if (moneda.tipo !== "error") {
            this.puntuacion += 1;
          } else {
            this.puntuacion -= 1;
          }
          this.actualizarContadorPuntos();
          const sonidoAcierto = new Audio("./sounds/ding-idea-40142.mp3");
          sonidoAcierto.play();
        }
      });

      this.errores.forEach((error, index) => {
        if (this.personaje.colisionaConOtroObjeto(error)) {
          this.container.removeChild(error.element);
          this.errores.splice(index, 1);
          this.puntuacion -= 1;
          this.actualizarContadorPuntos();
          const sonidoError = new Audio("./sounds/error-126627.mp3");
          sonidoError.play();
        }
      });
    }, 100);
  }

  actualizarContadorPuntos() {
    if (this.puntuacion == 20) {
      this.container.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><img src="./public/img/Congratulations.gif"></div>`;
      this.contadorPuntosElement.textContent = this.puntuacion;
    } else {
      this.contadorPuntosElement.textContent = this.puntuacion;
    }
  }

  // Comprobar que siempre haya exactamente 5 monedas normales y 3 de error
  comprobarMonedas() {
    setInterval(() => {
      while (this.monedas.filter(moneda => !this.errores.includes(moneda)).length < 5) {
        const tipos = ["html", "css", "js"];
        const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
        const moneda = new Moneda(tipoAleatorio, this.errores, this.monedas);
        this.monedas.push(moneda);
        this.container.appendChild(moneda.element);
      }

      while (this.errores.length < 3) {
        const error = new ErrorDeSintaxis();
        this.errores.push(error);
        this.container.appendChild(error.element);
      }
    }, 1000);
  }
}

// Iniciar el juego
const juego = new Game();



