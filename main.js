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
      this.element.style.backgroundImage = "url('../public/img/caminando.png')"; // Cambiar imagen a caminar
      this.element.classList.add("caminando"); // Clase de caminar
      this.element.classList.remove("saltando"); // Aseguramos que se quite la clase de saltar mientras camina
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar(); // Si presionan la tecla "arriba", el personaje salta
    }

    this.actualizarPosicion();
  }

  // Método para saltar
  saltar() {
    this.element.style.backgroundImage = "url('../public/img/saltando.png')"; // Cambiar imagen a saltar
      if (!this.saltando && (this.puedeSaltarEnAire || !this.cayendo)) {
          if (this.cayendo) {
              this.puedeSaltarEnAire = false;  // Ya usó el salto en el aire
              clearInterval(this.intervaloGravedad); // Interrumpe la caida
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
            this.puedeSaltarEnAire = true; // Resetea el flag al tocar el suelo
            this.y = containerHeight - this.height;
            this.actualizarPosicion();
            return;
        }
        this.actualizarPosicion();
    }, 20);
}

  updPosition(){
    this.element.style.left = `${this.x}px`
    this.element.style.top = `${this.y}px`
  }

  collisionWhit(obj){
    return (
        this.x < obj.x + obj.width &&
        this.x + this.width > obj.x &&
        this.y < obj.y + obj.height &&
        this.y + this.height > obj.y
      );
  }
}

class Moneda extends Entidad {
  constructor(tipo, listaErrores, listaMonedas) {
    // Obtenemos las dimensiones del contenedor del juego
    const containerWidth = document.getElementById("game-container").offsetWidth;
    const containerHeight = document.getElementById("game-container").offsetHeight;
    let x, y;
    let colisionando = true;
  
    // Generamos la posición aleatoria hasta que no haya colisiones
    while (colisionando) {
      colisionando = false;
      
      // Generamos coordenadas aleatorias con un margen de 50px
      x = Math.random() * (containerWidth - 80) + 40; // Margen de 40px en el eje x
      y = Math.random() * (containerHeight - 80) + 40; // Margen de 40px en el eje y
  
      // Comprobamos colisiones con otras monedas
      for (let moneda of listaMonedas) {
        // Comprobamos si la nueva moneda está a menos de 50px de otra
        const distanciaX = Math.abs(x - moneda.x);
        const distanciaY = Math.abs(y - moneda.y);
        if (distanciaX < 50 && distanciaY < 50) {
          colisionando = true; // Si hay colisión, reiniciamos la generación
          break;
        }
      }
  
      // Además, podemos agregar una comprobación con los errores de sintaxis si es necesario:
      for (let error of listaErrores) {
        // Comprobamos si la nueva moneda está a menos de 50px de un error
        const distanciaX = Math.abs(x - error.x);
        const distanciaY = Math.abs(y - error.y);
        if (distanciaX < 50 && distanciaY < 50) {
          colisionando = true; // Si hay colisión con un error, reiniciamos la generación
          break;
        }
      }
    }
  
    // Llamamos al constructor de la clase base (Entidad)
    super(x, y, 30, 30);
  
    this.tipo = tipo;
    this.listaErrores = listaErrores;  // Lista de errores (para evitar colisiones)
    this.listaMonedas = listaMonedas;  // Lista de monedas (para evitar colisiones)
  
    // Crear el elemento de la "moneda"
    this.element = document.createElement("div");
    this.element.classList.add("moneda");
  
    // Definir qué imagen debe representar la moneda (HTML, CSS, JS)
    this.setContenido(); // Llamamos al método que asigna la imagen correspondiente
  
    // Actualizamos la posición de la moneda después de las verificaciones
    this.actualizarPosicion();
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

    // Añadir el contador de puntos en el HTML
    this.contadorPuntosElement = document.getElementById("puntaje");

    // Crear el escenario con monedas y errores
    this.crearEscenario();
    this.agregarEventos();
    this.comprobarMonedas(); // Asegura que siempre haya al menos 5 monedas
    this.agregarMusicaDeFondo();
    this.agregarControlMusica();
  }

   // Método para actualizar la puntuación en el HTML
   actualizarContadorPuntos() {
    this.contadorPuntosElement.textContent = this.puntuacion;
  }

  // Método para agregar la música de fondo
  agregarMusicaDeFondo() {
    // Crear el elemento de audio
    this.musicaFondo = new Audio("./sounds/o-coelhinho-que-cacava-baloes-258711.mp3"); // Ruta al archivo de música
    this.musicaFondo.loop = true; // Reproducir la música en bucle
    this.musicaFondo.volume = 0.2; // Volumen de la música (de 0 a 1)
    this.musicaFondo.play(); // Iniciar la reproducción de la música
    this.musicaEncendida = true; // Variable para saber si la música está encendida
  }


  // Método para agregar el control de música (encender/apagar)
  agregarControlMusica() {
    const btnControlMusica = document.getElementById("btnControlMusica");

    // Agregar un evento de clic al botón
    btnControlMusica.addEventListener("click", () => {
      if (this.musicaEncendida) {
        this.musicaFondo.pause(); // Pausar la música
        btnControlMusica.textContent = "Encender Música"; // Cambiar texto del botón
      } else {
        this.musicaFondo.play(); // Reanudar la música
        btnControlMusica.textContent = "Apagar Música"; // Cambiar texto del botón
      }

      // Cambiar el estado de la música (encendida/apagada)
      this.musicaEncendida = !this.musicaEncendida;
    });
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
        if (this.personaje.colisionaConOtroObjeto(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.puntuacion++; // Aumentamos la puntuación por recoger una moneda
          this.actualizarContadorPuntos(); // Actualizar el contador de puntos
          const sonidoAcierto = new Audio("./sounds/ding-idea-40142.mp3"); // Ruta al sonido de error
          sonidoAcierto.play(); // Reproducir el sonido de error
        }
      });
      // Comprobamos si el personaje choca con un error de sintaxis
      this.errores.forEach((error, index) => {
        if (this.personaje.colisionaConOtroObjeto(error)) {
          this.container.removeChild(error.element);
          this.errores.splice(index, 1);
          this.actualizarContadorPuntos(); // Actualizar el contador de puntos
          const sonidoError = new Audio("./sounds/error-126627.mp3"); // Ruta al sonido de error
          sonidoError.play(); // Reproducir el sonido de error
          sonidoError.play(); // Reproducir el sonido de error
        }
      });
        }, 100);
      }

    // Método para comprobar que siempre haya exactamente 5 monedas normales y 3 de error
    comprobarMonedas() {
      setInterval(() => {
        // Si el número de monedas normales es menor a 5, añadir monedas hasta llegar a 5
        while (this.monedas.filter(moneda => !this.errores.includes(moneda)).length < 5) {
          const tipos = ["html", "css", "js"];
          const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
          const moneda = new Moneda(tipoAleatorio, this.errores, this.monedas);
          this.monedas.push(moneda);
          this.container.appendChild(moneda.element);
        }
  
        // Si el número de errores es menor a 3, añadir errores hasta llegar a 3
        while (this.errores.length < 3) {
          const error = new ErrorDeSintaxis(); // Crear un error
          this.errores.push(error);
          this.container.appendChild(error.element); // Añadir el error al contenedor
        }
      }, 1000); // Comprobar cada segundo
    }
  }
  
  // Iniciar el juego
  const juego = new Game();


