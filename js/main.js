import { cargarContenido } from "./content.js";
import { iniciarNavegacion } from "./navigation.js";
import { iniciarTarjetas } from "./cards.js";
import { animarIntroduccion, animarDiagnostico, animarHistorial, animarFinal } from "./animations.js";

document.addEventListener("DOMContentLoaded", () => {
  cargarContenido();
  iniciarNavegacion();
  iniciarTarjetas();
  animarIntroduccion();
  document.addEventListener("pantalla:cambio", (event) => {
    if (event.detail.id === "diagnostico") animarDiagnostico();
    if (event.detail.id === "historial") animarHistorial();
    if (event.detail.id === "informe-final") animarFinal();
  });
});
