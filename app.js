// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiW9wT6wBcI54zhAiR_4bV4HqMGC037wU",
  databaseURL: "https://tp-robotica-y-progracion-default-rtdb.firebaseio.com",
  projectId: "tp-robotica-y-progracion"
};

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3. Referencias a los botones HTML
const btnLuz = document.getElementById("btn-luz");
const btnIntermitente = document.getElementById("btn-intermitente");

let estadoActual = false;
let intervaloIntermitente = null;
let modoIntermitente = false;

// 4. Leer el estado de la luz en tiempo real
db.ref("/Luz/estado").on("value", (snapshot) => {
  estadoActual = snapshot.val();
  
  if (estadoActual === true) {
    btnLuz.textContent = "Luz ENCENDIDA";
    btnLuz.classList.add("on");
  } else {
    btnLuz.textContent = "Luz APAGADA";
    btnLuz.classList.remove("on");
  }
});

// 5. Botón de Encendido/Apagado normal
btnLuz.addEventListener("click", () => {
  // Si estaba en intermitente, lo apaga primero
  if (modoIntermitente) {
    detenerIntermitente();
  }
  
  const nuevoEstado = !estadoActual;
  db.ref("/Luz/estado").set(nuevoEstado);
});

// 6. Botón de Modo Intermitente
btnIntermitente.addEventListener("click", () => {
  modoIntermitente = !modoIntermitente;
  
  if (modoIntermitente) {
    // Activa el diseño del botón
    btnIntermitente.textContent = "Intermitente: ACTIVADO";
    btnIntermitente.classList.add("active-warning");
    
    // Inicia un bucle que cambia el estado cada 1 segundo (1000 milisegundos)
    intervaloIntermitente = setInterval(() => {
      db.ref("/Luz/estado").set(!estadoActual);
    }, 1000);
    
  } else {
    detenerIntermitente();
  }
});

// Función auxiliar para detener el parpadeo
function detenerIntermitente() {
  modoIntermitente = false;
  btnIntermitente.textContent = "Modo Intermitente";
  btnIntermitente.classList.remove("active-warning");
  clearInterval(intervaloIntermitente);
  db.ref("/Luz/estado").set(false); // Apaga la luz al detener
}
