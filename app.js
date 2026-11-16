// 1. Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiW9wT6wBcI54zhAiR_4bV4HqMGC037wU",
  databaseURL: "https://tp-robotica-y-progracion-default-rtdb.firebaseio.com",
  projectId: "tp-robotica-y-progracion"
};

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3. Referencias a los elementos del HTML
const btnLuz = document.getElementById("btn-luz");
const distanciaTexto = document.getElementById("distancia-texto");

// Variable para guardar el estado actual de la luz
let estadoActual = false;

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

// 5. Leer la distancia del sensor ultrasónico en tiempo real
db.ref("/Luz/distancia").on("value", (snapshot) => {
  const distancia = snapshot.val();
  if (distancia !== null) {
    distanciaTexto.textContent = distancia.toFixed(2) + " cm";
  }
});

// 6. Cambiar el estado al hacer clic en el botón
btnLuz.addEventListener("click", () => {
  // Invierte el estado actual y lo envía a Firebase
  const nuevoEstado = !estadoActual;
  db.ref("/Luz/estado").set(nuevoEstado)
    .then(() => console.log("Estado actualizado a:", nuevoEstado))
    .catch((error) => console.error("Error al actualizar:", error));
});
