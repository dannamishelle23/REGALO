import { recuerdos } from "./data/recuerdos.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const escapeHtml = (v="") => String(v).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function cardTemplate(r, i) {
  const song = r.musica || {};
  const hasSpotify = Boolean(song.spotifyUrl);
  return `<article class="flip-card" data-card="${i}"><div class="flip-card__inner">
    <section class="flip-card__face flip-card__front"><span class="bug-id">${escapeHtml(r.id)}</span><p class="card-kicker">EVIDENCIA #${String(i+1).padStart(2,"0")}</p><h3>${escapeHtml(r.titulo)}</h3><p>${escapeHtml(r.resumen)}</p><button class="boton boton--secundario card-flip" type="button" aria-expanded="false">↻ VER EVIDENCIA</button></section>
    <section class="flip-card__face flip-card__back"><span class="bug-id">${escapeHtml(r.id)} / DETALLE</span><h3>${escapeHtml(r.titulo)}</h3><p>${escapeHtml(r.descripcion)}</p><blockquote>“${escapeHtml(r.frase)}”</blockquote>
      <div class="song-box"><span>♫</span><div><strong>${escapeHtml(song.titulo || "Sin canción asignada")}</strong><small>${escapeHtml(song.artista || "")}</small></div></div>
      ${hasSpotify ? `<a class="boton boton--spotify" href="${escapeHtml(song.spotifyUrl)}" target="_blank" rel="noopener noreferrer">ESCUCHAR EN SPOTIFY ↗</a>` : `<span class="song-pending">Enlace de Spotify pendiente</span>`}
      <button class="boton boton--secundario card-flip" type="button" aria-expanded="true">← VOLVER</button></section>
  </div></article>`;
}

export function iniciarTarjetas() {
  const track=document.querySelector("#recuerdos-track"); if(!track||!recuerdos.length)return;
  track.innerHTML=recuerdos.map(cardTemplate).join("");
  const cards=[...track.querySelectorAll(".flip-card")], prev=document.querySelector("#card-prev"), next=document.querySelector("#card-next"), counter=document.querySelector("#card-counter");
  cards.forEach(card=>card.querySelectorAll(".card-flip").forEach(button=>button.addEventListener("click",()=>{const f=card.classList.toggle("is-flipped");card.querySelectorAll(".card-flip").forEach(b=>b.setAttribute("aria-expanded",String(f)));})));
  let index=0; const update=(target,focus=false)=>{index=Math.max(0,Math.min(cards.length-1,target));cards[index].scrollIntoView({behavior:reducedMotion.matches?"auto":"smooth",block:"nearest",inline:"center"});counter.textContent=`${index+1} / ${cards.length}`;prev.disabled=index===0;next.disabled=index===cards.length-1;if(focus)cards[index].querySelector(".card-flip")?.focus({preventScroll:true});};
  prev.addEventListener("click",()=>update(index-1,true)); next.addEventListener("click",()=>update(index+1,true));
  track.addEventListener("scroll",()=>{if(matchMedia("(min-width: 768px)").matches)return;const center=track.scrollLeft+track.clientWidth/2;let closest=0,distance=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);if(d<distance){distance=d;closest=i}});index=closest;counter.textContent=`${index+1} / ${cards.length}`;prev.disabled=index===0;next.disabled=index===cards.length-1;},{passive:true}); update(0);
}
