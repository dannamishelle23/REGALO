const SELECTOR = ".pantalla";

export function mostrarPantalla(id) {
  const destino = document.getElementById(id);
  if (!destino) return;

  document.querySelectorAll(SELECTOR).forEach((pantalla) => {
    const activa = pantalla === destino;
    pantalla.hidden = !activa;
    pantalla.classList.toggle("pantalla--activa", activa);
  });

  destino.scrollIntoView({ behavior: "smooth", block: "start" });
  const foco = destino.querySelector("h1, h2");
  document.dispatchEvent(new CustomEvent("pantalla:cambio", { detail: { id } }));
  if (foco) {
    foco.setAttribute("tabindex", "-1");
    window.setTimeout(() => foco.focus({ preventScroll: true }), 260);
  }
}

export function iniciarNavegacion() {
  document.querySelectorAll("[data-next]").forEach((boton) => {
    boton.addEventListener("click", () => mostrarPantalla(boton.dataset.next));
  });
}
