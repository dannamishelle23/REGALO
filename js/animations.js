const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const played = new Set();

async function typeText(element, text, speed = 34) {
  if (reduceMotion.matches) { element.textContent = text; return; }
  element.textContent = ""; element.classList.add("is-typing", "is-visible");
  for (const char of text) { element.textContent += char; await sleep(char === "." ? speed * 2.2 : speed); }
  element.classList.remove("is-typing");
}

async function revealTitle(section) {
  const title = section.querySelector("[data-motion-title]");
  if (!title) return;
  const text = title.textContent;
  title.classList.add("title-enter");
  if (!reduceMotion.matches) await sleep(130);
  await typeText(title, text, 46);
}

export async function animarIntroduccion() {
  const section=document.querySelector("#error-sistema"); if(!section||played.has("intro"))return; played.add("intro");
  const title=section.querySelector("[data-motion-title]"); if(title){const text=title.textContent;title.classList.add("title-enter");if(!reduceMotion.matches)await sleep(260);await typeText(title,text,115);}
  for(const item of section.querySelectorAll("[data-intro-stage]")){item.classList.add("is-visible");if(!reduceMotion.matches)await sleep(260);}
  const action=section.querySelector("[data-intro-action]");action?.classList.add("is-visible");action?.setAttribute("aria-hidden","false");action?.removeAttribute("tabindex");
}
export async function animarDiagnostico() {
  if (played.has("diagnostico")) return;
  played.add("diagnostico");

  const section = document.querySelector("#diagnostico");
  const action = section?.querySelector("[data-diagnostico-action]");
  if (!section) return;

  // El botón debe permanecer oculto hasta que terminen las dos tarjetas.
  action?.classList.remove("is-visible");
  action?.setAttribute("aria-hidden", "true");
  action?.setAttribute("tabindex", "-1");

  await revealTitle(section);

  const lines = [...section.querySelectorAll("[data-type-text]")];
  const copy = section.querySelector("[data-diagnostico-copy]");

  for (const line of lines) {
    await typeText(
      line,
      line.dataset.typeText,
      line.classList.contains("declaracion--typing") ? 72 : 30
    );

    if (!reduceMotion.matches) {
      await sleep(line.classList.contains("terminal-line--error") ? 380 : 150);
    }
  }

  copy?.classList.add("is-visible");
  if (!reduceMotion.matches) await sleep(500);

  const cards = [...section.querySelectorAll("[data-diagnostic-card]")];

  for (const card of cards) {
    // Se agregan ambas clases para que funcione con los estilos anteriores y nuevos.
    card.classList.add("is-visible", "is-revealed");
    if (!reduceMotion.matches) await sleep(420);

    if (card.hasAttribute("data-interview-card")) {
      const pieces = [...card.querySelectorAll("[data-interview-piece]")];

      for (const piece of pieces) {
        piece.classList.add("is-visible");
        if (!reduceMotion.matches) await sleep(700);
      }
    } else {
      const fields = [...card.querySelectorAll("[data-field-text]")];

      for (const field of fields) {
        const value = field.dataset.fieldText || field.textContent;
        field.textContent = value;
        field.classList.add("is-visible", "field-reveal");

        if (!reduceMotion.matches) await sleep(180);
      }
    }

    if (!reduceMotion.matches) await sleep(350);
  }

  // Solo aparece cuando entrevista + causa raíz terminaron.
  action?.classList.add("is-visible");
  action?.setAttribute("aria-hidden", "false");
  action?.removeAttribute("tabindex");
}

export async function animarHistorial() {
  if (played.has("historial")) return; played.add("historial");
  const section=document.querySelector("#historial");
  await revealTitle(section);
  section.classList.add("content-enter");
}

function animateCounter(element, target, duration = 1650) {
  if (!element) return Promise.resolve();
  if (reduceMotion.matches) { element.textContent = target; return Promise.resolve(); }
  return new Promise((resolve) => {
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else { element.textContent = target; resolve(); }
    };
    requestAnimationFrame(tick);
  });
}

export async function animarFinal() {
  if (played.has("final")) return;
  played.add("final");
  const section = document.querySelector("#informe-final");
  await revealTitle(section);
  const panel = section.querySelector("[data-final-reveal]");
  const status = section.querySelector("[data-final-status]");
  const daysCard = section.querySelector("[data-dias-card]");
  const counter = section.querySelector("[data-days-counter]");
  const birthday = section.querySelector("[data-felicitacion-reveal]");
  panel?.classList.add("is-visible");
  if (!reduceMotion.matches) await sleep(420);
  status?.classList.add("is-visible");
  if (!reduceMotion.matches) await sleep(1100);
  daysCard?.classList.add("is-visible");
  daysCard?.setAttribute("aria-hidden", "false");
  await animateCounter(counter, 502, 1650);
  if (!reduceMotion.matches) await sleep(2500);
  birthday?.classList.add("is-visible");
  birthday?.setAttribute("aria-hidden", "false");
}

