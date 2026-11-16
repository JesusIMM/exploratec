// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiW9wT6wBcI54zhAiR_4bV4HqMGC037wU",
  databaseURL: "https://tp-robotica-y-progracion-default-rtdb.firebaseio.com",
  projectId: "tp-robotica-y-progracion"
};

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3. Referencias al botón HTML
const btnLuz = document.getElementById("btn-luz");
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

// 5. Cambiar el estado al hacer clic
btnLuz.addEventListener("click", () => {
  const nuevoEstado = !estadoActual;
  db.ref("/Luz/estado").set(nuevoEstado)
    .then(() => console.log("Estado actualizado a:", nuevoEstado))
    .catch((error) => console.error("Error al actualizar:", error));
});
