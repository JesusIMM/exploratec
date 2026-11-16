// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiW9wT6wBcI54zhAiR_4bV4HqMGC037wU",
  databaseURL: "https://tp-robotica-y-progracion-default-rtdb.firebaseio.com",
  projectId: "tp-robotica-y-progracion"
};

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3. Referencias al HTML
const btnLuz = document.getElementById("btn-luz");
const btnIntermitente = document.getElementById("btn-intermitente");
const btnToggleHistorial = document.getElementById("btn-toggle-historial");
const panelHistorial = document.getElementById("panel-historial");
const listaHistorial = document.getElementById("lista-historial");

let estadoActual = false;
let intervaloIntermitente = null;
let modoIntermitente = false;

// 4. Leer estado de la luz
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

// -- NUEVO: Función para guardar el registro en Firebase --
function registrarEnHistorial(estado) {
  const fecha = new Date();
  // Formatear hora (Ej: 14:30:15) y fecha (Ej: 05/11/2023)
  const horaExacta = fecha.toLocaleTimeString('es-AR') + ' (' + fecha.toLocaleDateString('es-AR') + ')';
  
  db.ref("/Luz/historial").push({
    estado: estado,
    hora: horaExacta,
    timestamp: firebase.database.ServerValue.TIMESTAMP // Marca de tiempo interna de Firebase para ordenar
  });
}

// 5. Botón Normal (Manual)
btnLuz.addEventListener("click", () => {
  if (modoIntermitente) detenerIntermitente();
  
  const nuevoEstado = !estadoActual;
  db.ref("/Luz/estado").set(nuevoEstado).then(() => {
    registrarEnHistorial(nuevoEstado); // Guarda en el historial solo los clics manuales
  });
});

// 6. Botón Intermitente
btnIntermitente.addEventListener("click", () => {
  modoIntermitente = !modoIntermitente;
  
  if (modoIntermitente) {
    btnIntermitente.textContent = "Intermitente: ACTIVADO";
    btnIntermitente.classList.add("active-warning");
    
    intervaloIntermitente = setInterval(() => {
      db.ref("/Luz/estado").set(!estadoActual);
    }, 500); 
  } else {
    detenerIntermitente();
  }
});

function detenerIntermitente() {
  modoIntermitente = false;
  btnIntermitente.textContent = "Modo Intermitente";
  btnIntermitente.classList.remove("active-warning");
  clearInterval(intervaloIntermitente);
  db.ref("/Luz/estado").set(false);
}

// -- NUEVO: Lógica del panel de historial --

// Mostrar/Ocultar el panel
btnToggleHistorial.addEventListener("click", () => {
  panelHistorial.classList.toggle("oculto");
  if (panelHistorial.classList.contains("oculto")) {
    btnToggleHistorial.textContent = "Ver Historial ⬇";
  } else {
    btnToggleHistorial.textContent = "Ocultar Historial ⬆";
  }
});

// Leer los últimos 20 registros del historial desde Firebase en tiempo real
db.ref("/Luz/historial").orderByChild("timestamp").limitToLast(20).on("value", (snapshot) => {
  listaHistorial.innerHTML = ""; // Limpiar lista actual
  
  const registros = [];
  snapshot.forEach((child) => {
    registros.push(child.val());
  });
  
  // Invertimos el array para que el más nuevo salga primero arriba
  registros.reverse().forEach(registro => {
    const li = document.createElement("li");
    const estadoTexto = registro.estado ? "<span class='txt-on'>Encendido</span>" : "<span class='txt-off'>Apagado</span>";
    li.innerHTML = `${estadoTexto} - ${registro.hora}`;
    listaHistorial.appendChild(li);
  });
});
